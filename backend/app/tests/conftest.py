from typing import Dict, Generator

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

from app.core.config import settings
from app.db.base import Base
from app.main import app
from app.api import deps

# Use a separate test database
SQLALCHEMY_DATABASE_URL = "postgresql://postgres:postgres@localhost:5433/sentrics_test"
engine = create_engine(SQLALCHEMY_DATABASE_URL)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="session")
def db() -> Generator:
    # Create test database if it doesn't exist
    default_engine = create_engine("postgresql://postgres:postgres@localhost:5433/postgres")
    with default_engine.connect() as conn:
        conn.execute(text("COMMIT"))  # Close any open transactions
        conn.execute(text("DROP DATABASE IF EXISTS sentrics_test"))
        conn.execute(text("CREATE DATABASE sentrics_test"))
    
    # Create all tables in test database
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

@pytest.fixture(scope="module")
def client() -> Generator:
    def override_get_db():
        try:
            db = TestingSessionLocal()
            yield db
        finally:
            db.close()
    
    app.dependency_overrides[deps.get_db] = override_get_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()

@pytest.fixture
def superuser_token_headers() -> Dict[str, str]:
    return {"Authorization": f"Bearer test-superuser-token"} 