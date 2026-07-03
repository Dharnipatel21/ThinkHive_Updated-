'''
from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field
from api.dependencies.check_permissions import require_permission
from core.context import TenantContext
from core.embeddings import EmbeddingService
from core.retrieval import QdrantRetrievalService
from rag.service import get_llm

router = APIRouter(prefix="/summary", tags=["summary"])

class SummaryRequest(BaseModel):
    topic: str = Field(min_length=1, max_length=1000)
    limit: int = Field(default=6, ge=1, le=20)

@router.post("")
async def summarize(
    request: SummaryRequest,
    context: TenantContext = Depends(require_permission("query:run")),
) -> dict:
    vec = await EmbeddingService().embed_text(request.topic)
    chunks = await QdrantRetrievalService().search(context, vec, limit=request.limit)
    if not chunks:
        return {"summary": "No relevant documents found for this topic.", "source_count": 0}
    summary = await get_llm().generate(f"Summarise: {request.topic}", chunks)
    return {
        "summary": summary,
        "source_count": len(chunks),
        "sources": [{"document_name": c.metadata.get("document_name",""), "score": round(c.final_score,3)} for c in chunks],
    }

'''





from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from api.dependencies.check_permissions import require_permission
from api.dependencies.get_database import DatabaseDependency
from core.context import TenantContext
from core.embeddings import EmbeddingService
from core.retrieval import QdrantRetrievalService
from rag.service import get_llm

router = APIRouter(prefix="/summary", tags=["summary"])


class SummaryRequest(BaseModel):
    topic: str = Field(min_length=1, max_length=1000)
    doc_id: str | None = None
    limit: int = Field(default=8, ge=1, le=20)


@router.post("")
async def summarize(
    request: SummaryRequest,
    context: TenantContext = Depends(require_permission("query:run")),
) -> dict:
    embedder = EmbeddingService()
    retrieval = QdrantRetrievalService()

    vec = await embedder.embed_text(request.topic)

    doc_ids = [request.doc_id] if request.doc_id else None
    chunks = await retrieval.search(context, vec, limit=request.limit)

    if not chunks:
        return {
            "summary": "No relevant content found. Please upload documents first and try again.",
            "source_count": 0,
            "sources": [],
        }

    # Build combined context for summarisation
    context_text = "\n\n".join(
        f"[{c.metadata.get('document_name', 'Document')}, Page {c.metadata.get('page_number', 1)}]:\n{c.text}"
        for c in chunks[:8]
    )

    llm = get_llm()
    summary_prompt = f"Please provide a comprehensive summary about: {request.topic}"
    summary = await llm.generate(summary_prompt, chunks)

    return {
        "summary": summary,
        "source_count": len(chunks),
        "sources": [
            {
                "document_name": c.metadata.get("document_name", ""),
                "page_number": c.metadata.get("page_number", 1),
                "score": round(c.final_score, 3),
            }
            for c in chunks
        ],
    }