export type ContractStatus = 'active' | 'pending' | 'expired';

export interface Contract {
  id: string;
  consumer_id: string;
  start_date: string;
  end_date: string;
  rate: number;
  minimum_purchase: number;
  status: ContractStatus;
  created_at: string;
  updated_at: string;
}