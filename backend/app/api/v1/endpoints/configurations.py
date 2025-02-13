from typing import Any, List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func

from app import crud
from app.models import Configuration, Member
from app.schemas import configuration as schemas
from app.api import deps
from app.core.config import settings

router = APIRouter()

@router.post("/", response_model=schemas.ConfigurationInDB)
def create_configuration(
    *,
    db: Session = Depends(deps.get_db),
    configuration_in: schemas.ConfigurationCreate,
) -> Any:
    """
    Create new configuration.
    """
    configuration = crud.configuration.create(db=db, obj_in=configuration_in)
    return configuration

@router.get("/", response_model=schemas.ConfigurationResponse)
async def list_configurations(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    type_filter: Optional[str] = Query(None, description="Filter by configuration type (CER, GAC, etc.)"),
    status: Optional[str] = Query(None, description="Filter by status (draft, active, inactive)"),
    search: Optional[str] = Query(None, description="Search in name and description"),
):
    """
    Retrieve configurations with optional filtering.
    """
    query = db.query(
        Configuration,
        func.count(Member.id).label('participant_count')
    ).outerjoin(
        Member,
        Configuration.id == Member.configuration_id
    ).group_by(Configuration.id)

    # Apply filters
    if type_filter:
        query = query.filter(Configuration.type == type_filter)
    if status:
        query = query.filter(Configuration.status == status)
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            (Configuration.name.ilike(search_term)) |
            (Configuration.description.ilike(search_term))
        )

    # Get total count for pagination
    total = query.count()

    # Apply pagination
    query = query.offset(skip).limit(limit)

    # Execute query
    results = query.all()

    # Convert results to response model
    configurations = []
    for config, participant_count in results:
        config_dict = {
            "id": config.id,
            "name": config.name,
            "description": config.description,
            "type": config.type,
            "legal_type": config.legal_type,
            "status": config.status,
            "address": config.address,
            "location": config.location,
            "region": config.region,
            "participant_count": participant_count,
            "is_active": config.is_active,
            "created_at": config.created_at,
            "updated_at": config.updated_at
        }
        configurations.append(schemas.ConfigurationList(**config_dict))

    # Calculate pagination info
    total_pages = (total + limit - 1) // limit
    current_page = skip // limit

    return {
        "items": configurations,
        "total": total,
        "total_pages": total_pages,
        "page": current_page,
        "size": limit
    }

@router.get("/{configuration_id}", response_model=schemas.ConfigurationWithStats)
async def get_configuration(
    configuration_id: int,
    db: Session = Depends(deps.get_db)
):
    """
    Get detailed configuration information including statistics.
    """
    config = crud.configuration.get(db, id=configuration_id)
    if not config:
        raise HTTPException(status_code=404, detail="Configuration not found")

    # Get participant count
    participant_count = db.query(func.count(Member.id)).filter(
        Member.configuration_id == configuration_id
    ).scalar()

    # Get energy statistics (implement according to your energy tracking model)
    # This is a placeholder - implement actual energy calculations
    energy_stats = {
        "total_energy_produced": 0.0,
        "total_energy_consumed": 0.0,
        "total_energy_shared": 0.0,
        "co2_saved": 0.0,
        "trees_equivalent": 0
    }

    # Combine configuration data with statistics
    config_data = {
        **config.__dict__,
        "participant_count": participant_count,
        **energy_stats
    }

    return schemas.ConfigurationWithStats(**config_data)

@router.put("/{configuration_id}", response_model=schemas.ConfigurationInDB)
def update_configuration(
    *,
    db: Session = Depends(deps.get_db),
    configuration_id: int,
    configuration_in: schemas.ConfigurationUpdate,
) -> Any:
    """
    Update existing configuration.
    """
    configuration = crud.configuration.get(db=db, id=configuration_id)
    if not configuration:
        raise HTTPException(status_code=404, detail="Configuration not found")
    
    # Update configuration
    configuration = crud.configuration.update(db=db, db_obj=configuration, obj_in=configuration_in)
    
    # Handle participants/members
    if hasattr(configuration_in, 'participants'):
        # Remove existing members that are not in the new list
        existing_members = crud.member.get_by_configuration(db=db, configuration_id=configuration_id)
        existing_member_ids = {m.user_id: m for m in existing_members if m.user_id}
        
        # Process new participants
        for participant in configuration_in.participants:
            member_data = {
                "name": participant.name,
                "type": participant.type,
                "pod_id": participant.pod_id,
                "smart_meter_id": participant.smart_meter_id,
                "address": participant.address if hasattr(participant, 'address') else "",
                "load_profile_type": participant.profile.type if participant.profile else "residential",
                "contracted_power": 0.0,  # Default value, should be updated with real data
                "configuration_id": configuration_id,
                "user_id": participant.user_id if participant.user_type == 'real' else None,
                "is_active": True,
                "verification_status": "verified",
                "technical_info": {},
                "device_info": {},
                "energy_sharing_preferences": {},
                "fiscal_code": participant.fiscal_code if hasattr(participant, 'fiscal_code') else None,
                "billing_address": participant.address if hasattr(participant, 'address') else None,
                "billing_preferences": {}
            }
            
            if participant.user_type == 'real' and participant.user_id:
                if participant.user_id in existing_member_ids:
                    # Update existing member
                    member = existing_member_ids[participant.user_id]
                    crud.member.update(db=db, db_obj=member, obj_in=member_data)
                    del existing_member_ids[participant.user_id]
                else:
                    # Create new member
                    crud.member.create(db=db, obj_in=schemas.MemberCreate(**member_data))
            else:
                # Create simulated member
                crud.member.create(db=db, obj_in=schemas.MemberCreate(**member_data))
        
        # Remove members that are no longer in the configuration
        for member in existing_member_ids.values():
            db.delete(member)
        
        db.commit()
    
    return configuration

@router.delete("/{configuration_id}", response_model=schemas.ConfigurationInDB)
def delete_configuration(
    *,
    db: Session = Depends(deps.get_db),
    configuration_id: int,
) -> Any:
    """
    Delete configuration.
    """
    configuration = crud.configuration.get(db=db, id=configuration_id)
    if not configuration:
        raise HTTPException(status_code=404, detail="Configuration not found")
    configuration = crud.configuration.remove(db=db, id=configuration_id)
    return configuration 