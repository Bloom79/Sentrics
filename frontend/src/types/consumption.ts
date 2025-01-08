export interface ConsumptionData {
  id: string;
  consumer_id: string;
  pod_id?: string;
  timestamp: string;
  value: number;
  granularity: string;
  created_at?: string;
}

export type ConsumptionGranularity = 'hourly' | 'daily' | 'monthly' | 'yearly';