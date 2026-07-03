from typing import Any
from db.repositories.base import TenantRepository


class DocumentRepository(TenantRepository):
    collection_name = "documents"

    async def create_document(self, org_id: str, data: dict[str, Any]) -> str:
        return await self.insert_one(org_id, data)

    async def find_by_id(self, org_id: str, doc_id: str) -> dict | None:
        return await super().find_by_id(org_id, doc_id)
