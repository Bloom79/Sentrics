export interface StorageUnit {
  id: string;
  name: string;
  type: "battery";
  capacity: number;
  currentCharge: number;
  status: string;
  powerRating: number;
  temperature: number;
  health: number;
  efficiency: number;
}

export type AssetStatus = "operational" | "maintenance" | "faulty";