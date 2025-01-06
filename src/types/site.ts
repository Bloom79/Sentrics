export interface Site {
  id: string;
  name: string;
  location: string;
  type: "solar" | "wind" | "hybrid";
  capacity: number;
  status: "online" | "offline" | "maintenance";
  plants: Plant[];
}

export interface Plant {
  id: string;
  name: string;
  type: "solar" | "wind" | "hybrid";
  capacity: number;
  currentOutput: number;
  efficiency: number;
  status: "online" | "offline" | "maintenance";
  lastUpdate?: string;
  location?: string;
}

export interface StorageUnit {
  id: string;
  name: string;
  capacity: number;
  currentCharge: number;
  status: "charging" | "discharging" | "idle" | "offline";
}

interface BaseAsset {
  id: string;
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
  orientation?: string;
  tilt?: number;
  lastOutput?: number;
  temperature?: number;
  performanceRatio?: number;
}

export interface Inverter extends BaseAsset {
  type: "inverter";
  efficiency: number;
  ratedPower: number;
  dcInputRange?: {
    min: number;
    max: number;
  };
  lastOutput?: number;
}

export interface WindTurbine extends BaseAsset {
  type: "turbine";
  ratedCapacity: number;
  rotorDiameter: number;
  hubHeight: number;
  cutInSpeed: number;
  cutOutSpeed: number;
  currentOutput?: number;
  windSpeed?: number;
  nacelleDirection?: number;
  bladePitchAngle?: number;
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
  cycleCount?: number;
  thermalManagement?: string;
}

export type AssetType = SolarPanel | Inverter | WindTurbine | Transformer | Battery;

// For backward compatibility with existing components
export type SolarAsset = SolarPanel | Inverter;
export type WindAsset = WindTurbine;