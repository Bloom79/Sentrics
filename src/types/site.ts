export interface Plant {
  id: string;
  name: string;
  type: "solar" | "wind";
  capacity: number;
  currentOutput: number;
  efficiency: number;
  status: string;
}

export interface StorageUnit {
  id: string;
  capacity: number;
  currentCharge: number;
  status: string;
  health: number;
  temperature: number;
  powerRating: number;
}

export interface EnergySource {
  id: string;
  type: string;
  capacity: number;
  currentOutput: number;
  status: string;
}

export interface GridConnection {
  status: string;
  frequency: number;
  voltage: number;
  congestionLevel: string;
}

export interface Site {
  id: string;
  name: string;
  location: string;
  energySources: EnergySource[];
  storageUnits: StorageUnit[];
  totalCapacity: number;
  currentOutput: number;
  gridConnection: GridConnection;
}