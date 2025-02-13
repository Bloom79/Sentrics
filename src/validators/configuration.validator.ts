import { NewConfiguration, UpdatedConfiguration, ConfigurationType } from '../types/cer/configuration';

interface ValidationResult {
  isValid: boolean;
  errors?: string[];
}

const VALID_CONFIGURATION_TYPES: ConfigurationType[] = ['basic', 'advanced', 'enterprise'];
const VALID_STATUSES = ['draft', 'active', 'suspended'];

export function validateConfiguration(
  config: NewConfiguration | UpdatedConfiguration,
  isUpdate = false
): ValidationResult {
  const errors: string[] = [];

  // Skip validation for fields not present in update
  if (!isUpdate || config.name !== undefined) {
    if (!config.name || typeof config.name !== 'string') {
      errors.push('Name is required and must be a string');
    } else if (config.name.length < 3 || config.name.length > 255) {
      errors.push('Name must be between 3 and 255 characters');
    }
  }

  if (!isUpdate || config.type !== undefined) {
    if (!VALID_CONFIGURATION_TYPES.includes(config.type as ConfigurationType)) {
      errors.push(`Type must be one of: ${VALID_CONFIGURATION_TYPES.join(', ')}`);
    }
  }

  if (!isUpdate || config.version !== undefined) {
    if (!config.version || typeof config.version !== 'string') {
      errors.push('Version is required and must be a string');
    } else if (!isValidVersionFormat(config.version)) {
      errors.push('Version must be in format x.y.z');
    }
  }

  if (!isUpdate || config.status !== undefined) {
    if (!VALID_STATUSES.includes(config.status as string)) {
      errors.push(`Status must be one of: ${VALID_STATUSES.join(', ')}`);
    }
  }

  // Validate features if present
  if (config.features) {
    const featureErrors = validateFeatures(config.features);
    errors.push(...featureErrors);
  }

  // Validate restrictions if present
  if (config.restrictions) {
    const restrictionErrors = validateRestrictions(config.restrictions);
    errors.push(...restrictionErrors);
  }

  // Validate community config if present
  if (config.community) {
    const communityErrors = validateCommunityConfig(config.community);
    errors.push(...communityErrors);
  }

  // Validate technical config if present
  if (config.technical) {
    const technicalErrors = validateTechnicalConfig(config.technical);
    errors.push(...technicalErrors);
  }

  return {
    isValid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
  };
}

function isValidVersionFormat(version: string): boolean {
  return /^\d+\.\d+\.\d+$/.test(version);
}

function validateFeatures(features: any): string[] {
  const errors: string[] = [];

  if (typeof features !== 'object') {
    errors.push('Features must be an object');
    return errors;
  }

  if (features.maxMembers !== undefined) {
    if (typeof features.maxMembers !== 'number' || features.maxMembers <= 0) {
      errors.push('maxMembers must be a positive number');
    }
  }

  if (features.maxProductionUnits !== undefined) {
    if (typeof features.maxProductionUnits !== 'number' || features.maxProductionUnits <= 0) {
      errors.push('maxProductionUnits must be a positive number');
    }
  }

  if (features.reportingFrequency !== undefined) {
    if (!Array.isArray(features.reportingFrequency)) {
      errors.push('reportingFrequency must be an array');
    } else {
      const validFrequencies = ['daily', 'weekly', 'monthly', 'quarterly', 'yearly'];
      features.reportingFrequency.forEach((freq: string) => {
        if (!validFrequencies.includes(freq)) {
          errors.push(`Invalid reporting frequency: ${freq}`);
        }
      });
    }
  }

  return errors;
}

function validateRestrictions(restrictions: any): string[] {
  const errors: string[] = [];

  if (typeof restrictions !== 'object') {
    errors.push('Restrictions must be an object');
    return errors;
  }

  if (restrictions.maxCapacity !== undefined) {
    if (typeof restrictions.maxCapacity !== 'number' || restrictions.maxCapacity <= 0) {
      errors.push('maxCapacity must be a positive number');
    }
  }

  if (restrictions.allowedLegalForms !== undefined) {
    if (!Array.isArray(restrictions.allowedLegalForms)) {
      errors.push('allowedLegalForms must be an array');
    } else {
      const validForms = ['association', 'cooperative', 'corporation'];
      restrictions.allowedLegalForms.forEach((form: string) => {
        if (!validForms.includes(form)) {
          errors.push(`Invalid legal form: ${form}`);
        }
      });
    }
  }

  return errors;
}

function validateCommunityConfig(community: any): string[] {
  const errors: string[] = [];

  if (typeof community !== 'object') {
    errors.push('Community configuration must be an object');
    return errors;
  }

  if (!community.profile || typeof community.profile !== 'object') {
    errors.push('Community profile is required and must be an object');
  } else {
    if (!community.profile.name) {
      errors.push('Community profile name is required');
    }
    if (!community.profile.location) {
      errors.push('Community profile location is required');
    }
    if (!community.profile.contactInfo || typeof community.profile.contactInfo !== 'object') {
      errors.push('Community profile contact info is required and must be an object');
    } else {
      if (!community.profile.contactInfo.email) {
        errors.push('Community profile contact email is required');
      }
      if (!community.profile.contactInfo.address) {
        errors.push('Community profile contact address is required');
      }
    }
  }

  return errors;
}

function validateTechnicalConfig(technical: any): string[] {
  const errors: string[] = [];

  if (typeof technical !== 'object') {
    errors.push('Technical configuration must be an object');
    return errors;
  }

  if (!technical.boundary || typeof technical.boundary !== 'object') {
    errors.push('Technical boundary configuration is required and must be an object');
  } else {
    if (!technical.boundary.cabinaId) {
      errors.push('Technical boundary cabina ID is required');
    }
  }

  if (technical.productionUnits !== undefined && !Array.isArray(technical.productionUnits)) {
    errors.push('Production units must be an array');
  }

  if (technical.consumptionUnits !== undefined && !Array.isArray(technical.consumptionUnits)) {
    errors.push('Consumption units must be an array');
  }

  return errors;
} 