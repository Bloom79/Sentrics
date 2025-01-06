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

interface BaseAsset {
  id: string;
  serialNumber: string;
  model: string;
  manufacturer: string;
  installationDate: string;
  status: "operational" | "faulty" | "maintenance";
  location?: string;
}

export interface SolarPanel extends BaseAsset {
  type: "panel";
  ratedPower: number;
  efficiency: number;
  orientation?: string;
  tilt?: number;
  lastOutput?: number;
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
}

export type AssetType = SolarPanel | Inverter | WindTurbine | Transformer | Battery;