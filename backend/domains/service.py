from fastapi import HTTPException, status
from core.context import TenantContext
from domains.models import DomainCreate, DomainRead
from domains.repository import DomainRepository

class DomainService:
    def __init__(self, repo: DomainRepository):
        self.repo = repo
    async def create_domain(self, ctx: TenantContext, req: DomainCreate) -> DomainRead:
        if await self.repo.find_by_name(ctx.org_id, req.name):
            raise HTTPException(status.HTTP_409_CONFLICT, "Domain name already exists")
        did = await self.repo.create_domain(ctx.org_id, {"name": req.name, "domain_type": req.domain_type, "description": req.description, "member_count": 0, "document_count": 0})
        return DomainRead(id=did, org_id=ctx.org_id, name=req.name, domain_type=req.domain_type, description=req.description)
    async def list_domains(self, ctx: TenantContext) -> list[DomainRead]:
        domains = await self.repo.list_domains(ctx.org_id)
        return [DomainRead(id=str(d["_id"]), org_id=str(d["org_id"]), name=d["name"], domain_type=d.get("domain_type","custom"), description=d.get("description",""), member_count=d.get("member_count",0), document_count=d.get("document_count",0), created_at=d.get("created_at")) for d in domains]
    async def delete_domain(self, ctx: TenantContext, did: str) -> bool:
        doc = await self.repo.find_by_id(ctx.org_id, did)
        if not doc: raise HTTPException(status.HTTP_404_NOT_FOUND, "Domain not found")
        await self.repo.collection.delete_one({"_id": doc["_id"]})
        return True
