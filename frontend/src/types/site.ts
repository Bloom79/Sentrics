import { Json } from "@/types/supabase";

export interface Site {
  id: string;
  name: string;
  type: "industrial" | "commercial" | "residential";
  status: "active" | "inactive" | "maintenance";
  capacity: number;
  currentOutput: number;
  efficiency: number;
  plants: Plant[];
  storage: any[];
  energySources: any[];
  gridConnection: {
    status: string;
    capacity: number;
    currentLoad: number;
    frequency: number;
    voltage: number;
    congestion: number;
  };
  location?: string;
  code?: string;
  description?: string;
  region?: string;
  latitude?: number;
  longitude?: number;
  street_address?: string;
  city?: string;
  postal_code?: string;
  country?: string;
  site_type?: string;
  available_area?: number;
  reserved_area?: number;
  operational_status?: string;
  commissioning_date?: string;
  decommissioning_date?: string;
  owner?: string;
  operator?: string;
  maintenance_provider?: string;
  environmental_impact_rating?: number;
  notes?: string;
  tags?: string[];
}

export interface Plant {
  id: string;
  site_id: string;
  name: string;
  type: 'wind' | 'solar' | 'hybrid';
  capacity: number;
  location: string;
  current_output: number;
  efficiency: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface StorageUnit {
  id: string;
  capacity: number;
  charge_level: number;
  status: "active" | "inactive" | "maintenance";
  efficiency: number;
  current_charge: number;
  power_rating: number;
  temperature?: number;
  health?: number;
}

export interface AssetType {
  id: string;
  name: string;
  attributes?: Record<string, {
    type: string;
    label: string;
    unit?: string;
    options?: string[];
  }>;
}

export interface Asset {
  id: string;
  name: string;
  plant_id: string;
  type_id: string;
  model?: string;
  manufacturer?: string;
  installation_date?: string;
  location?: string;
  status: 'operational' | 'maintenance' | 'offline';
  notes?: string;
  dynamic_attributes?: Record<string, any>;
  asset_type?: AssetType;
  rated_power?: number;
  efficiency?: number;
  created_at: string;
  updated_at: string;
}

export interface AssetMaintenance {
  id: string;
  asset_id: string;
  maintenance_type: string;
  description: string;
  maintenance_date: string;
  next_maintenance_date?: string;
  status: string;
  technician?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface AssetMonitoring {
  id: string;
  asset_id: string;
  timestamp: string;
  metric: string;
  value: number;
  unit: string;
  status: string;
  created_at: string;
  updated_at: string;
}