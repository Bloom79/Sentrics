export type ConsumerType = 'residential' | 'commercial' | 'industrial';
export type ConsumerStatus = 'active' | 'inactive' | 'pending';

export interface ConsumerSpecs {
  peakDemand: number;
  dailyUsage: number;
  powerFactor: number;
  connectionType: 'low-voltage' | 'medium-voltage' | 'high-voltage';
}

export interface Consumer {
  id: string;
  full_name: string;
  type: ConsumerType;
  consumption: number;
  status: ConsumerStatus;
  specs: ConsumerSpecs;
  address?: string;
  city?: string;
  postal_code?: string;
  country?: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  vat_number?: string;
  notes?: string;
}
