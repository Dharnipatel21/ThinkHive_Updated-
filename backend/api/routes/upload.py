'''
from fastapi import APIRouter, Depends, File, UploadFile
from api.dependencies.check_permissions import require_permission
from api.dependencies.get_database import DatabaseDependency
from core.context import TenantContext
from core.enums import DocumentClassification
from documents.models import UploadResponse
from documents.repository import DocumentRepository
from documents.service import DocumentService

router = APIRouter(prefix="/upload", tags=["upload"])


def get_service(db: DatabaseDependency) -> DocumentService:
    return DocumentService(DocumentRepository(db))


@router.post("", response_model=UploadResponse)
async def upload(
    file: UploadFile = File(...),
    classification: DocumentClassification = DocumentClassification.INTERNAL,
    context: TenantContext = Depends(require_permission("documents:upload")),
    service: DocumentService = Depends(get_service),
) -> UploadResponse:
    # Always default to INTERNAL if not specified
    if classification is None:
        classification = DocumentClassification.INTERNAL
    return await service.upload(context, file, classification)

'''

from fastapi import APIRouter, Depends, File, Form, UploadFile
from api.dependencies.check_permissions import require_permission
from api.dependencies.get_database import DatabaseDependency
from core.context import TenantContext
from core.enums import DocumentClassification
from documents.models import UploadResponse
from documents.repository import DocumentRepository
from documents.service import DocumentService

router = APIRouter(prefix="/upload", tags=["upload"])


def get_service(db: DatabaseDependency) -> DocumentService:
    return DocumentService(DocumentRepository(db))


@router.post("", response_model=UploadResponse)
async def upload(
    file: UploadFile = File(...),
    classification: DocumentClassification = Form(DocumentClassification.INTERNAL),
    context: TenantContext = Depends(require_permission("documents:upload")),
    service: DocumentService = Depends(get_service),
) -> UploadResponse:
    return await service.upload(context, file, classification)