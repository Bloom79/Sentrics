export type Plant = {
  id: string;
  name: string;
  type: "solar" | "wind";
  capacity: number;
  currentOutput: number;
  efficiency: number;
  status: "online" | "offline" | "maintenance";
  lastUpdate?: string;
};

export type AssetStatus = "operational" | "maintenance" | "faulty";

export type AssetType =
  | {
      type: "panel";
      serialNumber: string;
      model: string;
      manufacturer: string;
      location: string;
      status: AssetStatus;
      ratedPower: number;
      efficiency: number;
      orientation?: string;
      tilt?: number;
    }
  | {
      type: "inverter";
      serialNumber: string;
      model: string;
      manufacturer: string;
      location: string;
      status: AssetStatus;
      efficiency: number;
      ratedPower: number;
    }
  | {
      type: "turbine";
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
    }
  | {
      type: "transformer";
      serialNumber: string;
      model: string;
      manufacturer: string;
      location: string;
      status: AssetStatus;
      capacity: number;
      voltageIn: number;
      voltageOut: number;
      efficiency: number;
    }
  | {
      type: "battery";
      serialNumber: string;
      model: string;
      manufacturer: string;
      location: string;
      status: AssetStatus;
      technology: "lithium-ion" | "lead-acid" | "flow";
      ratedPower: number;
      energyCapacity: number;
      roundTripEfficiency?: number;
    };
