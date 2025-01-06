import { z } from "zod";

export type ContractFormValues = z.infer<typeof contractSchema>;

export const contractSchema = z.object({
  type: z.enum(["fixed_rate", "variable_rate", "peak_off_peak"]),
  rate: z.number().optional(),
  peak_rate: z.number().optional(),
  off_peak_rate: z.number().optional(),
  variable_rate_base: z.number().optional(),
  variable_rate_adjustment_formula: z.string().optional(),
  minimum_purchase: z.number(),
  end_date: z.string(),
  billing_cycle: z.enum(["monthly", "quarterly", "annually"]),
  payment_terms: z.number(),
  auto_renewal: z.boolean(),
  termination_notice_days: z.number(),
});