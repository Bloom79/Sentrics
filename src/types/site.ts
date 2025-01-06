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

export interface EnergySource {
  type: string;
  capacity: number;
  currentOutput: number;
  output: number;
  status: string;
}

export interface GridConnection {
  status: string;
  frequency: number;
  voltage: number;
  congestion: string;
  congestionLevel?: string;
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
  gridConnection: GridConnection;
}