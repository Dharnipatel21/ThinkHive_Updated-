'''
from pydantic import BaseModel, EmailStr, Field
class MemberCreate(BaseModel):
    email: EmailStr; full_name: str = Field(min_length=2)
    role: str = Field(default="employee"); domain_id: str | None = None

class BulkUploadResult(BaseModel):
    total: int; created: int; skipped: int; errors: list[str]
'''

from pydantic import BaseModel, EmailStr, Field


class MemberCreate(BaseModel):
    email: EmailStr
    full_name: str = Field(min_length=2)
    role: str = Field(default="employee")
    domain_id: str | None = None
    # Only meaningful when role == "custom" — ignored (recomputed from the
    # role) for built-in roles, same convention as admin.py's UpdateUserReq.
    permissions: list[str] | None = None


class BulkUploadResult(BaseModel):
    total: int; created: int; skipped: int; errors: list[str]