export interface Asset {
  id: string;
  plant_id: string;
  type_id: string;
  name: string;
  model: string;
  manufacturer: string;
  installation_date: string;
  location: string;
  status: "operational" | "offline" | "maintenance";
  rated_power?: number;
  efficiency?: number;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  dynamic_attributes?: Record<string, any>;
  asset_type?: {
    name: string;
  };
  parent_id?: string;
  component_type?: string;
}

export interface AssetMaintenance {
  id: string;
  asset_id: string;
  maintenance_date: string;
  maintenance_type: "routine" | "emergency" | "repair" | "inspection";
  performed_by: string;
  description?: string;
  next_maintenance_date?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AssetMonitoring {
  id: string;
  asset_id: string;
  timestamp: string;
  parameter: string;
  value: number;
  unit: string;
  created_at?: string;
}

export interface Site {
  id: string;
  name: string;
  type: "industrial" | "commercial" | "residential";
  status: "active" | "inactive" | "maintenance";
  capacity: number;
  efficiency: number;
  operational_status: "Active" | "Inactive" | "Under Construction" | "Under Maintenance";
  storage_units: StorageUnit[];
  plants: Plant[];
  location?: string;
  region?: string;
  city?: string;
  country?: string;
  postal_code?: string;
  description?: string;
  site_type?: string;
  available_area?: number;
  reserved_area?: number;
  owner?: string;
  operator?: string;
  maintenance_provider?: string;
  environmental_impact_rating?: string;
  notes?: string;
  tags?: string[];
  code?: string;
  street_address?: string;
  updated_at?: string;
  created_at?: string;
}

export interface Plant {
  id: string;
  name: string;
  type: "solar" | "wind";
  capacity: number;
  current_output: number;
  efficiency: number;
  status: string;
  location: string;
  site_id: string;
  created_at?: string;
  updated_at?: string;
}

export interface StorageUnit {
  id: string;
  site_id: string;
  name: string;
  type: string;
  capacity: number;
  charge_level: number;
  status: string;
  efficiency: number;
  technology: string;
  current_charge: number;
  power_rating: number;
  temperature?: number;
  health?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Consumer {
  id: string;
  name: string;
  full_name: string;
  type: "commercial" | "industrial";
  status: string;
  created_at: string;
  specs: {
    peakDemand: number;
    dailyUsage: number;
    powerFactor: number;
    connectionType: string;
  };
}