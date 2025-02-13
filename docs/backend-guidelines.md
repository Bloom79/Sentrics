# Backend Guidelines

## Project Structure

```
backend/
├── alembic/                # Database migrations
│   └── versions/          # Migration files
├── app/
│   ├── api/              # API endpoints
│   │   └── v1/
│   │       ├── endpoints/
│   │       │   ├── auth.py           # Authentication endpoints
│   │       │   ├── users.py          # User management
│   │       │   ├── configurations.py  # Energy configurations
│   │       │   ├── members.py        # Community members
│   │       │   └── transactions.py    # Energy transactions
│   │       └── api.py    # API router configuration
│   ├── core/             # Core functionality
│   │   ├── config.py     # Application configuration
│   │   └── security.py   # Security utilities
│   ├── crud/             # Database operations
│   │   ├── base.py       # Base CRUD operations
│   │   ├── user.py       # User operations
│   │   └── member.py     # Member operations
│   ├── db/               # Database configuration
│   │   └── base.py       # Database setup
│   ├── models/           # SQLAlchemy models
│   │   ├── user.py       # User model
│   │   └── member.py     # Member model
│   └── schemas/          # Pydantic schemas
│       ├── user.py       # User schemas
│       └── member.py     # Member schemas
├── tests/                # Test files
└── requirements.txt      # Python dependencies
```

## API Structure

### Authentication and User Management

#### Authentication Endpoints
```python
# app/api/v1/endpoints/auth.py

@router.post("/login/access-token")
async def login_access_token(
    form_data: OAuth2PasswordRequestForm = Depends()
) -> Token:
    """
    OAuth2 compatible token login, get an access token for future requests.
    """

@router.post("/login/test-token")
def test_token(current_user: User = Depends(deps.get_current_user)) -> Any:
    """
    Test access token.
    """
```

#### User Management
```python
# app/api/v1/endpoints/users.py

@router.get("/", response_model=schemas.UserResponse)
async def list_users(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    type_filter: Optional[str] = Query(None),
    user_type: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
):
    """
    Retrieve users with optional filtering.
    """

@router.post("/", response_model=schemas.UserInDB)
def create_user(
    db: Session = Depends(deps.get_db),
    user_in: schemas.UserCreate,
) -> Any:
    """
    Create new user.
    """
```

### Energy Communities

#### Community Configuration
```python
# app/api/v1/endpoints/configurations.py

@router.get("/", response_model=List[schemas.Configuration])
def list_configurations(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
):
    """
    List energy community configurations.
    """

@router.post("/", response_model=schemas.Configuration)
def create_configuration(
    db: Session = Depends(deps.get_db),
    configuration_in: schemas.ConfigurationCreate,
    current_user: User = Depends(deps.get_current_user),
):
    """
    Create new energy community configuration.
    """
```

#### Community Members
```python
# app/api/v1/endpoints/members.py

@router.get("/", response_model=List[schemas.Member])
def list_members(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
):
    """
    List community members.
    """

@router.post("/", response_model=schemas.Member)
def create_member(
    db: Session = Depends(deps.get_db),
    member_in: schemas.MemberCreate,
    current_user: User = Depends(deps.get_current_user),
):
    """
    Add new community member.
    """
```

## Database Models

### User Model
```python
# app/models/user.py

class UserRole(str, enum.Enum):
    ADMIN = "admin"
    VENDOR = "vendor"
    REFERENT = "referent"
    USER = "user"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=False)
    role = Column(Enum(UserRole), nullable=False, default=UserRole.USER)
    
    # Relationships
    member_profiles = relationship("Member", back_populates="user")
    community_user = relationship("CommunityUser", back_populates="app_user")
```

### Community User Model
```python
# app/models/user.py

class CommunityUser(Base):
    __tablename__ = "community_users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    full_name = Column(String)
    role = Column(String)
    status = Column(String)
    organization_id = Column(Integer, nullable=True)
    
    # Relationships
    app_user = relationship("User", back_populates="community_user")
```

## API Response Schemas

### User Schemas
```python
# app/schemas/user.py

class UserBase(BaseModel):
    email: EmailStr
    username: str
    full_name: str
    fiscal_code: str
    type: str
    user_type: str
    address: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserInDB(UserBase):
    id: int
    is_active: bool
    created_at: datetime
```

### Response Models
```python
# app/schemas/user.py

class UserResponse(BaseModel):
    items: List[UserList]
    total: int
    page: int
    size: int

class CommunityUserCheck(BaseModel):
    exists: bool
    id: Optional[int] = None
```

## Authentication Flow

1. **Login Process**
   ```python
   # 1. Validate credentials
   user = authenticate_user(db, email=form_data.username, password=form_data.password)
   
   # 2. Create access token
   access_token = create_access_token(data={"sub": user.email})
   
   # 3. Return token response
   return {
       "access_token": access_token,
       "token_type": "bearer"
   }
   ```

2. **Token Validation**
   ```python
   # 1. Extract token from request
   token = await oauth2_scheme(request)
   
   # 2. Decode and validate token
   payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[ALGORITHM])
   
   # 3. Get user from database
   user = get_user(db, email=payload["sub"])
   ```

## Permission Management

### Role-Based Access Control
```python
def check_permissions(
    current_user: User,
    required_permissions: List[str]
) -> bool:
    """Check if user has required permissions."""
    if current_user.is_superuser:
        return True
    return all(
        permission in current_user.permissions
        for permission in required_permissions
    )
```

