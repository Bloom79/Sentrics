export interface ConsumerSpecs {
  dailyUsage: number;
  peakDemand: number;
  powerFactor: number;
  connectionType: string;
}

export interface Consumer {
  id: string;
  name: string;
  full_name: string;
  type: string;
  status: string;
  created_at: string;
  specs: ConsumerSpecs;
  
  // Contact Information
  contact_person?: string;
  phone?: string;
  email?: string;
  vat_number?: string;
  
  // Location Information
  address?: string;
  city?: string;
  postal_code?: string;
  country?: string;
  
  // Additional Information
  notes?: string;
}