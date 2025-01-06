export type Plant = {
  id: string;
  name: string;
  type: "solar" | "wind";
  capacity: number;
  currentOutput: number;
  efficiency: number;
  status: string;
};

export type Site = {
  id: string;
  name: string;
  status: string;
  lastUpdate: string;
  dailyProduction: number;
  monthlyProduction: number;
  efficiency: number;
  co2Saved: number;
  plants: Plant[];
  energySources: {
    type: string;
    output: number;
    capacity: number;
  }[];
  storage: {
    capacity: number;
    currentCharge: number;
  };
  gridConnection: {
    status: string;
    frequency: number;
    voltage: number;
    congestion: string;
  };
};