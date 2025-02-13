import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SunIcon, HomeIcon, BatteryIcon, PowerIcon } from 'lucide-react';

interface EnergyFlowProps {
  data: {
    production: number;
    consumption: number;
    grid_feed_in: number;
    grid_consumption: number;
    self_consumption: number;
    shared_energy: number;
  };
}

export function EnergyFlowDiagram({ data }: EnergyFlowProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Energy Flow</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative h-[400px] w-full">
          {/* Production Node */}
          <div className="absolute top-0 left-1/4 transform -translate-x-1/2">
            <div className="flex flex-col items-center">
              <div className="rounded-full bg-blue-100 p-4">
                <SunIcon className="w-8 h-8 text-blue-600" />
              </div>
              <span className="mt-2 font-semibold">Production</span>
              <span className="text-lg">{data.production.toFixed(2)} kW</span>
            </div>
          </div>

          {/* Consumption Node */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
            <div className="flex flex-col items-center">
              <div className="rounded-full bg-red-100 p-4">
                <HomeIcon className="w-8 h-8 text-red-600" />
              </div>
              <span className="mt-2 font-semibold">Consumption</span>
              <span className="text-lg">{data.consumption.toFixed(2)} kW</span>
            </div>
          </div>

          {/* Grid Node */}
          <div className="absolute top-0 right-1/4 transform translate-x-1/2">
            <div className="flex flex-col items-center">
              <div className="rounded-full bg-yellow-100 p-4">
                <PowerIcon className="w-8 h-8 text-yellow-600" />
              </div>
              <span className="mt-2 font-semibold">Grid</span>
              <div className="text-sm">
                <div>Feed-in: {data.grid_feed_in.toFixed(2)} kW</div>
                <div>Draw: {data.grid_consumption.toFixed(2)} kW</div>
              </div>
            </div>
          </div>

          {/* Storage Node */}
          <div className="absolute bottom-0 right-1/4 transform translate-x-1/2">
            <div className="flex flex-col items-center">
              <div className="rounded-full bg-green-100 p-4">
                <BatteryIcon className="w-8 h-8 text-green-600" />
              </div>
              <span className="mt-2 font-semibold">Storage</span>
              <span className="text-lg">{data.shared_energy.toFixed(2)} kW</span>
            </div>
          </div>

          {/* SVG Flow Lines */}
          <svg
            className="absolute inset-0 w-full h-full"
            style={{ zIndex: -1 }}
          >
            {/* Production to Consumption */}
            <path
              d={`M ${25}% ${10}% L ${50}% ${90}%`}
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              className="text-blue-400"
            />

            {/* Production to Grid */}
            <path
              d={`M ${25}% ${10}% L ${75}% ${10}%`}
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              className="text-yellow-400"
            />

            {/* Grid to Consumption */}
            <path
              d={`M ${75}% ${10}% L ${50}% ${90}%`}
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              className="text-red-400"
            />

            {/* Storage Connections */}
            <path
              d={`M ${75}% ${90}% L ${50}% ${90}%`}
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              className="text-green-400"
            />
          </svg>

          {/* Flow Values */}
          <div className="absolute top-1/2 left-1/3 transform -translate-y-1/2">
            <span className="bg-white px-2 py-1 rounded-full text-sm border">
              {data.self_consumption.toFixed(1)} kW
            </span>
          </div>
          <div className="absolute top-1/4 right-1/3 transform -translate-y-1/2">
            <span className="bg-white px-2 py-1 rounded-full text-sm border">
              {data.grid_feed_in.toFixed(1)} kW
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 