import { Location } from './location';

export interface Consumer {
  id: string;
  name: string;
  full_name: string;
  type: 'industrial' | 'commercial' | 'residential';
  status: 'active' | 'inactive' | 'pending';
  created_at: string;
  specs: ConsumerSpecs;
  contact_person?: string;
  phone?: string;
  email?: string;
  vat_number?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  country?: string;
  notes?: string;
}

export interface ConsumerSpecs {
  peakDemand: number;
  dailyUsage: number;
  powerFactor: number;
  connectionType: string;
}

export interface Plant {
  id: string;
  name: string;
  type: 'solar' | 'wind' | 'hydro';
  capacity: number;
  status: 'active' | 'inactive' | 'maintenance';
  location: Location;
  efficiency: number;
  currentOutput: number;
}

export interface StorageUnit {
  id: string;
  name: string;
  capacity: number;
  chargeLevel: number;
  status: 'active' | 'inactive' | 'maintenance';
  efficiency: number;
  technology: string;
}

export interface Site {
  id: string;
  name: string;
  location: Location;
  type: 'industrial' | 'commercial' | 'residential';
  status: 'active' | 'inactive' | 'maintenance';
  capacity: number;
  currentOutput: number;
  efficiency: number;
  plants: Plant[];
  storage: StorageUnit[];
  energySources: EnergySource[];
  gridConnection: GridConnection;
}

export interface EnergySource {
  id: string;
  name: string;
  type: string;
  capacity: number;
  currentOutput: number;
  output: number;
}

export interface GridConnection {
  status: 'connected' | 'disconnected';
  capacity: number;
  currentLoad: number;
  frequency: number;
  voltage: number;
  congestion: number;
}

export type AssetType = {
  id: string;
  type: string;
  serialNumber: string;
  model: string;
  manufacturer: string;
  installationDate: string;
  status: 'operational' | 'maintenance' | 'faulty';
  location: string;
  [key: string]: any;
};