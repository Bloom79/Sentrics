import { CERConfiguration, NewConfiguration } from '@/types/cer/configuration';
import { api } from '@/lib/api';

interface ConfigurationsResponse {
  items: CERConfiguration[];
  total: number;
  total_pages: number;
}

interface MembersResponse {
  items: any[];
  total: number;
  page: number;
  size: number;
}

export class ConfigurationService {
  async getConfigurations(skip: number = 0, limit: number = 100): Promise<ConfigurationsResponse> {
    const response = await api.get('/api/v1/configurations', {
      params: {
        skip,
        limit
      }
    });
    return response.data;
  }

  async getConfiguration(id: number): Promise<CERConfiguration> {
    const response = await api.get(`/api/v1/configurations/${id}`);
    return response.data;
  }

  async createConfiguration(configuration: NewConfiguration): Promise<CERConfiguration> {
    const response = await api.post('/api/v1/configurations', configuration);
    return response.data;
  }

  async updateConfiguration(id: number, configuration: Partial<NewConfiguration>): Promise<CERConfiguration> {
    const response = await api.put(`/api/v1/configurations/${id}`, configuration);
    return response.data;
  }

  async deleteConfiguration(id: number): Promise<void> {
    await api.delete(`/api/v1/configurations/${id}`);
  }

  // New methods for members
  async getMembers(skip: number = 0, limit: number = 100, filters?: any): Promise<MembersResponse> {
    const response = await api.get('/api/v1/members', {
      params: {
        skip,
        limit,
        ...filters
      }
    });
    return response.data;
  }

  async getMember(id: number): Promise<any> {
    const response = await api.get(`/api/v1/members/${id}`);
    return response.data;
  }

  async createMember(member: any): Promise<any> {
    const response = await api.post('/api/v1/members', member);
    return response.data;
  }

  async updateMember(id: number, member: any): Promise<any> {
    const response = await api.put(`/api/v1/members/${id}`, member);
    return response.data;
  }

  async deleteMember(id: number): Promise<void> {
    await api.delete(`/api/v1/members/${id}`);
  }
} 