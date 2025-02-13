import React, { useState, useEffect } from 'react';
import { CERConfiguration, ConfigurationType, NewConfiguration } from '@/types/cer/configuration';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface ConfigurationFormProps {
  configuration?: CERConfiguration;
  onSubmit: (config: NewConfiguration) => Promise<void>;
  onCancel: () => void;
}

export function ConfigurationForm({ configuration, onSubmit, onCancel }: ConfigurationFormProps) {
  const [formData, setFormData] = useState<NewConfiguration>({
    name: '',
    type: 'basic' as ConfigurationType,
    version: '1.0.0',
    status: 'draft',
    features: {
      maxMembers: 100,
      maxProductionUnits: 10,
      reportingFrequency: ['monthly'],
      analytics: 'basic',
    },
    restrictions: {
      allowedLegalForms: ['association'],
      maxCapacity: 200,
      documentStorage: 'basic',
    },
    community: {
      profile: {
        name: '',
        location: '',
        contactInfo: {
          email: '',
          address: '',
        },
      },
      legalForm: 'association',
      governance: {
        type: 'standard',
        roles: [],
        decisionMaking: {
          type: 'majority',
          rules: {},
        },
      },
    },
    technical: {
      boundary: {
        cabinaId: '',
        coordinates: [],
        validationStatus: false,
      },
      productionUnits: [],
      consumptionUnits: [],
      connections: {
        pods: [],
        validations: [],
      },
    },
    economic: {
      incentiveScheme: {
        type: 'standard',
        rates: [],
        conditions: [],
      },
      revenueDistribution: {
        method: 'proportional',
        parameters: {},
      },
      billingSetup: {
        cycle: 'monthly',
        method: 'standard',
        parameters: {},
      },
    },
    compliance: {
      gseRequirements: {
        requirements: [],
        certifications: [],
        status: 'pending',
      },
      areraRequirements: {
        requirements: [],
        validations: [],
        status: 'pending',
      },
      documentationStatus: {
        required: [],
        submitted: [],
        validated: [],
      },
    },
  });

  useEffect(() => {
    if (configuration) {
      setFormData({
        ...configuration,
        id: undefined, // Remove id for NewConfiguration type
      });
    }
  }, [configuration]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting configuration:', error);
    }
  };

  const handleInputChange = (
    field: string,
    value: any,
    section?: string,
    subsection?: string
  ) => {
    setFormData((prev) => {
      if (section && subsection) {
        return {
          ...prev,
          [section]: {
            ...prev[section],
            [subsection]: {
              ...prev[section][subsection],
              [field]: value,
            },
          },
        };
      } else if (section) {
        return {
          ...prev,
          [section]: {
            ...prev[section],
            [field]: value,
          },
        };
      } else {
        return {
          ...prev,
          [field]: value,
        };
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Basic Information</h3>
        
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Type</Label>
          <select
            id="type"
            value={formData.type}
            onChange={(e) => handleInputChange('type', e.target.value)}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
          >
            <option value="basic">Basic</option>
            <option value="advanced">Advanced</option>
            <option value="enterprise">Enterprise</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="version">Version</Label>
          <Input
            id="version"
            value={formData.version}
            onChange={(e) => handleInputChange('version', e.target.value)}
            required
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Features</h3>
        
        <div className="space-y-2">
          <Label htmlFor="maxMembers">Max Members</Label>
          <Input
            id="maxMembers"
            type="number"
            value={formData.features.maxMembers}
            onChange={(e) => handleInputChange('maxMembers', parseInt(e.target.value), 'features')}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="maxProductionUnits">Max Production Units</Label>
          <Input
            id="maxProductionUnits"
            type="number"
            value={formData.features.maxProductionUnits}
            onChange={(e) => handleInputChange('maxProductionUnits', parseInt(e.target.value), 'features')}
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Restrictions</h3>
        
        <div className="space-y-2">
          <Label htmlFor="maxCapacity">Max Capacity (kW)</Label>
          <Input
            id="maxCapacity"
            type="number"
            value={formData.restrictions.maxCapacity}
            onChange={(e) => handleInputChange('maxCapacity', parseInt(e.target.value), 'restrictions')}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-5">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          type="submit"
        >
          {configuration ? 'Update' : 'Create'} Configuration
        </Button>
      </div>
    </form>
  );
} 