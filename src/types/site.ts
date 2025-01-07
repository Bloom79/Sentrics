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

export type Plant = {
  id: string;
  name: string;
  type: 'solar' | 'wind';
  capacity: number;
  currentOutput: number;
  efficiency: number;
  status: string;
  location: {
    latitude: number;
    longitude: number;
  };
};

export type Site = {
  id: string;
  name: string;
  location: {
    latitude: number;
    longitude: number;
  };
  plants: Plant[];
  consumers: Consumer[];
  storageUnits: StorageUnit[];
};

export type AssetType = 'panel' | 'inverter' | 'turbine' | 'transformer' | 'battery';
export type AssetStatus = 'operational' | 'maintenance' | 'faulty';

export type StorageUnit = {
  id: string;
  name: string;
  type: 'battery' | 'hydrogen' | 'thermal';
  capacity: number;
  currentCharge: number;
  status: string;
  powerRating: number;
  temperature: number;
  health: number;
  efficiency: number;
};