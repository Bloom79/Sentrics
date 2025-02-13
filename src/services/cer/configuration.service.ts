import { CERConfiguration, NewConfiguration, UpdatedConfiguration, PlantMapping } from '../../types/cer/configuration';

export class ConfigurationService {
  // CRUD Operations
  async getConfigurations(cerId: string): Promise<CERConfiguration[]> {
    try {
      const response = await fetch(`/api/cer/${cerId}/configurations`);
      if (!response.ok) throw new Error('Failed to fetch configurations');
      return response.json();
    } catch (error) {
      console.error('Error fetching configurations:', error);
      throw error;
    }
  }

  async createConfiguration(config: NewConfiguration, cerId: string): Promise<string> {
    try {
      const response = await fetch('/api/cer/configurations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...config, cerId }),
      });
      if (!response.ok) throw new Error('Failed to create configuration');
      const { id } = await response.json();
      return id;
    } catch (error) {
      console.error('Error creating configuration:', error);
      throw error;
    }
  }

  async updateConfiguration(config: UpdatedConfiguration): Promise<void> {
    try {
      const response = await fetch(`/api/cer/configurations/${config.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });
      if (!response.ok) throw new Error('Failed to update configuration');
    } catch (error) {
      console.error('Error updating configuration:', error);
      throw error;
    }
  }

  async deleteConfiguration(configId: string): Promise<void> {
    try {
      const response = await fetch(`/api/cer/configurations/${configId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete configuration');
    } catch (error) {
      console.error('Error deleting configuration:', error);
      throw error;
    }
  }

  // Plant Mapping Operations
  async mapPlants(configId: string, plantIds: string[]): Promise<void> {
    try {
      const response = await fetch(`/api/cer/configurations/${configId}/plants`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ plantIds }),
      });
      if (!response.ok) throw new Error('Failed to map plants');
    } catch (error) {
      console.error('Error mapping plants:', error);
      throw error;
    }
  }

  async unmapPlants(configId: string, plantIds: string[]): Promise<void> {
    try {
      const response = await fetch(`/api/cer/configurations/${configId}/plants`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ plantIds }),
      });
      if (!response.ok) throw new Error('Failed to unmap plants');
    } catch (error) {
      console.error('Error unmapping plants:', error);
      throw error;
    }
  }

  async getPlantMappings(configId: string): Promise<PlantMapping[]> {
    try {
      const response = await fetch(`/api/cer/configurations/${configId}/plants`);
      if (!response.ok) throw new Error('Failed to fetch plant mappings');
      return response.json();
    } catch (error) {
      console.error('Error fetching plant mappings:', error);
      throw error;
    }
  }
} 