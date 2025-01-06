export interface Plant {
  id: string;
  name: string;
  type: "solar" | "wind";
  capacity: number;
  currentOutput: number;
  efficiency: number;
  status: string;
}

export interface EnergySource {
  type: string;
  output: number;
  capacity: number;
}

export interface Storage {
  capacity: number;
  currentCharge: number;
}

export interface GridConnection {
  status: string;
  frequency: number;
  voltage: number;
  congestion: string;
}

export interface Site {
  id: string;
  name: string;
  status: string;
  lastUpdate: string;
  dailyProduction: number;
  monthlyProduction: number;
  efficiency: number;
  co2Saved: number;
  plants: Plant[];
  energySources: EnergySource[];
  storage: Storage;
  gridConnection: GridConnection;
  location?: {
    lat: number;
    lng: number;
  };
}