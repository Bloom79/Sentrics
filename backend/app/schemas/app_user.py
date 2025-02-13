from typing import Optional, Dict, List
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field

# Shared properties
class AppUserBase(BaseModel):
    email: Optional[EmailStr] = None
    username: Optional[str] = None
    is_active: Optional[bool] = True
    is_superuser: bool = False
    full_name: Optional[str] = None
    tenant_id: Optional[int] = None
    organization_id: Optional[int] = None
    organization_name: Optional[str] = None
    role: Optional[str] = Field(default="user")
    permissions: Optional[Dict[str, List[str]]] = Field(default_factory=lambda: {"permissions": []})

# Properties to receive via API on creation
class AppUserCreate(AppUserBase):
    email: EmailStr
    username: str
    password: str
    tenant_id: Optional[int] = None
    organization_id: Optional[int] = None
    organization_name: Optional[str] = None

# Properties to receive via API on update
class AppUserUpdate(AppUserBase):
    password: Optional[str] = None

# Properties shared by models stored in DB
class AppUserInDBBase(AppUserBase):
    id: int
    email: EmailStr
    username: str
    is_active: bool
    tenant_id: Optional[int]
    organization_id: Optional[int]
    organization_name: Optional[str]
    role: str
    permissions: Dict[str, List[str]]
    created_at: datetime
    updated_at: Optional[datetime] = None
    last_login: Optional[datetime] = None

    class Config:
        from_attributes = True

# Additional properties to return via API
class AppUser(AppUserInDBBase):
    pass

# Additional properties stored in DB
class AppUserInDB(AppUserInDBBase):
    hashed_password: str 