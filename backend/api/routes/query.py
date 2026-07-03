from fastapi import APIRouter, Depends
from api.dependencies.check_permissions import require_permission
from api.dependencies.get_database import DatabaseDependency
from audit.repository import AuditLogRepository
from audit.service import AuditService
from core.context import TenantContext
from rag.models import QueryRequest, QueryResponse
from rag.service import run_rag

router = APIRouter(prefix="/query", tags=["query"])

@router.post("", response_model=QueryResponse)
async def query(
    request: QueryRequest,
    db: DatabaseDependency,
    context: TenantContext = Depends(require_permission("query:run")),
) -> QueryResponse:
    result = await run_rag(context, request)
    audit = AuditService(AuditLogRepository(db))
    await audit.log_query(context, request.query, result.model_dump())
    return result
