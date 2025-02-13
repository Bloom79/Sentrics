# Configurations API Structure Documentation

## Overview
This document details the complete structure of the Configurations API, including both frontend and backend implementations, routing chains, and data flow.

## Backend Structure

### Entry Points
1. **Main Application** (`backend/app/main.py`)
```python
from fastapi import FastAPI
from app.api.v1.api import api_router
from app.core.config import settings

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Router inclusion
app.include_router(api_router, prefix=settings.API_V1_STR)
```

2. **API Router** (`backend/app/api/v1/api.py`)
```python
from fastapi import APIRouter
from app.api.v1.endpoints import configurations

api_router = APIRouter()
api_router.include_router(configurations.router, prefix="/configurations", tags=["configurations"])
```

### Data Models

1. **Database Model** (`backend/app/models/configuration.py`)
```python
class Configuration(Base):
    __tablename__ = "cer_configuration"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String)
    type = Column(String, nullable=False)  # simulation, active
    legal_type = Column(String, nullable=False)  # cooperative, association
    status = Column(String, default="draft")  # draft, active, inactive
    address = Column(String, nullable=False)
    location = Column(JSON, nullable=False)
    region = Column(String, nullable=False)
    primary_substation_id = Column(String, nullable=False)
    
    # Configuration settings
    technical_info = Column(JSON, nullable=False, server_default='{}')
    gse_compliance = Column(JSON, nullable=False, server_default='{}')
    simulation_settings = Column(JSON, nullable=True)
    billing_settings = Column(JSON, nullable=True)
    member_limits = Column(JSON, nullable=False, server_default='{}')
    
    # Metadata
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    members = relationship("Member", back_populates="configuration", cascade="all, delete-orphan", lazy="selectin")
```

2. **Pydantic Schemas** (`backend/app/schemas/configuration.py`)
```python
class ConfigurationBase(BaseModel):
    name: str
    description: Optional[str] = None
    type: str
    legal_type: str
    status: str
    address: str
    location: Dict[str, Any]
    region: str
    primary_substation_id: str
    technical_info: Dict[str, Any] = Field(default_factory=dict)
    gse_compliance: Dict[str, Any] = Field(default_factory=dict)
    simulation_settings: Optional[Dict[str, Any]] = None
    billing_settings: Optional[Dict[str, Any]] = None
    member_limits: Dict[str, Any] = Field(default_factory=dict)
    is_active: bool = True

class ConfigurationList(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    type: str
    legal_type: str
    status: str
    address: str
    location: Dict[str, Any]
    region: str
    participant_count: int = 0
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class ConfigurationResponse(BaseModel):
    items: List[ConfigurationList]
    total: int
    total_pages: int
    page: int
    size: int

    class Config:
        from_attributes = True
```

### CRUD Operations

1. **Base CRUD** (`backend/app/crud/base.py`)
```python
class CRUDBase[T, CreateSchema, UpdateSchema]:
    def __init__(self, model: Type[T]):
        self.model = model

    def get(self, db: Session, id: Any) -> Optional[T]:
        return db.query(self.model).filter(self.model.id == id).first()
    # ... other base methods
```

2. **Configuration CRUD** (`backend/app/crud/configuration.py`)
```python
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
    # ... other specific methods
```

### API Endpoints

**Configurations Endpoints** (`backend/app/api/v1/endpoints/configurations.py`)
```python
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

    return {
        "items": configurations,
        "total": total,
        "total_pages": (total + limit - 1) // limit,
        "page": skip // limit,
        "size": limit
    }
```

## Frontend Structure

### Types
```typescript
// frontend/src/types/cer/configuration.ts
export interface CERConfiguration {
  id: number;
  name: string;
  description: string;
  type: string;
  legal_type: 'cooperative' | 'association';
  status: 'draft' | 'pending_gse' | 'active' | 'archived';
  address: string;
  location: {
    lat?: number;
    lng?: number;
    address?: string;
    [key: string]: any;
  };
  region: string;
  participant_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ConfigurationResponse {
  items: CERConfiguration[];
  total: number;
  total_pages: number;
  page: number;
  size: number;
}
```

