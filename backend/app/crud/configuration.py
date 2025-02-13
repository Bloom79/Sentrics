from typing import List, Optional, Union, Dict, Any
from sqlalchemy.orm import Session
from fastapi.encoders import jsonable_encoder

from app.crud.base import CRUDBase
from app.models.configuration import Configuration
from app.schemas.configuration import ConfigurationCreate, ConfigurationUpdate

class CRUDConfiguration(CRUDBase[Configuration, ConfigurationCreate, ConfigurationUpdate]):
    def create(self, db: Session, *, obj_in: ConfigurationCreate) -> Configuration:
        obj_in_data = jsonable_encoder(obj_in)
        if 'status' not in obj_in_data:
            obj_in_data['status'] = 'draft'
        db_obj = self.model(**obj_in_data)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update(
        self, db: Session, *, db_obj: Configuration, obj_in: Union[ConfigurationUpdate, Dict[str, Any]]
    ) -> Configuration:
        obj_data = jsonable_encoder(db_obj)
        if isinstance(obj_in, dict):
            update_data = obj_in
        else:
            update_data = obj_in.dict(exclude_unset=True)
        
        for field in obj_data:
            if field in update_data:
                setattr(db_obj, field, update_data[field])
        
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def get_multi(
        self, db: Session, *, skip: int = 0, limit: int = 100, status: Optional[str] = None
    ) -> List[Configuration]:
        query = db.query(self.model)
        if status:
            query = query.filter(self.model.status == status)
        return query.offset(skip).limit(limit).all()

configuration = CRUDConfiguration(Configuration) 