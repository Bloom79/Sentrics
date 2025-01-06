export type StorageUnitStatus = "offline" | "charging" | "discharging" | "idle" | "fault";

export interface StorageUnit {
  id: string;
  name: string;
  capacity: number;
  currentCharge: number;
  status: StorageUnitStatus;
  health: number;
  stateOfHealth: number;
  chargingRate: number;
  cycleCount: number;
  temperature: number;
  powerRating: number;
  lastMaintenance: string;
  nextMaintenance: string;
}

export type PlantType = "solar" | "wind";
export type PlantStatus = "online" | "offline" | "maintenance" | "fault";

export interface Plant {
  id: string;
  name: string;
  type: PlantType;
  capacity: number;
  currentOutput: number;
  efficiency: number;
  status: PlantStatus;
  lastUpdate: string;
  location?: string;
}

export type ConsumerType = "industrial" | "commercial" | "residential";
export type ConsumerStatus = "active" | "inactive" | "maintenance";

export interface Consumer {
  id: string;
  name: string;
  type: ConsumerType;
  capacity: number;
  currentDemand: number;
  consumption: number;
  peakDemand: number;
  status: ConsumerStatus;
  location: string;
  lastUpdate: string;
  contract: {
    startDate: string;
    endDate: string;
    rate: number;
  };
}

export type SiteStatus = "online" | "offline" | "maintenance" | "fault";

export interface Site {
  id: string;
  name: string;
  type: "generation" | "distribution" | "hybrid";
  location: string;
  capacity: number;
  status: SiteStatus;
  lastUpdate: string;
  plants: Plant[];
  consumers: Consumer[];
  storageUnits: StorageUnit[];
  dailyProduction: number;
  monthlyProduction: number;
  efficiency: number;
  co2Saved: number;
  energySources: Array<{
    type: string;
    output: number;
    capacity: number;
    currentOutput: number;
    status: string;
  }>;
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
}

export interface Asset {
  id: string;
  name: string;
  type: "inverter" | "panel" | "turbine" | "transformer" | "battery";
  status: "online" | "offline" | "maintenance" | "fault";
  manufacturer: string;
  model: string;
  serialNumber: string;
  installationDate: string;
  lastMaintenance: string;
  nextMaintenance: string;
  location: string;
  efficiency?: number;
  ratedPower?: number;
  technology?: "lithium-ion" | "lead-acid" | "flow";
  energyCapacity?: number;
  stateOfCharge?: number;
  roundTripEfficiency?: number;
}

export type AssetType = Asset;