export interface Site {
  id: string;
  name: string;
  location: string;
  type: "solar" | "wind";
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
  energySources: {
    type: string;
    output: number;
    capacity: number;
    currentOutput: number;
    status: string;
  }[];
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

export interface Consumer {
  id: string;
  name: string;
  type: "industrial" | "commercial" | "residential";
  consumption: number;
  status: "online" | "offline" | "maintenance";
  peakDemand?: number;
  location?: string;
  lastUpdate?: string;
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

export interface StorageUnit {
  id: string;
  name: string;
  capacity: number;
  currentCharge: number;
  powerRating: number;
  status: "charging" | "discharging" | "idle" | "offline";
  health: number;
  temperature: number;
  stateOfHealth: number;
  chargingRate: number;
  cycleCount: number;
  lastMaintenance: string;
  nextMaintenance: string;
  efficiency: number;
  alerts?: string[];
}