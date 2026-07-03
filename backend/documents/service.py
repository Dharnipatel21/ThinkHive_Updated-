from __future__ import annotations
import uuid
from pathlib import Path
from fastapi import HTTPException, UploadFile, status
from config import settings
from core.chunking import chunk_text
from core.context import TenantContext
from core.embeddings import EmbeddingService
from core.enums import AgeTag, DocumentClassification, DocumentStatus, FreshnessTag, UsageTag
from core.extraction.docx_extractor import extract_docx
from core.extraction.ocr_extractor import extract_ocr
from core.extraction.pdf_extractor import extract_pdf
from core.extraction.txt_extractor import extract_txt
from core.retrieval import QdrantRetrievalService
from core.sanitisation.service import SanitisationService
from documents.models import DocumentRead, UploadResponse
from documents.repository import DocumentRepository


class DocumentService:
    def __init__(self, repository: DocumentRepository):
        self.repo = repository
        self.embedder = EmbeddingService()
        self.retrieval = QdrantRetrievalService()
        self.sanitiser = SanitisationService()

    async def upload(self, context: TenantContext, file: UploadFile, classification: DocumentClassification) -> UploadResponse:
        ext = Path(file.filename or "").suffix.lower()
        if ext not in settings.allowed_upload_extensions:
            raise HTTPException(status.HTTP_415_UNSUPPORTED_MEDIA_TYPE, f"File type {ext} not supported")

        content = await file.read()
        if len(content) > settings.max_upload_size_mb * 1024 * 1024:
            raise HTTPException(status.HTTP_413_REQUEST_ENTITY_TOO_LARGE, "File too large")

        # Extract
        if ext == ".pdf":
            result = await extract_pdf(content)
            if result.metadata.get("ocr_required"):
                result = await extract_ocr(content, is_pdf=True)
        elif ext == ".docx":
            result = await extract_docx(content)
        else:
            result = await extract_txt(content)

        # Sanitise
        sanitised_text, sanitisation_log = self.sanitiser.sanitise(result.text)

        # Save to MongoDB
        doc_id = await self.repo.create_document(context.org_id, {
            "uploaded_by": context.user_id,
            "filename": file.filename,
            "content_type": file.content_type or "application/octet-stream",
            "classification": classification.value,
            "status": DocumentStatus.PROCESSING.value,
            "usage_tag": UsageTag.ACTIVE.value,
            "age_tag": AgeTag.NEW.value,
            "freshness_tag": FreshnessTag.FRESH.value,
            "document_weight": 1.0,
            "metadata": result.metadata,
            "sanitisation_log": sanitisation_log,
            "word_count": len(sanitised_text.split()),
            "query_count": 0,
        })

        # Chunk + embed + index
        await self._index(sanitised_text, doc_id, file.filename or "", context.org_id, classification.value)

        # Mark ready
        await self.repo.update_by_id(context.org_id, doc_id, {"status": DocumentStatus.READY.value})

        saved = await self.repo.find_by_id(context.org_id, doc_id)
        return UploadResponse(document=self._to_read(saved), extracted_text=sanitised_text[:500], extraction_metadata=result.metadata)

    async def _index(self, text, doc_id, doc_name, org_id, classification):
        chunks = chunk_text(text)
        if not chunks:
            return
        items = []
        for i, chunk in enumerate(chunks):
            emb = await self.embedder.embed_passage(chunk)
            items.append({"chunk_id": str(uuid.uuid4()), "chunk_text": chunk, "embedding": emb,
                "document_id": doc_id, "document_name": doc_name, "page_number": 1,
                "chunk_index": i, "org_id": org_id, "classification": classification,
                "document_weight": 1.0, "freshness_tag": "fresh"})
        await self.retrieval.upsert_chunks(items)

    async def list_documents(self, context: TenantContext) -> list[DocumentRead]:
        docs = await self.repo.list_many(context.org_id)
        return [self._to_read(d) for d in docs if d.get("status") != "deleted"]

    async def delete_document(self, context: TenantContext, doc_id: str) -> bool:
        await self.retrieval.delete_document(context.org_id, doc_id)
        return await self.repo.update_by_id(context.org_id, doc_id, {"status": "deleted"})

    @staticmethod
    def _to_read(d: dict) -> DocumentRead:
        return DocumentRead(
            id=str(d["_id"]), org_id=str(d["org_id"]), uploaded_by=str(d["uploaded_by"]),
            filename=d["filename"], content_type=d["content_type"],
            classification=DocumentClassification(d["classification"]),
            status=DocumentStatus(d.get("status", "ready")),
            usage_tag=UsageTag(d.get("usage_tag", "active")),
            age_tag=AgeTag(d.get("age_tag", "new")),
            freshness_tag=FreshnessTag(d.get("freshness_tag", "fresh")),
            document_weight=float(d.get("document_weight", 1.0)),
            metadata=d.get("metadata", {}),
            created_at=d.get("created_at"), updated_at=d.get("updated_at"),
        )
