import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { SunIcon, HomeIcon, PowerIcon, BatteryIcon } from 'lucide-react';
import { SimulationMetrics } from '@/lib/api/cer';

interface CurrentMetricsProps {
  metrics: SimulationMetrics;
}

export function CurrentMetrics({ metrics }: CurrentMetricsProps) {
  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Current Energy Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <SunIcon className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium">Production</span>
            </div>
            <p className="text-2xl font-bold">{metrics.production.toFixed(1)} kW</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <HomeIcon className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium">Consumption</span>
            </div>
            <p className="text-2xl font-bold">{metrics.consumption.toFixed(1)} kW</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <PowerIcon className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium">Self-Consumption</span>
            </div>
            <p className="text-2xl font-bold">
              {metrics.production > 0 
                ? ((metrics.self_consumption / metrics.production) * 100).toFixed(1)
                : '0.0'}%
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <BatteryIcon className="w-4 h-4 text-purple-500" />
              <span className="text-sm font-medium">Shared Energy</span>
            </div>
            <p className="text-2xl font-bold">{metrics.shared_energy.toFixed(1)} kW</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 