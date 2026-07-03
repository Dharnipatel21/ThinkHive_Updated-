from fastapi import APIRouter, Depends, File, UploadFile
from api.dependencies.check_permissions import require_permission
from api.dependencies.get_database import DatabaseDependency
from core.context import TenantContext
from hr.models import BulkUploadResult, MemberCreate
from hr.service import HRService

router = APIRouter(prefix="/hr", tags=["hr"])

def get_svc(db: DatabaseDependency) -> HRService:
    return HRService(db)

@router.get("/members")
async def list_members(db: DatabaseDependency, context: TenantContext = Depends(require_permission("admin:read"))) -> dict:
    cursor = db["users"].find({"org_id": context.org_id}, {"hashed_password": 0}).limit(200)
    users = []
    async for u in cursor:
        u["id"] = str(u.pop("_id")); users.append(u)
    return {"members": users, "total": len(users)}

@router.post("/members", status_code=201)
async def add_member(member: MemberCreate, context: TenantContext = Depends(require_permission("admin:manage")), svc: HRService = Depends(get_svc)) -> dict:
    return await svc.add_member(context, member)

@router.post("/bulk-upload", response_model=BulkUploadResult)
async def bulk_upload(file: UploadFile = File(...), context: TenantContext = Depends(require_permission("admin:manage")), svc: HRService = Depends(get_svc)) -> BulkUploadResult:
    return await svc.bulk_upload_csv(context, file)
