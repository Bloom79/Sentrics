export type AssetStatus = "online" | "offline" | "maintenance";

export type Plant = {
  id: string;
  name: string;
  type: "solar" | "wind";
  status: AssetStatus;
  capacity: number;
  currentOutput: number;
  efficiency: number;
  location: {
    latitude: number;
    longitude: number;
  };
};

export type Consumer = {
  id: string;
  name: string;
  type: "residential" | "industrial" | "commercial";
  consumption: number;
  status: string;
  specs: {
    peakDemand: number;
    dailyUsage: number;
    powerFactor: number;
    connectionType: string;
  };
};

export type StorageUnit = {
  id: string;
  name: string;
  type: "battery" | "thermal" | "mechanical";
  capacity: number;
  currentCharge: number;
  status: string;
  health: number;
  temperature: number;
  powerRating: number;
  efficiency: number;
  lastOutput?: number;
  stateOfCharge?: number;
};

export type GridConnection = {
  status: "connected" | "disconnected";
  frequency: number;
  voltage: number;
  congestion: "Low" | "Medium" | "High";
};

export type EnergySource = {
  type: "solar" | "wind";
  output: number;
  capacity: number;
  currentOutput: number;
  status: "online" | "offline" | "maintenance";
};

export type Site = {
  id: string;
  name: string;
  location: string;
  type: "solar" | "wind" | "hybrid";
  status: "online" | "offline" | "maintenance";
  capacity: number;
  efficiency: number;
  co2Saved: number;
  dailyProduction: number;
  monthlyProduction: number;
  plants: Plant[];
  consumers: Consumer[];
  storageUnits: StorageUnit[];
  energySources: EnergySource[];
  storage: {
    capacity: number;
    currentCharge: number;
  };
  gridConnection: GridConnection;
  lastUpdate?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
};

export type Asset = {
  type: "panel" | "inverter" | "battery";
  id?: string;
  serialNumber: string;
  model: string;
  manufacturer: string;
  location: string;
  status: AssetStatus;
  ratedPower: number;
  efficiency: number;
  lastOutput?: number;
  stateOfCharge?: number;
  orientation?: string;
  tilt?: number;
  installationDate?: string;
  technology?: "lithium-ion" | "lead-acid" | "flow";
  energyCapacity?: number;
  roundTripEfficiency?: number;
};