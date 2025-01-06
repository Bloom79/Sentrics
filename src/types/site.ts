export interface Site {
  id: string;
  name: string;
  location: string;
  type: "solar" | "wind" | "hybrid";
  capacity: number;
  status: "online" | "offline" | "maintenance";
  lastUpdate: string;
  dailyProduction: number;
  monthlyProduction: number;
  efficiency: number;
  co2Saved: number;
  coordinates?: {
    lat: number;
    lng: number;
  };
  plants: Plant[];
  consumers: Consumer[];
  energySources: EnergySource[];
  storage: {
    capacity: number;
    currentCharge: number;
  };
  storageUnits: StorageUnit[];
  gridConnection: {
    status: string;
    frequency: number;
    voltage: number;
    congestion: string;
  };
}

export interface Plant {
  id: string;
  name: string;
  type: "solar" | "wind";
  capacity: number;
  currentOutput: number;
  efficiency: number;
  status: "online" | "offline" | "maintenance";
  lastUpdate?: string;
  location?: string;
}

export interface Consumer {
  id: string;
  name: string;
  consumption: number;
  type: "industrial" | "commercial" | "residential";
  status: "active" | "inactive";
  specs?: {
    peakDemand?: number;
    dailyUsage?: number;
    powerFactor?: number;
    connectionType?: string;
  };
}

export interface EnergySource {
  type: string;
  output: number;
  capacity: number;
  currentOutput: number;
  status: string;
}

export interface StorageUnit {
  id: string;
  name: string;
  capacity: number;
  currentCharge: number;
  status: "charging" | "discharging" | "idle" | "offline";
  powerRating: number;
  temperature: number;
  health: number;
  efficiency: number;
  cycleCount?: number;
  stateOfHealth?: number;
  voltage?: number;
  current?: number;
}

export interface BaseAsset {
  id: string;
  type: "inverter" | "panel" | "battery" | "transformer" | "turbine";
  serialNumber: string;
  model: string;
  manufacturer: string;
  installationDate: string;
  status: "operational" | "faulty" | "maintenance";
  location: string;
}

export interface SolarPanel extends BaseAsset {
  type: "panel";
  ratedPower: number;
  efficiency: number;
  lastOutput?: number;
  orientation?: string;
  tilt?: number;
}

export interface Inverter extends BaseAsset {
  type: "inverter";
  efficiency: number;
  ratedPower: number;
  lastOutput?: number;
}

export interface WindTurbine extends BaseAsset {
  type: "turbine";
  ratedCapacity: number;
  rotorDiameter: number;
  hubHeight: number;
  cutInSpeed: number;
  cutOutSpeed: number;
}

export interface Transformer extends BaseAsset {
  type: "transformer";
  capacity: number;
  voltageIn: number;
  voltageOut: number;
  efficiency: number;
}

export interface Battery extends BaseAsset {
  type: "battery";
  technology: "lithium-ion" | "lead-acid" | "flow";
  ratedPower: number;
  energyCapacity: number;
  stateOfCharge?: number;
  roundTripEfficiency?: number;
}

export type AssetType = SolarPanel | Inverter | WindTurbine | Transformer | Battery;
