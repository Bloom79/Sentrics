export type ConfigurationType = 'simulation' | 'active';
export type LegalType = 'cooperative' | 'association';
export type ConfigurationStatus = 'draft' | 'pending_gse' | 'active' | 'archived';
export type VoltageLevel = 'low' | 'medium' | 'high';
export type MeteringResolution = 'quarter_hourly' | 'half_hourly' | 'hourly';
export type BillingCycle = 'monthly' | 'quarterly' | 'yearly';
export type RevenueMethod = 'proportional' | 'equal' | 'custom';
export type ComplianceStatus = 'pending' | 'submitted' | 'approved' | 'rejected';

export interface Configuration {
  id: number;
  name: string;
  description?: string;
  type: ConfigurationType;
  legal_type: LegalType;
  status: ConfigurationStatus;
  primary_substation_id: string;
  boundary?: GeoJSON.Polygon;
  total_capacity: number;
  gse_compliance?: {
    submitted: number;
    approved: number;
    status: 'pending' | 'submitted' | 'approved' | 'rejected';
    last_sync?: string;
    documents?: {
      name: string;
      status: 'required' | 'submitted' | 'validated';
      uploaded_at?: string;
    }[];
  };
  energy_metrics: {
    total_production: number;
    total_consumption: number;
    self_consumption_rate: number;
    virtual_self_consumption_rate: number;
    grid_independence_rate: number;
    co2_savings: number;
    trees_equivalent: number;
    shared_energy: number;
  };
  billing_info: {
    total_savings: number;
    total_incentives: number;
    revenue_from_sales: number;
    community_incentives: number;
    billing_cycle: BillingCycle;
    last_billing_date?: string;
  };
  weather_integration: {
    enabled: boolean;
    location: {
      lat: number;
      lng: number;
    };
    forecast?: {
      date: string;
      temperature: number;
      conditions: string;
      production_impact: number;
    }[];
  };
  created_at: string;
  updated_at: string;
  region: string;
  member_count: {
    producers: number;
    consumers: number;
    prosumers: number;
    total: number;
  };
}

export interface NewConfiguration {
  name: string;
  description: string;
  type: string;
  legal_type: 'cooperative' | 'association';
  address: string;
  location: string;
  region: string;
}

export interface ConfigurationFilters {
  status?: ConfigurationStatus;
  type?: ConfigurationType;
  legal_type?: LegalType;
  region?: string;
  search?: string;
}

export interface ConfigurationResponse {
  items: CERConfiguration[];
  total: number;
  total_pages: number;
  page: number;
  size: number;
}

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

export interface UpdatedConfiguration extends Partial<CERConfiguration> {
  id: string;
}

export interface CommunityConfig {
  profile: CommunityProfile;
  legalForm: LegalEntityType;
  governance: GovernanceStructure;
}

export interface TechnicalConfig {
  boundary: {
    cabinaId: string;
    coordinates: GeoCoordinates[];
    validationStatus: boolean;
  };
  productionUnits: ProductionUnit[];
  consumptionUnits: ConsumptionUnit[];
  connections: {
    pods: PODConnection[];
    validations: ConnectionValidation[];
  };
}

export interface EconomicConfig {
  incentiveScheme: IncentiveConfiguration;
  revenueDistribution: DistributionRules;
  billingSetup: BillingConfiguration;
  savingsProjection?: {
    monthly: number;
    yearly: number;
    roi_months: number;
  };
  costs: {
    setup_fee?: number;
    monthly_fee: number;
    annual_fee?: number;
    metering_fee?: number;
  };
}

export interface ComplianceConfig {
  gseRequirements: GSECompliance;
  areraRequirements: ARERACompliance;
  documentationStatus: DocumentStatus;
}

export interface CommunityProfile {
  name: string;
  description?: string;
  location: string;
  contactInfo: ContactInformation;
}

export type LegalEntityType = 'association' | 'cooperative' | 'corporation';

export interface GovernanceStructure {
  type: string;
  roles: Role[];
  decisionMaking: DecisionMakingProcess;
}

export interface GeoCoordinates {
  latitude: number;
  longitude: number;
}

export interface ProductionUnit {
  id: string;
  type: string;
  capacity: number;
  location: GeoCoordinates;
  status: 'active' | 'inactive' | 'maintenance';
}

export interface ConsumptionUnit {
  id: string;
  type: string;
  maxConsumption: number;
  location: GeoCoordinates;
  status: 'active' | 'inactive';
  metrics: {
    daily_avg: number;
    peak_hours: string[];
    load_profile: number[];
    efficiency_score?: number;
  };
  smart_meter?: {
    id: string;
    model: string;
    last_reading: string;
    reading_interval: 'quarter_hourly' | 'half_hourly' | 'hourly';
  };
}

export interface PODConnection {
  id: string;
  type: 'production' | 'consumption';
  podId: string;
  status: 'active' | 'pending' | 'suspended';
}

export interface ConnectionValidation {
  podId: string;
  status: 'valid' | 'invalid';
  issues?: string[];
}

export interface IncentiveConfiguration {
  type: string;
  rates: IncentiveRate[];
  conditions: IncentiveCondition[];
  distribution_method: 'proportional' | 'equal' | 'custom';
  custom_rules?: {
    member_type: string;
    percentage: number;
    conditions?: string[];
  }[];
  payment_schedule: 'monthly' | 'quarterly' | 'yearly';
}

export interface DistributionRules {
  method: string;
  parameters: { [key: string]: any };
}

export interface BillingConfiguration {
  cycle: string;
  method: string;
  parameters: { [key: string]: any };
}

export interface GSECompliance {
  requirements: Requirement[];
  certifications: Certification[];
  status: 'compliant' | 'non-compliant' | 'pending';
}

export interface ARERACompliance {
  requirements: Requirement[];
  validations: Validation[];
  status: 'compliant' | 'non-compliant' | 'pending';
}

export interface DocumentStatus {
  required: Document[];
  submitted: Document[];
  validated: Document[];
}

export interface ContactInformation {
  email: string;
  phone?: string;
  address: string;
}

export interface Role {
  name: string;
  permissions: string[];
}

export interface DecisionMakingProcess {
  type: string;
  rules: { [key: string]: any };
}

export interface IncentiveRate {
  type: string;
  value: number;
  unit: string;
}

export interface IncentiveCondition {
  type: string;
  parameters: { [key: string]: any };
}

export interface Requirement {
  id: string;
  description: string;
  status: 'met' | 'unmet' | 'pending';
}

export interface Certification {
  id: string;
  type: string;
  issueDate: Date;
  expiryDate: Date;
  status: 'active' | 'expired' | 'revoked';
}

export interface Validation {
  id: string;
  type: string;
  result: ValidationResult;
  timestamp: Date;
}

export interface Document {
  id: string;
  type: string;
  status: 'required' | 'submitted' | 'validated';
  url?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors?: string[];
  warnings?: string[];
} 