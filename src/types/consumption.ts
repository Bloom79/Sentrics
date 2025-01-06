export interface ConsumptionFile {
  id: string;
  consumer_id: string;
  filename: string;
  file_path: string;
  upload_date: string;
  content_type: string | null;
  file_size: number | null;
  file_type: 'contract' | 'actual' | 'forecast' | 'other';
}

export const FILE_TYPES = {
  contract: "Contract Consumption",
  actual: "Actual Consumption",
  forecast: "Consumption Forecast",
  other: "Other"
} as const;