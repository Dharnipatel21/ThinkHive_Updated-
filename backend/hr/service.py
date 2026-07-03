from __future__ import annotations
import csv, io
from datetime import UTC, datetime
from fastapi import HTTPException, UploadFile, status
from core.context import TenantContext
from core.enums import Role
from core.security import hash_password
from hr.models import BulkUploadResult, MemberCreate
from rbac.permissions import permissions_for_role

class HRService:
    def __init__(self, db):
        self.users = db["users"]
    async def add_member(self, ctx: TenantContext, m: MemberCreate) -> dict:
        if await self.users.find_one({"org_id": ctx.org_id, "email": m.email.lower()}):
            raise HTTPException(status.HTTP_409_CONFLICT, f"{m.email} already exists")
        role = Role(m.role) if m.role in Role._value2member_map_ else Role.EMPLOYEE
        r = await self.users.insert_one({"org_id": ctx.org_id, "email": m.email.lower(), "full_name": m.full_name,
            "hashed_password": hash_password("TempPass@123"), "role": role.value,
            "permissions": list(permissions_for_role(role)), "domain_id": m.domain_id,
            "is_active": True, "must_reset_password": True,
            "created_at": datetime.now(UTC), "updated_at": datetime.now(UTC)})
        return {"id": str(r.inserted_id), "email": m.email, "role": role.value}
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
