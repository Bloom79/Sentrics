export type Plant = {
  id: string;
  name: string;
  type: "solar" | "wind";
  capacity: number;
  currentOutput: number;
  efficiency: number;
  status: "online" | "offline" | "maintenance";
  lastUpdate?: string;
  location?: string;
};

export type AssetStatus = "operational" | "maintenance" | "faulty";

export type AssetType =
  | {
      type: "panel";
      id?: string;
      serialNumber: string;
      model: string;
      manufacturer: string;
      location: string;
      status: AssetStatus;
      ratedPower: number;
      efficiency: number;
      orientation?: string;
      tilt?: number;
      installationDate?: string;
    }
  | {
      type: "inverter";
      id?: string;
      serialNumber: string;
      model: string;
      manufacturer: string;
      location: string;
      status: AssetStatus;
      efficiency: number;
      ratedPower: number;
      installationDate?: string;
    }
  | {
      type: "turbine";
      id?: string;
      serialNumber: string;
      model: string;
      manufacturer: string;
      location: string;
      status: AssetStatus;
      ratedCapacity: number;
      rotorDiameter: number;
      hubHeight: number;
      cutInSpeed: number;
      cutOutSpeed: number;
      installationDate?: string;
    }
  | {
      type: "transformer";
      id?: string;
      serialNumber: string;
      model: string;
      manufacturer: string;
      location: string;
      status: AssetStatus;
      capacity: number;
      voltageIn: number;
      voltageOut: number;
      efficiency: number;
      installationDate?: string;
    }
  | {
      type: "battery";
      id?: string;
      serialNumber: string;
      model: string;
      manufacturer: string;
      location: string;
      status: AssetStatus;
      technology: "lithium-ion" | "lead-acid" | "flow";
      ratedPower: number;
      energyCapacity: number;
      roundTripEfficiency?: number;
      installationDate?: string;
    };

export type Consumer = {
  id: string;
  name: string;
  type: "residential" | "industrial" | "commercial";
  consumption: number;
  status: string;
  specs?: {
    peakDemand: number;
    dailyUsage: number;
    powerFactor: number;
    connectionType?: string;
  };
};

export type Site = {
  id: string;
  name: string;
  location: string;
  plants: Plant[];
  consumers: Consumer[];
};

export type StorageUnit = {
  id: string;
  name: string;
  type: string;
  capacity: number;
  currentCharge: number;
  status: string;
};