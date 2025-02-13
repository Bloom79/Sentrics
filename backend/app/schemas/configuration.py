from datetime import datetime
from typing import Optional, Dict, Any, List
from pydantic import BaseModel, Field

class Location(BaseModel):
    lat: float = Field(..., description="Latitude")
    lng: float = Field(..., description="Longitude")

class TechnicalInfo(BaseModel):
    total_capacity: float = Field(..., description="Total capacity in kW")
    voltage_level: str = Field(..., description="Voltage level (low, medium, high)")
    metering_interval: str = Field(..., description="Metering interval (quarter_hourly, half_hourly, hourly)")
    weather_integration: bool = Field(default=False, description="Enable weather data integration")
    smart_meter_required: bool = Field(default=False, description="Require smart meters for participants")
    grid_connection_type: str = Field(..., description="Grid connection type (single_point, multiple_points)")
    load_profiles: Optional[List[Dict[str, Any]]] = Field(default_factory=list)

class GSECompliance(BaseModel):
    regulation: str = Field(..., description="Applicable regulation")
    documentation_complete: bool = Field(default=False)
    incentive_type: str = Field(..., description="Incentive type (standard, premium, custom)")
    alignment_status: str = Field(..., description="Alignment status (pending, in_progress, completed)")

class SimulationSettings(BaseModel):
    duration_days: int = Field(..., description="Simulation duration in days")
    include_weather: bool = Field(default=True)
    include_historical_data: bool = Field(default=True)
    participant_scenarios: List[Dict[str, Any]] = Field(default_factory=list)

class BillingSettings(BaseModel):
    billing_cycle: str = Field(..., description="Billing cycle (monthly, quarterly, yearly)")
    revenue_distribution: str = Field(..., description="Revenue distribution method")
    incentive_scheme: str = Field(..., description="Incentive scheme type")
    setup_fee: Optional[float] = None
    monthly_fee: float = Field(default=0)
    annual_fee: Optional[float] = None
    metering_fee: Optional[float] = None

class MemberLimits(BaseModel):
    max_producers: int = Field(default=0)
    max_consumers: int = Field(default=0)
    max_prosumers: int = Field(default=0)
    geographical_limit_km: float = Field(default=0)

class ConfigurationBase(BaseModel):
    name: str
    description: Optional[str] = None
    type: str  # simulation, active
    legal_type: str  # CER, GAC, etc.
    status: str  # draft, active, inactive
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

class ConfigurationCreate(ConfigurationBase):
    pass

class ConfigurationUpdate(ConfigurationBase):
    pass

class ConfigurationInDB(ConfigurationBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

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

class ConfigurationWithStats(ConfigurationInDB):
    participant_count: int = 0
    total_energy_produced: float = 0
    total_energy_consumed: float = 0
    total_energy_shared: float = 0
    co2_saved: float = 0
    trees_equivalent: int = 0
    
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

# Type alias for the main Configuration type
Configuration = ConfigurationInDB 