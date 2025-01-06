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
}

export interface AggregatedData {
  totalCapacity: number;
  currentTotalCharge: number;
  averageTemperature: number;
  totalPower: number;
  overallDirection: ChargingDirection;
}