### List Component
```typescript
// frontend/src/pages/cer/configurations/list.tsx
export default function ConfigurationList() {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(100);
  const columns = useColumns();

  const { data, isLoading, error } = useQuery({
    queryKey: ['configurations', pageIndex, pageSize],
    queryFn: async () => {
      const response = await api.get('/api/v1/configurations', {
        params: {
          skip: pageIndex * pageSize,
          limit: pageSize,
        },
      });
      return response.data;
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Energy Configurations</h1>
        <Button asChild>
          <Link to="/cer/configurations/new">
            New Configuration
          </Link>
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={data?.items || []}
        pageCount={data?.total_pages || 0}
        pageIndex={pageIndex}
        pageSize={pageSize}
        onPageIndexChange={setPageIndex}
        onPageSizeChange={setPageSize}
        isLoading={isLoading}
      />
    </div>
  );
}
```

## API Flow

### List Configurations Flow
1. Frontend makes request to `/api/v1/configurations` with pagination parameters
2. Backend endpoint `list_configurations` processes request:
   - Builds query with member count join
   - Applies any filters (type, status, search)
   - Calculates pagination info
   - Returns paginated response with items and metadata
3. Frontend receives response and displays in DataTable component
4. Pagination controls trigger new requests with updated parameters

## Error Handling

### Backend
- Returns 404 for not found resources
- Returns 400 for invalid parameters
- Returns 500 for server errors

### Frontend
```typescript
if (error) {
  console.error('Error fetching configurations:', error);
  return (
    <Alert variant="destructive">
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        Failed to load configurations. Please try again later.
        {error instanceof Error ? ` Error: ${error.message}` : ''}
      </AlertDescription>
    </Alert>
  );
}
```

## Testing

### Backend Tests
```python
def test_read_configurations(client: TestClient, superuser_token_headers: Dict[str, str], db: Session) -> None:
    configuration = create_random_configuration(db)
    response = client.get(
        f"{settings.API_V1_STR}/configurations/",
        headers=superuser_token_headers,
    )
    assert response.status_code == 200
    content = response.json()
    assert len(content["items"]) > 0
    assert content["total"] > 0
    assert content["total_pages"] > 0
```

## Usage Examples

### Retrieving Configurations
```typescript
// Frontend with React Query
const { data, isLoading } = useQuery({
  queryKey: ['configurations', pageIndex, pageSize],
  queryFn: async () => {
    const response = await api.get('/api/v1/configurations', {
      params: { skip: pageIndex * pageSize, limit: pageSize },
    });
    return response.data;
  },
});
```

## Database Structure

### Tables
1. **cer_configuration**
   - Primary key: id
   - Essential fields: name, type, legal_type, status
   - JSON fields: technical_info, gse_compliance, simulation_settings
   - Timestamps: created_at, updated_at

2. **member**
   - Foreign key: configuration_id
   - Relationship: Many-to-One with configuration

## Security and Middleware

1. **CORS Configuration**
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

2. **Database Session Management**
```python
def get_db() -> Generator:
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()
```

## Deployment Considerations

1. **Environment Variables**
   - API_URL
   - DATABASE_URL
   - CORS settings

2. **Database Migrations**
   - Alembic for schema changes
   - Version control for migrations

3. **Performance Optimization**
   - Query optimization
   - Caching strategies
   - Pagination implementation

## Maintenance and Monitoring

1. **Logging**
   - Request logging
   - Error tracking
   - Performance metrics

2. **Documentation**
   - API documentation
   - Schema updates
   - Change log maintenance

3. **Updates**
   - Regular dependency updates
   - Security patches
   - Feature enhancements 