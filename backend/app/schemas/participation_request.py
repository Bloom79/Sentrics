from datetime import datetime
from typing import Optional
from pydantic import BaseModel
from app.models.participation_request import RequestStatus

class ParticipationRequestBase(BaseModel):
    user_id: int
    configuration_id: int
    notes: Optional[str] = None

class ParticipationRequestCreate(ParticipationRequestBase):
    pass

class ParticipationRequestUpdate(BaseModel):
    status: RequestStatus
    notes: Optional[str] = None

class ParticipationRequestInDB(ParticipationRequestBase):
    id: int
    status: RequestStatus
    request_date: datetime
    processed_date: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class ParticipationRequestWithDetails(ParticipationRequestInDB):
    user_name: str
    user_email: str
    configuration_name: str

    class Config:
        from_attributes = True 