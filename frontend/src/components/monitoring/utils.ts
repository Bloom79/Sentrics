import { ChartData, YAxisRange } from './types';
import { DateRange } from 'react-day-picker';

export function filterDataByDateRange(data: ChartData[], dateRange: DateRange | null): ChartData[] {
  if (!dateRange?.from || !data.length) return data;
  
  return data.filter(d => {
    const date = new Date(d.timestamp);
    if (dateRange.to) {
      return date >= dateRange.from && date <= dateRange.to;
    }
    return date >= dateRange.from;
  });
}

export function calculateYAxisRanges(data: ChartData[]): YAxisRange {
  if (!data.length) return { min: 0, max: 100 };
  
  const values = data.flatMap(d => [
    d.production,
    d.consumption,
    d.grid_feed_in,
    d.grid_consumption,
    d.shared_energy
  ]);
  
  const min = Math.floor(Math.min(...values) * 0.9); // Add 10% padding
  const max = Math.ceil(Math.max(...values) * 1.1);
  
  return { min, max };
}

export function formatTimestamp(value: string, dateRange: DateRange | null): string {
  const date = new Date(value);
  return dateRange?.from
    ? date.toLocaleDateString()
    : date.toLocaleTimeString();
}

export function calculateEnergyDistribution(data: ChartData) {
  return [
    { name: 'Self Consumption', value: data.shared_energy || 0 },
    { name: 'Grid Feed-in', value: data.grid_feed_in || 0 },
    { name: 'Grid Consumption', value: data.grid_consumption || 0 },
    { name: 'Shared Energy', value: data.shared_energy || 0 }
  ].filter(item => item.value > 0);
}

export const CHART_COLORS = {
  production: '#8884d8',
  consumption: '#82ca9d',
  gridFeedIn: '#ffc658',
  gridConsumption: '#ff7300',
  sharedEnergy: '#00C49F',
  temperature: '#ff7300',
  solarIrradiance: '#82ca9d',
  productionImpact: '#8884d8'
}; 