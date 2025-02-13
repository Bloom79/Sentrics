export type ContractStatus = 'active' | 'pending' | 'expired';
export type ContractType = 'fixed_rate' | 'variable_rate' | 'peak_off_peak';
export type BillingCycle = 'monthly' | 'quarterly' | 'annually';

export interface Contract {
  id: string;
  consumer_id: string;
  type: ContractType;
  rate?: number;
  peak_rate?: number;
  off_peak_rate?: number;
  variable_rate_base?: number;
  variable_rate_adjustment_formula?: string;
  start_date: string;
  end_date: string;
  minimum_purchase: number;
  status: ContractStatus;
  billing_cycle: BillingCycle;
  payment_terms: number;
  auto_renewal: boolean;
  termination_notice_days: number;
  penalties_for_breach?: string;
  created_at: string;
  updated_at: string;
}