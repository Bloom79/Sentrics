export type ChargingDirection = "charging" | "discharging";

export interface BatteryDetail {
  id: string;
  name: string;
  currentPower: number;
  direction: ChargingDirection;
  batteryLevel: number;
  timeRemaining: string;
  temperature: number;
  voltage: number;
  current: number;
  stateOfHealth: number;
  cycleCount: number;
  depthOfDischarge: number;
  cellBalance: "balanced" | "imbalanced";
  powerRating: number;
  alerts?: string[];
  historicalData?: {
    timestamp: string;
    soc: number;
    temperature: number;
    power: number;
  }[];
}

export interface AggregatedData {
  totalCapacity: number;
  currentTotalCharge: number;
  averageTemperature: number;
  totalPower: number;
  overallDirection: ChargingDirection;
}