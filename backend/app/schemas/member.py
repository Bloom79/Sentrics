from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, Field
from app.models.member import MemberType, LoadProfileType, UserType, MemberStatus

class MemberBase(BaseModel):
    name: str
    address: str
    type: MemberType  # consumer, producer, prosumer
    user_type: UserType = UserType.REAL
    status: MemberStatus = MemberStatus.ACTIVE
    pod_id: str
    smart_meter_id: Optional[str] = None
    meter_type: Optional[str] = None
    load_profile_type: LoadProfileType  # residential, commercial, industrial
    contracted_power: float
    voltage_level: Optional[str] = None
    is_active: bool = True
    activation_date: Optional[datetime] = None
    verification_status: Optional[str] = None
    technical_info: Optional[dict] = Field(default_factory=dict)
    device_info: Optional[dict] = Field(default_factory=dict)
    energy_sharing_preferences: Optional[dict] = Field(default_factory=dict)
    fiscal_code: Optional[str] = None
    billing_address: Optional[str] = None
    billing_preferences: Optional[dict] = Field(default_factory=dict)
    configuration_id: int
    user_id: Optional[int] = None

class MemberCreate(MemberBase):
    pass

class MemberUpdate(MemberBase):
    pass

class MemberInDBBase(MemberBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class MemberInDB(MemberInDBBase):
    pass

class Member(MemberInDBBase):
    pass

class MemberList(BaseModel):
    id: int
    name: str
    type: str
    user_type: str
    status: str
    pod_id: str
    smart_meter_id: Optional[str] = None
    meter_type: Optional[str] = None
    address: str
    activation_date: Optional[datetime] = None
    verification_status: Optional[str] = None
    contracted_power: Optional[float] = None
    voltage_level: Optional[str] = None
    energy_produced: float = 0
    energy_consumed: float = 0
    energy_shared: float = 0
    created_at: datetime
    configuration_id: int
    user_id: Optional[int] = None

class MemberDetail(MemberInDB):
    energy_produced: float = 0
    energy_consumed: float = 0
    energy_shared: float = 0

class MemberResponse(BaseModel):
    items: List[MemberList]
    total: int
    page: int
    size: int 