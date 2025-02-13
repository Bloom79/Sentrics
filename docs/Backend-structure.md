# Backend Structure

## Overview
The backend is built with FastAPI and provides APIs for simulation, data processing, IoT integration, and energy community management.

## Core Components

### 1. API Endpoints

#### Simulation Endpoints
```python
@app.post("/api/simulation")
@app.get("/api/simulation/progress")
```
- File upload and processing
- Real-time progress tracking via SSE
- Data validation and transformation

#### IoT Integration Endpoints
```python
@app.get("/api/iot/devices")
@app.post("/api/iot/data")
@app.get("/api/iot/stream")
```
- Device management
- Data ingestion
- Real-time streaming

#### Plant Management
```python
@app.get("/api/plants")
@app.post("/api/plants")
@app.get("/api/plants/{plant_id}")
```
- Plant CRUD operations
- Asset management
- Performance metrics
- Geospatial data handling

#### Energy Community Management
```python
@app.get("/api/communities")
@app.post("/api/communities")
@app.get("/api/communities/{community_id}/members")
@app.post("/api/communities/{community_id}/transactions")
```
- Community CRUD operations
- Member management
- Energy sharing transactions
- Geographic boundary management

#### User Management
```python
@app.get("/api/v1/users")
@app.post("/api/v1/users")
@app.get("/api/v1/users/{user_id}")
@app.put("/api/v1/users/{user_id}")
```
- User CRUD operations with role-based access
- Support for real and simulated users
- Member type management (consumer, producer, prosumer)
- User type tracking (real, simulated)
- Integration with energy communities
- POD and smart meter management

### 2. Data Processing

#### Time Series Processing
- Data downsampling
- Aggregation functions
- Performance optimization
- Geospatial calculations

#### Simulation Engine
- Consumption simulation
- Battery storage simulation
- Grid interaction modeling
- Optimization algorithms using PuLP

### 3. Task Queue System

#### Celery Workers
- Async task processing
- Long-running calculations
- Scheduled jobs
- Task monitoring via Flower

#### Background Tasks
- Data aggregation
- Report generation
- Email notifications
- Cache updates

### 4. IoT Integration

#### Protocol Support
- MQTT via Eclipse Mosquitto
- OPC UA Server integration
- Modbus TCP communication
- IEC 61850 protocol
- DNP3 device communication

#### Data Collection
- Real-time sensor data
- Device telemetry
- Performance metrics
- Status monitoring

### 5. Security

#### Authentication
- JWT token handling
- Supabase integration
- Role-based access control
- API key management

#### Data Protection
- TLS encryption
- Input validation
- Rate limiting
- GDPR compliance

## Dependencies

### Core Requirements
```
fastapi==0.109.0
uvicorn==0.27.0
pandas==2.1.4
numpy==1.26.3
python-multipart==0.0.6
```

### Database
```
sqlalchemy==2.0.25
psycopg2-binary==2.9.9
alembic==1.13.1
geoalchemy2==0.14.3
shapely==2.0.2
```

### Authentication
```
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
```

### Task Queue
```
celery>=5.3.6
redis>=5.0.1
flower>=2.0.1
```

### Geographic Tools
```
pyproj==3.6.1
scipy==1.12.0
```

### Optimization
```
pulp==2.7.0
```

## Development Setup

### 1. Environment Setup
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
.\venv\Scripts\activate   # Windows
pip install -r requirements.txt
```

### 2. Configuration
```python
# .env
DATABASE_URL=postgresql://user:pass@localhost:5432/db
JWT_SECRET_KEY=your-secret-key
IOT_HUB_CONNECTION_STRING=your-connection-string
```

### 3. Running the Server
```bash
# Development
uvicorn main:app --reload

# Production
uvicorn main:app --host 0.0.0.0 --port 8000
```

## Project Structure
```
backend/
├── main.py              # FastAPI application
├── requirements.txt     # Dependencies
├── simulation.py        # Simulation logic
├── iot/
│   ├── protocols/       # Protocol implementations
│   ├── devices/         # Device management
│   └── data/           # Data processing
├── models/             # Database models
├── schemas/            # Pydantic schemas
├── routers/            # API routes
└── utils/             # Utility functions
```

## Testing

### Unit Tests
```bash
pytest tests/unit/
```

### Integration Tests
```bash
pytest tests/integration/
```

### Load Testing
```bash
locust -f tests/load/locustfile.py
```

## Deployment

### Docker Setup
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Environment Variables
- `DATABASE_URL`: Database connection string
- `JWT_SECRET_KEY`: JWT signing key
- `IOT_HUB_CONNECTION_STRING`: Azure IoT Hub connection
- `ALLOWED_ORIGINS`: CORS allowed origins

## Monitoring

### Health Checks
```python
@app.get("/health")
async def health_check():
    return {"status": "healthy"}
```

### Metrics
- Request latency
- Error rates
- Resource utilization
- IoT device status

## Error Handling

### Global Exception Handler
```python
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={"message": str(exc)}
    )
```

### Custom Exceptions
```python
class SimulationError(Exception):
    pass

class IoTDeviceError(Exception):
    pass
```

## Performance Optimization

### Caching Strategy
- Redis for session data
- In-memory caching for frequent queries
- Query result caching

### Database Optimization
- Connection pooling
- Query optimization
- Index management

### Async Operations
- Async database queries
- Background tasks
- Streaming responses

### 2. Data Models

#### User Model
```python
class User(Base):
    # Core fields
    id: int
    email: str
    username: str
    full_name: str
    fiscal_code: str
    
    # Type and role
    type: MemberType  # consumer, producer, prosumer
    user_type: UserType  # real, simulated
    role: UserRole  # admin, vendor, referent, user
    
    # Status
    is_active: bool
    is_verified: bool
    
    # Additional info
    address: str
    preferences: dict
    
    # Metadata
    created_at: datetime
    updated_at: datetime
```