from typing import Any
from motor.motor_asyncio import AsyncIOMotorDatabase


class AuthRepository:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.users = db["users"]
        self.orgs = db["organizations"]

    async def find_org_by_slug(self, slug: str) -> dict | None:
        return await self.orgs.find_one({"slug": slug})

    async def find_user_by_email(self, org_id: str, email: str) -> dict | None:
        return await self.users.find_one({"org_id": org_id, "email": email.lower()})

    async def create_org(self, data: dict) -> str:
        from datetime import UTC, datetime
        result = await self.orgs.insert_one({"created_at": datetime.now(UTC), **data})
        return str(result.inserted_id)

    async def create_user(self, data: dict) -> str:
        from datetime import UTC, datetime
        result = await self.users.insert_one({"created_at": datetime.now(UTC), "updated_at": datetime.now(UTC), **data})
        return str(result.inserted_id)
