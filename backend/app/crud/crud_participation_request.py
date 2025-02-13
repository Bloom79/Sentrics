from typing import List, Optional
from datetime import datetime
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.crud.base import CRUDBase
from app.models.participation_request import ParticipationRequest, RequestStatus
from app.schemas.participation_request import ParticipationRequestCreate, ParticipationRequestUpdate
from app.models.user import User
from app.models.configuration import Configuration

class CRUDParticipationRequest(CRUDBase[ParticipationRequest, ParticipationRequestCreate, ParticipationRequestUpdate]):
    def get_pending_requests(self, db: Session) -> List[ParticipationRequest]:
        return db.query(self.model).filter(self.model.status == RequestStatus.PENDING).all()

    def get_requests_by_user(self, db: Session, user_id: int) -> List[ParticipationRequest]:
        return db.query(self.model).filter(self.model.user_id == user_id).all()

    def get_requests_by_configuration(self, db: Session, configuration_id: int) -> List[ParticipationRequest]:
        return db.query(self.model).filter(self.model.configuration_id == configuration_id).all()

    def update_request_status(
        self, 
        db: Session, 
        request_id: int, 
        status: RequestStatus,
        notes: Optional[str] = None
    ) -> Optional[ParticipationRequest]:
        request = db.query(self.model).filter(self.model.id == request_id).first()
        if request:
            request.status = status
            request.processed_date = datetime.now()
            if notes:
                request.notes = notes
            db.commit()
            db.refresh(request)
        return request

    def get_requests_with_details(self, db: Session) -> List[dict]:
        query = select(
            self.model,
            User.name.label('user_name'),
            User.email.label('user_email'),
            Configuration.name.label('configuration_name')
        ).join(
            User, self.model.user_id == User.id
        ).join(
            Configuration, self.model.configuration_id == Configuration.id
        )
        
        results = []
        for row in db.execute(query).all():
            request_dict = row[0].__dict__
            request_dict.update({
                'user_name': row[1],
                'user_email': row[2],
                'configuration_name': row[3]
            })
            results.append(request_dict)
        return results

participation_request = CRUDParticipationRequest(ParticipationRequest) 