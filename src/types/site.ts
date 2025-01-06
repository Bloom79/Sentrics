export type StorageUnit = {
  id: string;
  capacity: number;
  currentCharge: number;
  status: "charging" | "discharging" | "idle";
  health: number;
  temperature: number;
  powerRating: number;
};

export type Site = {
  id: string;
  name: string;
  location: string;
  energySources: {
    id: string;
    type: "solar" | "eolic";
    capacity: number;
    currentOutput: number;
    status: "active" | "inactive" | "maintenance";
  }[];
  storageUnits: StorageUnit[];
  totalCapacity: number;
  currentOutput: number;
  gridConnection: {
    status: "connected" | "disconnected";
    frequency: number;
    voltage: number;
    congestionLevel: "Low" | "Medium" | "High";
  };
};