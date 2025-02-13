import { z } from "zod";

const stringSchema = z.object({
  code: z.string(),
  combiner_box: z.string(),
  fault_status: z.enum(["normal", "warning", "fault"]),
  panels: z.array(z.string())
});

export const assetSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type_id: z.string().min(1, "Asset type is required"),
  model: z.string(),
  manufacturer: z.string(),
  location: z.string(),
  installation_date: z.string(),
  notes: z.string(),
  dynamic_attributes: z.object({
    strings: z.record(stringSchema).optional(),
  }).optional(),
});

export type AssetFormValues = z.infer<typeof assetSchema>; 