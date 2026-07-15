from __future__ import annotations
import csv, io, secrets
from datetime import UTC, datetime
from fastapi import HTTPException, UploadFile, status
from auth.provisioning import provision_user_credentials
from core.context import TenantContext
from core.enums import Role
from core.security import hash_password
from domains.repository import DomainRepository
from hr.models import BulkUploadResult, MemberCreate
from rbac.permissions import permissions_for_role


class HRService:
    def __init__(self, db):
        self.db = db
        self.users = db["users"]
        self.domains = DomainRepository(db)

    async def add_member(self, ctx: TenantContext, m: MemberCreate) -> dict:
        if await self.users.find_one({"org_id": ctx.org_id, "email": m.email.lower()}):
            raise HTTPException(status.HTTP_409_CONFLICT, f"{m.email} already exists")
        if m.domain_id and not await self.domains.find_by_id(ctx.org_id, m.domain_id):
            raise HTTPException(status.HTTP_400_BAD_REQUEST, "Invalid domain_id")
        role = Role(m.role) if m.role in Role._value2member_map_ else Role.EMPLOYEE
        # For Role.CUSTOM, m.permissions carries the hand-picked list; for
        # built-in roles this is ignored and the role's fixed set is used.
        computed_permissions = list(permissions_for_role(role, custom=m.permissions))
        unusable_password = secrets.token_urlsafe(32)  # random, never shown or emailed — member sets their own
        r = await self.users.insert_one({"org_id": ctx.org_id, "email": m.email.lower(), "full_name": m.full_name,
            "hashed_password": hash_password(unusable_password), "role": role.value,
            "permissions": computed_permissions, "domain_id": m.domain_id,
            "is_active": True, "must_reset_password": True,
            "created_at": datetime.now(UTC), "updated_at": datetime.now(UTC)})
        user_id = str(r.inserted_id)

        if m.domain_id:
            await self.domains.increment_member_count(ctx.org_id, m.domain_id, 1)

        await provision_user_credentials(self.db, ctx.org_id, user_id, m.email, m.full_name)

        return {"id": user_id, "email": m.email, "role": role.value}

    async def bulk_upload_csv(self, ctx: TenantContext, file: UploadFile) -> BulkUploadResult:
        content = await file.read()
        text = content.decode("utf-8-sig", errors="replace")
        reader = csv.DictReader(io.StringIO(text))
        total = created = skipped = 0; errors = []
        for row in reader:
            total += 1
            try:
                email = (row.get("email") or row.get("Email") or "").strip()
                name = (row.get("full_name") or row.get("name") or row.get("Name") or "").strip()
                role = (row.get("role") or "employee").strip().lower()
                if not email or not name: errors.append(f"Row {total}: missing email/name"); skipped += 1; continue
                await self.add_member(ctx, MemberCreate(email=email, full_name=name, role=role))
                created += 1
            except HTTPException as e: skipped += 1; errors.append(f"Row {total}: {e.detail}")
            except Exception as e: skipped += 1; errors.append(f"Row {total}: {str(e)}")
        return BulkUploadResult(total=total, created=created, skipped=skipped, errors=errors)