import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { ChartProps } from '../../types';
import { formatTimestamp } from '../../utils';
import { CHART_COLORS } from '../../utils';

export function DetailedCharts({ data, dateRange, yAxisRanges }: ChartProps) {
  return (
    <>
      {/* Production vs Consumption */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Production vs Consumption</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="timestamp" 
                  tickFormatter={(value) => formatTimestamp(value, dateRange)}
                  interval={dateRange ? 'preserveEnd' : 0}
                />
                <YAxis 
                  domain={[yAxisRanges.min, yAxisRanges.max]}
                  tickFormatter={(value) => `${value} kW`}
                />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleString()}
                  formatter={(value: number) => [`${value.toFixed(1)} kW`]}
                />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="production" 
                  stackId="1"
                  stroke={CHART_COLORS.production}
                  fill={CHART_COLORS.production}
                  name="Production"
                />
                <Area 
                  type="monotone" 
                  dataKey="consumption" 
                  stackId="2"
                  stroke={CHART_COLORS.consumption}
                  fill={CHART_COLORS.consumption}
                  name="Consumption"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Grid Feed-in */}
      <Card>
        <CardHeader>
          <CardTitle>Grid Feed-in</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="timestamp" 
                  tickFormatter={(value) => formatTimestamp(value, dateRange)}
                  interval={dateRange ? 'preserveEnd' : 0}
                />
                <YAxis 
                  domain={[yAxisRanges.min, yAxisRanges.max]}
                  tickFormatter={(value) => `${value} kW`}
                />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleString()}
                  formatter={(value: number) => [`${value.toFixed(1)} kW`]}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="grid_feed_in" 
                  stroke={CHART_COLORS.gridFeedIn}
                  name="Grid Feed-in"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Grid Consumption */}
      <Card>
        <CardHeader>
          <CardTitle>Grid Consumption</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="timestamp" 
                  tickFormatter={(value) => formatTimestamp(value, dateRange)}
                  interval={dateRange ? 'preserveEnd' : 0}
                />
                <YAxis 
                  domain={[yAxisRanges.min, yAxisRanges.max]}
                  tickFormatter={(value) => `${value} kW`}
                />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleString()}
                  formatter={(value: number) => [`${value.toFixed(1)} kW`]}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="grid_consumption" 
                  stroke={CHART_COLORS.gridConsumption}
                  name="Grid Consumption"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </>
  );
} 