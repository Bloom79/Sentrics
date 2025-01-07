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
  lastUpdate?: string;
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

export type AssetType = {
  id: string;
  type: "panel" | "inverter" | "turbine" | "transformer" | "battery";
  serialNumber: string;
  model: string;
  manufacturer: string;
  installationDate: string;
  status: AssetStatus;
  lastOutput?: number;
  efficiency: number;
  location: string;
  ratedPower?: number;
  technology?: "lithium-ion" | "lead-acid" | "flow";
  energyCapacity?: number;
  roundTripEfficiency?: number;
  stateOfCharge?: number;
  cutInSpeed?: number;
  cutOutSpeed?: number;
  rotorDiameter?: number;
  hubHeight?: number;
  ratedCapacity?: number;
  voltageIn?: number;
  voltageOut?: number;
  capacity?: number;
};