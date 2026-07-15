from fastapi import APIRouter, Depends

from api.dependencies.check_permissions import require_permission
from api.dependencies.get_database import DatabaseDependency
from core.context import TenantContext
from documents.repository import DocumentRepository
from documents.service import DocumentService

router = APIRouter(prefix="/knowledge-map", tags=["Knowledge Map"])


def get_service(db: DatabaseDependency) -> DocumentService:
    return DocumentService(DocumentRepository(db))


def _value(v):
    """Handles both plain strings and enum members (e.g. DocumentStatus.ACTIVE)."""
    return str(v.value if hasattr(v, "value") else v).upper()


@router.get("/documents")
async def get_knowledge_map_documents(
    # Reusing "documents:read" — this is just a different view of the same
    # documents a user can already see on the Documents page. Swap this for
    # a dedicated permission (e.g. "knowledge-map:read") if you want to
    # gate it separately.
    context: TenantContext = Depends(require_permission("documents:read")),
    service: DocumentService = Depends(get_service),
):
    """
    Returns document metadata shaped for the Knowledge Map solar-system view.
    Visibility is delegated entirely to DocumentService.list_documents, so it
    stays in sync with whatever rules the Documents page uses (Public/Internal/
    Confidential tiers, org super admin bypass) rather than duplicating that
    logic here.
    """
    docs = await service.list_documents(context)

    shaped = []
    by_classification: dict[str, int] = {}

    for doc in docs:
        classification = _value(doc.classification)
        by_classification[classification] = by_classification.get(classification, 0) + 1

        shaped.append({
            "id": doc.id,
            "filename": doc.filename,
            "classification": classification,
            "status": _value(doc.status),
            "usage_tag": doc.usage_tag,
            "age_tag": doc.age_tag,
            "document_weight": doc.document_weight,
        })

    return {
        "documents": shaped,
        "stats": {"total": len(shaped), "by_classification": by_classification},
    }