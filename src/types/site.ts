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
  location: string;
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
  location: string;
  type: string;
  capacity: number;
  status: string;
  lastUpdate: string;
  dailyProduction: number;
  monthlyProduction: number;
  efficiency: number;
  co2Saved: number;
  plants: Plant[];
  consumers: Consumer[];
  storageUnits: StorageUnit[];
  energySources: EnergySource[];
  storage: { capacity: number; currentCharge: number };
  gridConnection: GridConnection;
}