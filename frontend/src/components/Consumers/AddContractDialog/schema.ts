import { z } from "zod";

export const contractSchema = z.object({
  type: z.enum(["fixed_rate", "variable_rate", "peak_off_peak"]),
  rate: z.number().min(0).optional(),
  peak_rate: z.number().min(0).optional(),
  off_peak_rate: z.number().min(0).optional(),
  variable_rate_base: z.number().min(0).optional(),
  variable_rate_adjustment_formula: z.string().optional(),
  start_date: z.string(),
  end_date: z.string(),
  minimum_purchase: z.number().min(0),
  billing_cycle: z.enum(["monthly", "quarterly", "annually"]),
  payment_terms: z.number().min(1),
  auto_renewal: z.boolean(),
  termination_notice_days: z.number().min(1),
  penalties_for_breach: z.string().optional(),
});

export type ContractFormValues = z.infer<typeof contractSchema>;