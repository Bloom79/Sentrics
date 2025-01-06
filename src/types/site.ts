export interface Plant {
  id: string;
  name: string;
  type: "solar" | "wind";
  capacity: number;
  currentOutput: number;
  efficiency: number;
  status: "online" | "offline" | "maintenance";
  lastUpdate?: string;
  location?: string;
  assets?: SolarAsset[] | WindAsset[];
}

export interface SolarAsset {
  id: string;
  type: "panel" | "inverter";
  serialNumber: string;
  model: string;
  installationDate: string;
  status: "operational" | "faulty" | "maintenance";
  lastOutput?: number;
  efficiency?: number;
  location?: string;
}

export interface WindAsset {
  id: string;
  type: "turbine" | "transformer";
  serialNumber: string;
  model: string;
  manufacturer: string;
  ratedCapacity: number;
  status: "operational" | "faulty" | "maintenance";
  currentOutput?: number;
  windSpeed?: number;
  nacelleDirection?: number;
  ratedWindSpeed?: number;
  cutInSpeed?: number;
  cutOutSpeed?: number;
  lastMaintenanceDate?: string;
  pitchControl?: string;
  location?: string;
}

export interface EnergySource {
  id?: string;
  type: string;
  capacity: number;
  output: number;
  currentOutput: number;
  status: string;
}

export interface GridConnection {
  status: string;
  frequency: number;
  voltage: number;
  congestion: string;
  congestionLevel?: string;
}

export interface StorageUnit {
  id: string;
  type?: string;
  capacity: number;
  currentCharge: number;
  status: string;
  health?: number;
  temperature?: number;
  powerRating?: number;
}

export interface Site {
  id: string;
  name: string;
  status: string;
  location?: string;
  lastUpdate: string;
  dailyProduction: number;
  monthlyProduction: number;
  efficiency: number;
  co2Saved: number;
  plants: Plant[];
  energySources: EnergySource[];
  storage: {
    capacity: number;
    currentCharge: number;
  };
  storageUnits?: StorageUnit[];
  gridConnection: GridConnection;
}