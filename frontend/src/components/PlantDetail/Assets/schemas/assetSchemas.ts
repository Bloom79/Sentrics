import * as z from "zod";

export const baseAssetSchema = z.object({
  serialNumber: z.string().min(1, "Serial number is required"),
  model: z.string().min(1, "Model is required"),
  manufacturer: z.string().min(1, "Manufacturer is required"),
  location: z.string().min(1, "Location is required"),
  installationDate: z.string().min(1, "Installation date is required"),
  status: z.enum(["operational", "maintenance", "fault"]),
});

export const solarPanelSchema = baseAssetSchema.extend({
  type: z.literal("panel"),
  ratedPower: z.coerce.number().min(0),
  efficiency: z.coerce.number().min(0).max(100),
  orientation: z.string().optional(),
  tilt: z.coerce.number().min(0).max(90).optional(),
  currentOutput: z.coerce.number().min(0).optional(),
});

export const inverterSchema = baseAssetSchema.extend({
  type: z.literal("inverter"),
  efficiency: z.coerce.number().min(0).max(100),
  ratedPower: z.coerce.number().min(0),
  dcInputMin: z.coerce.number().min(0).optional(),
  dcInputMax: z.coerce.number().min(0).optional(),
  currentOutput: z.coerce.number().min(0).optional(),
});

export const windTurbineSchema = baseAssetSchema.extend({
  type: z.literal("turbine"),
  ratedCapacity: z.coerce.number().min(0),
  rotorDiameter: z.coerce.number().min(0),
  hubHeight: z.coerce.number().min(0),
  cutInSpeed: z.coerce.number().min(0),
  cutOutSpeed: z.coerce.number().min(0),
  currentOutput: z.coerce.number().min(0).optional(),
});

export const transformerSchema = baseAssetSchema.extend({
  type: z.literal("transformer"),
  capacity: z.coerce.number().min(0),
  voltageIn: z.coerce.number().min(0),
  voltageOut: z.coerce.number().min(0),
  efficiency: z.coerce.number().min(0).max(100),
});

export const batterySchema = baseAssetSchema.extend({
  type: z.literal("battery"),
  technology: z.enum(["lithium-ion", "lead-acid", "flow"]),
  ratedPower: z.coerce.number().min(0),
  energyCapacity: z.coerce.number().min(0),
  stateOfCharge: z.coerce.number().min(0).max(100).optional(),
  roundTripEfficiency: z.coerce.number().min(0).max(100).optional(),
  cycleCount: z.coerce.number().min(0).optional(),
});

export const assetSchema = z.discriminatedUnion("type", [
  solarPanelSchema,
  inverterSchema,
  windTurbineSchema,
  transformerSchema,
  batterySchema,
]);