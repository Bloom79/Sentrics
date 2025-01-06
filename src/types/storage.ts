export interface StorageUnit {
  id: string;
  name: string;
  capacity: number;
  currentCharge: number;
  powerRating: number;
  stateOfHealth: number;
  temperature: number;
  status: "charging" | "discharging" | "idle" | "fault";
  chargingRate: number;
  cycleCount: number;
  lastMaintenance: string;
  nextMaintenance: string;
  alerts?: string[];
  efficiency: number;
}

export interface StorageSystem {
  totalCapacity: number;
  totalCurrentCharge: number;
  units: StorageUnit[];
  aggregatedHealth: number;
  totalPowerRating: number;
}