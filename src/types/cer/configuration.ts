// Configuration Types
export interface CERConfiguration {
  id: string;
  name: string;
  type: ConfigurationType;
  version: string;
  status: ConfigurationStatus;
  
  features: {
    maxMembers?: number;
    maxProductionUnits?: number;
    reportingFrequency?: string[];
    analytics?: string;
  };
  
  restrictions: {
    allowedLegalForms?: string[];
    maxCapacity?: number;
    documentStorage?: string;
  };
  
  community: CommunityConfig;
  technical: TechnicalConfig;
  economic: EconomicConfig;
  compliance: ComplianceConfig;
}

export type ConfigurationType = 'basic' | 'advanced' | 'enterprise';
export type ConfigurationStatus = 'draft' | 'active' | 'suspended';

export interface NewConfiguration extends Omit<CERConfiguration, 'id'> {}
export interface UpdatedConfiguration extends Partial<CERConfiguration> {
  id: string;
}

// Configuration Components
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
}

export interface ComplianceConfig {
  gseRequirements: GSECompliance;
  areraRequirements: ARERACompliance;
  documentationStatus: DocumentStatus;
}

// Plant Mapping
export interface PlantMapping {
  plantId: string;
  configurationId: string;
  status: 'active' | 'pending' | 'suspended';
  validations: ValidationResult[];
  createdAt: Date;
  updatedAt: Date;
}

// Supporting Types
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

export interface ValidationResult {
  isValid: boolean;
  errors?: string[];
  warnings?: string[];
}

// Additional Supporting Types
interface ContactInformation {
  email: string;
  phone?: string;
  address: string;
}

interface Role {
  name: string;
  permissions: string[];
}

interface DecisionMakingProcess {
  type: string;
  rules: { [key: string]: any };
}

interface IncentiveRate {
  type: string;
  value: number;
  unit: string;
}

interface IncentiveCondition {
  type: string;
  parameters: { [key: string]: any };
}

interface Requirement {
  id: string;
  description: string;
  status: 'met' | 'unmet' | 'pending';
}

interface Certification {
  id: string;
  type: string;
  issueDate: Date;
  expiryDate: Date;
  status: 'active' | 'expired' | 'revoked';
}

interface Validation {
  id: string;
  type: string;
  result: ValidationResult;
  timestamp: Date;
}

interface Document {
  id: string;
  type: string;
  status: 'required' | 'submitted' | 'validated';
  url?: string;
} 