export interface Site {
  id: string;
  name: string;
  type: string;
  status: "active" | "inactive" | "maintenance";
  capacity: number;
  efficiency: number;
  operational_status: "Active" | "Inactive" | "Under Construction" | "Under Maintenance";
  storage_units: StorageUnit[];
  plants: Plant[];
}

export interface Plant {
  id: string;
  name: string;
  type: "solar" | "wind";
  capacity: number;
  current_output: number;
  efficiency: number;
  status: "active" | "inactive" | "maintenance";
  location: string;
}

export interface StorageUnit {
  id: string;
  capacity: number;
  charge_level: number;
  status: "active" | "inactive" | "maintenance";
  efficiency: number;
  current_charge: number;
  power_rating: number;
  temperature?: number;
  health?: number;
}