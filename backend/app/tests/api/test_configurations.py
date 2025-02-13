from typing import Dict
import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app import crud
from app.core.config import settings
from app.tests.utils.configuration import create_random_configuration
from app.tests.utils.utils import random_lower_string
from app.models.configuration import Configuration

def test_create_configuration(
    client: TestClient, superuser_token_headers: Dict[str, str], db: Session
) -> None:
    data = {
        "name": random_lower_string(),
        "description": random_lower_string(),
        "type": "residential",
        "version": "1.0",
        "energy_source": "solar",
        "capacity": 100.5,
        "address": "123 Test St",
        "location": {"lat": 45.5, "lng": -122.6},
        "region": "Test Region",
        "primary_substation_id": "SUB123",
        "legal_type": "cooperative"
    }
    response = client.post(
        f"{settings.API_V1_STR}/configurations/",
        headers=superuser_token_headers,
        json=data,
    )
    assert response.status_code == 200
    content = response.json()
    assert content["name"] == data["name"]
    assert content["description"] == data["description"]
    assert content["type"] == data["type"]
    assert content["energy_source"] == data["energy_source"]
    assert content["capacity"] == data["capacity"]
    assert content["status"] == "draft"
    assert "id" in content

def test_read_configuration(
    client: TestClient, superuser_token_headers: Dict[str, str], db: Session
) -> None:
    configuration = create_random_configuration(db)
    response = client.get(
        f"{settings.API_V1_STR}/configurations/{configuration.id}",
        headers=superuser_token_headers,
    )
    assert response.status_code == 200
    content = response.json()
    assert content["name"] == configuration.name
    assert content["id"] == configuration.id

def test_read_configurations(
    client: TestClient, superuser_token_headers: Dict[str, str], db: Session
) -> None:
    configuration = create_random_configuration(db)
    response = client.get(
        f"{settings.API_V1_STR}/configurations/",
        headers=superuser_token_headers,
    )
    assert response.status_code == 200
    content = response.json()
    assert len(content) > 0
    assert any(config["id"] == configuration.id for config in content)

def test_update_configuration(
    client: TestClient, superuser_token_headers: Dict[str, str], db: Session
) -> None:
    configuration = create_random_configuration(db)
    data = {
        "name": random_lower_string(),
        "description": random_lower_string(),
        "energy_source": "wind"
    }
    response = client.put(
        f"{settings.API_V1_STR}/configurations/{configuration.id}",
        headers=superuser_token_headers,
        json=data,
    )
    assert response.status_code == 200
    content = response.json()
    assert content["name"] == data["name"]
    assert content["description"] == data["description"]
    assert content["energy_source"] == data["energy_source"]
    assert content["id"] == configuration.id

def test_delete_configuration(
    client: TestClient, superuser_token_headers: Dict[str, str], db: Session
) -> None:
    configuration = create_random_configuration(db)
    response = client.delete(
        f"{settings.API_V1_STR}/configurations/{configuration.id}",
        headers=superuser_token_headers,
    )
    assert response.status_code == 200
    content = response.json()
    assert content["id"] == configuration.id
    
    # Verify it's deleted
    config_in_db = crud.configuration.get(db=db, id=configuration.id)
    assert config_in_db is None

def test_read_nonexistent_configuration(
    client: TestClient, superuser_token_headers: Dict[str, str]
) -> None:
    response = client.get(
        f"{settings.API_V1_STR}/configurations/99999",
        headers=superuser_token_headers,
    )
    assert response.status_code == 404

def test_create_configuration_invalid_data(
    client: TestClient, superuser_token_headers: Dict[str, str]
) -> None:
    data = {
        "name": "test",
        # Missing required fields
    }
    response = client.post(
        f"{settings.API_V1_STR}/configurations/",
        headers=superuser_token_headers,
        json=data,
    )
    assert response.status_code == 422

def test_update_nonexistent_configuration(
    client: TestClient, superuser_token_headers: Dict[str, str]
) -> None:
    data = {"name": random_lower_string()}
    response = client.put(
        f"{settings.API_V1_STR}/configurations/99999",
        headers=superuser_token_headers,
        json=data,
    )
    assert response.status_code == 404 