import * as z from "zod";

export const siteFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  code: z.string().optional(),
  description: z.string().optional(),
  region: z.string().optional(),
  location: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  street_address: z.string().optional(),
  city: z.string().optional(),
  postal_code: z.string().optional(),
  country: z.string().optional(),
  site_type: z.enum(["Solar", "Wind", "Hybrid"]),
  available_area: z.number().optional(),
  reserved_area: z.number().optional(),
  operational_status: z.enum(["Active", "Inactive", "Under Construction", "Under Maintenance"]),
  type: z.enum(["industrial", "commercial", "residential"]),
  status: z.enum(["active", "inactive", "maintenance"]),
  capacity: z.number().min(0),
  efficiency: z.number().min(0).max(100),
  commissioning_date: z.string().optional(),
  decommissioning_date: z.string().optional(),
  owner: z.string().optional(),
  operator: z.string().optional(),
  maintenance_provider: z.string().optional(),
  environmental_impact_rating: z.string().optional(),
  notes: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export type SiteFormValues = z.infer<typeof siteFormSchema>;