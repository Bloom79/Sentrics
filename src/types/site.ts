export type ConsumerType = 'residential' | 'commercial' | 'industrial';
export type ConsumerStatus = 'active' | 'inactive' | 'pending';

export interface ConsumerSpecs {
  peakDemand: number;
  dailyUsage: number;
  powerFactor: number;
  connectionType: 'low-voltage' | 'medium-voltage' | 'high-voltage';
}

export interface Consumer {
  id: string;
  full_name: string;
  type: ConsumerType;
  consumption: number;
  status: ConsumerStatus;
  specs: ConsumerSpecs;
  address?: string;
  city?: string;
  postal_code?: string;
  country?: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  vat_number?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  avatar_url?: string;
  invitation_sent_at?: string;
  invited_by?: string;
  invitation_token?: string;
  role?: string;
  username?: string;
}

export interface Location {
  latitude: number;
  longitude: number;
}

export interface StorageUnit {
  id: string;
  name: string;
  type: 'battery' | 'thermal' | 'hydro';
  capacity: number;
  currentCharge: number;
  status: string;
  health: number;
  temperature: number;
  powerRating: number;
  efficiency: number;
}

export interface Plant {
  id: string;
  name: string;
  type: 'solar' | 'wind';
  capacity: number;
  currentOutput: number;
  efficiency: number;
  status: string;
  location: Location;
  lastUpdate?: string;
}

export interface EnergySource {
  type: string;
  output: number;
  capacity: number;
  currentOutput: number;
  status: string;
}

export interface GridConnection {
  status: string;
  capacity: number;
  voltage: number;
  frequency: number;
  congestion: 'Low' | 'Medium' | 'High';
}

export interface Site {
  id: string;
  name: string;
  location: Location;
  type: string;
  capacity: number;
  status: string;
  lastUpdate: string;
  efficiency: number;
  co2Saved: number;
  plants: Plant[];
  consumers: Consumer[];
  storageUnits: StorageUnit[];
  energySources: EnergySource[];
  storage: { capacity: number; currentCharge: number };
  gridConnection: GridConnection;
  dailyProduction: number;
  monthlyProduction: number;
}

export interface AssetType {
  id: string;
  name: string;
  type: string;
  status: string;
  manufacturer?: string;
  model?: string;
  serialNumber?: string;
  installationDate?: string;
  lastMaintenance?: string;
  nextMaintenance?: string;
  efficiency?: number;
  notes?: string;
  lastOutput?: number;
  ratedCapacity?: number;
  capacity?: number;
  technology?: string;
}