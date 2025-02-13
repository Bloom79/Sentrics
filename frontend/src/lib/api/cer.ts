import { api } from '@/lib/api';

export interface LoadProfile {
  id: string;
  name: string;
  type: string;
  visibility: string;
  data_source: string;
  description?: string;
  created_at: string;
  updated_at: string;
  data?: {
    timestamp: string;
    consumption_kwh: number;
  }[];
}

export interface LoadProfileCreate {
  name: string;
  type: string;
  visibility: string;
  data_source: string;
  description?: string;
}

export interface SimulationConfig {
  configuration_id: string;
  duration_days: number;
  simulation_type: 'quick' | 'real';
  include_weather?: boolean;
  include_historical_data?: boolean;
  time_scale?: number;
  batch_size?: number;
}

export interface SimulationMetrics {
  production: number;
  consumption: number;
  grid_feed_in: number;
  grid_consumption: number;
  self_consumption: number;
  shared_energy: number;
}

export interface SimulationStatus {
  configuration_id: string;
  current_time: string;
  metrics: SimulationMetrics;
  is_running: boolean;
  progress: number;
  estimated_time_remaining: string;
  processed_intervals: number;
  total_intervals: number;
  simulation_type: 'quick' | 'real';
}

// Load Profile API functions
export const loadProfilesApi = {
  list: async (params?: {
    type?: string;
    visibility?: string;
    search?: string;
    skip?: number;
    limit?: number;
  }) => {
    const response = await api.get<LoadProfile[]>('/api/cer/load-profiles', { params });
    return response.data;
  },

  get: async (id: string) => {
    const response = await api.get<LoadProfile>(`/api/cer/load-profiles/${id}`);
    return response.data;
  },

  create: async (data: LoadProfileCreate, file?: File) => {
    const formData = new FormData();
    formData.append('profile', JSON.stringify(data));
    if (file) {
      formData.append('file', file);
    }
    const response = await api.post<LoadProfile>('/api/cer/load-profiles', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  update: async (id: string, data: LoadProfileCreate) => {
    const response = await api.put<LoadProfile>(`/api/cer/load-profiles/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    await api.delete(`/api/cer/load-profiles/${id}`);
  },

  downloadTemplate: () => {
    const template = 'timestamp,consumption_kwh\n00:00,0\n00:15,0\n00:30,0\n00:45,0\n01:00,0';
    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'load_profile_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  },
};

// Simulation API functions
export const simulationApi = {
  getStatus: async (configurationId: string) => {
    const response = await api.get<SimulationStatus>(`/api/cer/simulation/status/${configurationId}`);
    return response.data;
  },

  stop: async (configurationId: string) => {
    const response = await api.post(`/api/cer/simulation/stop/${configurationId}`);
    return response.data;
  },

  createWebSocket: (configurationId: string) => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    // Use port 8000 for development
    const host = import.meta.env.DEV ? 'localhost:8000' : (import.meta.env.VITE_API_URL || window.location.host);
    const wsUrl = `${protocol}//${host}/api/cer/simulation/ws/${configurationId}`;
    console.log('Creating WebSocket connection to:', wsUrl);
    return new WebSocket(wsUrl);
  },

  // Helper function to create default configurations
  createDefaultConfig: (configurationId: string, type: 'quick' | 'real' = 'real'): SimulationConfig => {
    if (type === 'quick') {
      return {
        configuration_id: configurationId,
        duration_days: 365,
        simulation_type: 'quick',
        include_weather: false,
        include_historical_data: false,
        time_scale: 1000.0,
        batch_size: 96
      };
    }
    return {
      configuration_id: configurationId,
      duration_days: 365,
      simulation_type: 'real',
      include_weather: true,
      include_historical_data: true,
      time_scale: 2.0,
      batch_size: 24
    };
  }
}; 