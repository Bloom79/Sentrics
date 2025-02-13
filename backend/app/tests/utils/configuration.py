from typing import Dict

from sqlalchemy.orm import Session

from app import crud, models
from app.schemas.configuration import ConfigurationCreate
from app.tests.utils.utils import random_lower_string

def create_random_configuration(db: Session) -> models.Configuration:
    name = random_lower_string()
    description = random_lower_string()
    config_in = ConfigurationCreate(
        name=name,
        description=description,
        type="residential",
        version="1.0",
        energy_source="solar",
        capacity=100.5,
        address="123 Test St",
        location={"lat": 45.5, "lng": -122.6},
        region="Test Region",
        primary_substation_id="SUB123",
        legal_type="cooperative",
        features={},
        restrictions={},
        technical_info={},
        simulation_settings={},
        billing_settings={},
        member_limits={}
    )
    return crud.configuration.create(db=db, obj_in=config_in) 