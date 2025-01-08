export interface Location {
  latitude: number;
  longitude: number;
}

export interface Plant {
  id: string;
  name: string;
  type: "solar" | "wind";
  capacity: number;
  currentOutput: number;
  efficiency: number;
  status: string;
  location: Location;
  lastUpdate?: string;
}

export interface ConsumerSpecs {
  dailyUsage: number;
  peakDemand: number;
  powerFactor: number;
  connectionType: string;
}

export interface Consumer {
  id: string;
  name: string;
  type: string;
  consumption: number;
  status: string;
  specs: ConsumerSpecs;
}

export interface StorageUnit {
  id: string;
  name: string;
  type: "battery";
  capacity: number;
  currentCharge: number;
  status: string;
  powerRating: number;
  temperature: number;
  health: number;
  efficiency: number;
}

export type AssetStatus = "operational" | "maintenance" | "faulty";

export interface Site {
  id: string;
  name: string;
  location: Location;
  plants: Plant[];
  consumers: Consumer[];
  storageUnits: StorageUnit[];
  status: "online" | "offline" | "maintenance";
  totalCapacity: number;
  currentProduction: number;
  efficiency: number;
}