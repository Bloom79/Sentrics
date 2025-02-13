from typing import Any, Dict, Optional, Union

from sqlalchemy.orm import Session

from app.crud.base import CRUDBase
from app.models.member import Member
from app.schemas.member import MemberCreate, MemberUpdate

class CRUDMember(CRUDBase[Member, MemberCreate, MemberUpdate]):
    def get_by_pod_id(self, db: Session, *, pod_id: str) -> Optional[Member]:
        return db.query(Member).filter(Member.pod_id == pod_id).first()

    def get_by_smart_meter_id(self, db: Session, *, smart_meter_id: str) -> Optional[Member]:
        return db.query(Member).filter(Member.smart_meter_id == smart_meter_id).first()

    def create(self, db: Session, *, obj_in: MemberCreate) -> Member:
        db_obj = Member(
            name=obj_in.name,
            address=obj_in.address,
            type=obj_in.type,
            pod_id=obj_in.pod_id,
            smart_meter_id=obj_in.smart_meter_id,
            meter_type=obj_in.meter_type,
            load_profile_type=obj_in.load_profile_type,
            contracted_power=obj_in.contracted_power,
            voltage_level=obj_in.voltage_level,
            is_active=obj_in.is_active,
            activation_date=obj_in.activation_date,
            verification_status=obj_in.verification_status,
            technical_info=obj_in.technical_info or {},
            device_info=obj_in.device_info or {},
            energy_sharing_preferences=obj_in.energy_sharing_preferences or {},
            fiscal_code=obj_in.fiscal_code,
            billing_address=obj_in.billing_address,
            billing_preferences=obj_in.billing_preferences or {},
            configuration_id=obj_in.configuration_id,
            user_id=obj_in.user_id
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update(
        self, db: Session, *, db_obj: Member, obj_in: Union[MemberUpdate, Dict[str, Any]]
    ) -> Member:
        if isinstance(obj_in, dict):
            update_data = obj_in
        else:
            update_data = obj_in.dict(exclude_unset=True)
        return super().update(db, db_obj=db_obj, obj_in=update_data)

    def get_by_configuration(self, db: Session, *, configuration_id: int) -> list[Member]:
        return db.query(Member).filter(Member.configuration_id == configuration_id).all()

    def get_by_user(self, db: Session, *, user_id: int) -> list[Member]:
        return db.query(Member).filter(Member.user_id == user_id).all()

member = CRUDMember(Member) 