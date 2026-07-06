from pydantic import BaseModel, EmailStr, Field
class MemberCreate(BaseModel):
    email: EmailStr; full_name: str = Field(min_length=2)
    role: str = Field(default="employee"); domain_id: str | None = None

class BulkUploadResult(BaseModel):
    total: int; created: int; skipped: int; errors: list[str]
