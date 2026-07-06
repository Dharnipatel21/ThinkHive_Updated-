from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from api.dependencies.check_permissions import require_permission
from api.dependencies.get_database import DatabaseDependency
from core.context import TenantContext
from documents.repository import DocumentRepository

router = APIRouter(prefix="/document-tags", tags=["document-tags"])

class TagUpdate(BaseModel):
    freshness_tag: str | None = None
    classification: str | None = None
    manually_verified: bool | None = None

@router.put("/{doc_id}")
async def update_tags(doc_id: str, req: TagUpdate, db: DatabaseDependency,
    context: TenantContext = Depends(require_permission("documents:manage"))) -> dict:
    from datetime import UTC, datetime
    update: dict = {}
    if req.freshness_tag: update["freshness_tag"] = req.freshness_tag
    if req.classification: update["classification"] = req.classification
    if req.manually_verified: update["last_verified"] = datetime.now(UTC); update["freshness_tag"] = "fresh"
    if not update: raise HTTPException(status.HTTP_400_BAD_REQUEST, "Nothing to update")
    repo = DocumentRepository(db)
    ok = await repo.update_by_id(context.org_id, doc_id, update)
    if not ok: raise HTTPException(status.HTTP_404_NOT_FOUND, "Document not found")
    return {"updated": True}

@router.get("/{doc_id}/sanitisation-report")
async def sanitisation_report(doc_id: str, db: DatabaseDependency,
    context: TenantContext = Depends(require_permission("documents:read"))) -> dict:
    repo = DocumentRepository(db)
    doc = await repo.find_by_id(context.org_id, doc_id)
    if not doc: raise HTTPException(status.HTTP_404_NOT_FOUND, "Document not found")
    return {"document_id": doc_id, "filename": doc.get("filename"), "sanitisation_log": doc.get("sanitisation_log", []),
            "total_redactions": len(doc.get("sanitisation_log", []))}
