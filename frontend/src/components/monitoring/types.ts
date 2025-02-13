import { SimulationMetrics } from '@/lib/api/cer';
import { DateRange } from 'react-day-picker';

export interface ChartData {
  timestamp: string;
  production: number;
  consumption: number;
  grid_feed_in: number;
  grid_consumption: number;
  shared_energy: number;
  self_consumption: number;
  analysis?: {
    efficiency: number;
    grid_dependency: number;
  };
  participant_metrics?: Array<{
    name: string;
    type: string;
    production: number;
    consumption: number;
  }>;
  conditions?: string;
  temperature?: number;
  production_impact?: number;
  solar_irradiance?: number;
}

export interface YAxisRange {
  min: number;
  max: number;
}

export interface MonitoringProps {
  configurationId: string;
  location: {
    lat: number;
    lng: number;
  };
}

export interface ChartProps {
  data: ChartData[];
  dateRange: DateRange | null;
  yAxisRanges: YAxisRange;
} 