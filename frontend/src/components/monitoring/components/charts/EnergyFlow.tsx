import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { EnergyFlowDiagram } from '@/components/energy-flow';
import { ChartProps } from '../../types';
import { EfficiencyMetrics } from '../metrics/EfficiencyMetrics';

export function EnergyFlowCharts({ data }: ChartProps) {
  // Use the most recent data point for the flow diagram
  const currentMetrics = data[data.length - 1] || {
    production: 0,
    consumption: 0,
    grid_feed_in: 0,
    grid_consumption: 0,
    self_consumption: 0,
    shared_energy: 0
  };

  return (
    <>
      {/* Flow Diagram */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Energy Flow Diagram</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px]">
          <EnergyFlowDiagram data={currentMetrics} />
        </CardContent>
      </Card>

      {/* Metrics Panel */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Key Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <EfficiencyMetrics data={data} />
          </CardContent>
        </Card>
      </div>
    </>
  );
} 