### Permission Dependencies
```python
def get_current_active_superuser(
    current_user: User = Depends(get_current_user),
) -> User:
    """Check if current user is superuser."""
    if not current_user.is_superuser:
        raise HTTPException(
            status_code=400,
            detail="The user doesn't have enough privileges"
        )
    return current_user
```

## Error Handling

### HTTP Exceptions
```python
@router.get("/{user_id}")
def get_user(user_id: int, db: Session = Depends(deps.get_db)) -> Any:
    """Get user by ID with proper error handling."""
    user = crud.user.get(db=db, id=user_id)
    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )
    return user
```

### Database Error Handling
```python
try:
    db.commit()
except SQLAlchemyError as e:
    db.rollback()
    raise HTTPException(
        status_code=500,
        detail=f"Database error: {str(e)}"
    )
```

## API Versioning

### Version 1 (Current)
- Base path: `/api/v1`
- Main routes:
  - `/auth` - Authentication endpoints
  - `/users` - User management
  - `/configurations` - Energy configurations
  - `/members` - Community members
  - `/transactions` - Energy transactions

### Future Versions
- Create new version directory: `/api/v2`
- Maintain backward compatibility
- Document breaking changes
- Provide migration guides

## Security Measures

1. **Authentication**
   - JWT-based authentication
   - Token expiration
   - Refresh token mechanism

2. **Authorization**
   - Role-based access control
   - Permission checking
   - Tenant isolation

3. **Data Protection**
   - Input validation
   - SQL injection prevention
   - XSS protection

## Performance Optimization

1. **Database**
   - Proper indexing
   - Query optimization
   - Connection pooling

2. **Caching**
   - Response caching
   - Database query caching
   - Static data caching

3. **Async Operations**
   - Async database queries
   - Background tasks
   - Batch processing

## Testing Guidelines

1. **Unit Tests**
   - Test individual components
   - Mock external dependencies
   - Test error cases

2. **Integration Tests**
   - Test API endpoints
   - Test database operations
   - Test authentication flow

3. **Performance Tests**
   - Load testing
   - Stress testing
   - Endpoint benchmarking

## Database Migration Management

### Alembic Setup and Configuration

1. **Directory Structure**
```
backend/
├── alembic/
│   ├── versions/          # Migration files
│   ├── env.py            # Environment configuration
│   └── script.py.mako    # Migration template
└── alembic.ini           # Alembic configuration
```

2. **Configuration Settings**
```ini
# alembic.ini
[alembic]
script_location = alembic
sqlalchemy.url = postgresql://postgres:postgres@localhost:5433/sentrics
```

### Creating Migrations

1. **Auto-generate migrations**
```bash
# Windows (PowerShell)
cd backend
venv\Scripts\activate
alembic revision --autogenerate -m "description_of_changes"
```

2. **Manual migration creation**
```bash
alembic revision -m "create_users_table"
```

Example migration file:
```python
"""create users table

Revision ID: a1b2c3d4e5f6
Revises: 
Create Date: 2024-02-08 10:00:00.000000

"""
from alembic import op
import sqlalchemy as sa

def upgrade():
    op.create_table(
        'users',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('email', sa.String(), nullable=False),
        sa.Column('username', sa.String(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )

def downgrade():
    op.drop_table('users')
```

### Managing Migrations

1. **Apply migrations**
```bash
# Apply all pending migrations
alembic upgrade head

# Apply specific number of migrations
alembic upgrade +2

# Upgrade to specific revision
alembic upgrade a1b2c3d4e5f6
```

2. **Rollback migrations**
```bash
# Rollback last migration
alembic downgrade -1

# Rollback to specific revision
alembic downgrade a1b2c3d4e5f6

# Rollback all migrations
alembic downgrade base
```

3. **View migration information**
```bash
# Show current revision
alembic current

# Show migration history
alembic history --verbose

# Show pending migrations
alembic history --rev-range head::current
```

### Best Practices

1. **Migration Naming**
   - Use descriptive names: `create_users_table`, `add_user_email_column`
   - Include purpose in name: `add_foreign_key_users_profiles`
   - Use timestamps for ordering: `2024_02_08_create_users`

2. **Testing Migrations**
   ```bash
   # Test upgrade
   alembic upgrade head
   
   # Test downgrade
   alembic downgrade -1
   
   # Verify database state
   alembic check
   ```

3. **Handling Conflicts**
   - Always pull latest changes before creating migrations
   - Resolve merge conflicts in migration files carefully
   - Test migrations after resolving conflicts

4. **Data Migration**
   ```python
   def upgrade():
       # Schema changes
       op.add_column('users', sa.Column('full_name', sa.String()))
       
       # Data migration
       connection = op.get_bind()
       connection.execute(
           text("UPDATE users SET full_name = firstname || ' ' || lastname")
       )
       
       # Remove old columns
       op.drop_column('users', 'firstname')
       op.drop_column('users', 'lastname')
   ```

### Troubleshooting

1. **Common Issues**
   - Migration conflicts
   - Failed migrations
   - Inconsistent database state

2. **Recovery Steps**
   ```bash
   # Mark migration as complete without running
   alembic stamp head
   
   # Force specific revision
   alembic stamp a1b2c3d4e5f6
   
   # Check database state
   alembic check
   ```

3. **Debugging**
   ```bash
   # Enable SQL logging
   alembic upgrade head --sql
   
   # Show detailed info
   alembic upgrade head -vvv
   ``` 