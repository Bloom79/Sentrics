export interface Site {
  id: string;
  name: string;
  location: string;
  type: "solar" | "wind" | "hybrid";
  capacity: number;
  status: "online" | "offline" | "maintenance";
  lastUpdate: string;
  dailyProduction: number;
  monthlyProduction: number;
  efficiency: number;
  co2Saved: number;
  coordinates?: {
    lat: number;
    lng: number;
  };
  plants: Plant[];
  consumers: Consumer[];
  energySources: EnergySource[];
  storage: {
    capacity: number;
    currentCharge: number;
  };
  storageUnits: StorageUnit[];
  gridConnection: {
    status: string;
    frequency: number;
    voltage: number;
    congestion: string;
  };
}

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
}

export interface Consumer {
  id: string;
  name: string;
  consumption: number;
  type: string;
  status: "active" | "inactive";
}

export interface EnergySource {
  type: string;
  output: number;
  capacity: number;
  currentOutput: number;
  status: string;
}

export interface StorageUnit {
  id: string;
  name: string;
  capacity: number;
  currentCharge: number;
  status: "charging" | "discharging" | "idle" | "offline";
  powerRating: number;
  temperature: number;
  health: number;
  efficiency: number;
  cycleCount?: number;
  stateOfHealth?: number;
  voltage?: number;
  current?: number;
}