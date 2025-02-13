import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { WeatherForecast } from '@/components/weather-forecast';
import { ChartProps } from '../../types';
import { formatTimestamp } from '../../utils';
import { CHART_COLORS } from '../../utils';

interface WeatherImpactProps extends ChartProps {
  location: {
    lat: number;
    lng: number;
  };
}

export function WeatherImpact({ data, dateRange, yAxisRanges, location }: WeatherImpactProps) {
  return (
    <>
      {/* Weather Summary */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Weather Impact Analysis</CardTitle>
          <CardDescription>
            {dateRange?.from 
              ? `Analysis from ${dateRange.from.toLocaleDateString()} to ${dateRange.to?.toLocaleDateString() || 'now'}`
              : 'Next 7 days forecast'
            }
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Weather Forecast Component */}
      <Card className="lg:col-span-2">
        <CardContent className="pt-6">
          <WeatherForecast location={location} dateRange={dateRange} />
        </CardContent>
      </Card>

      {/* Production Impact Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Production Impact</CardTitle>
          <CardDescription>Impact of weather conditions on energy production</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="timestamp" 
                  tickFormatter={(value) => formatTimestamp(value, dateRange)}
                />
                <YAxis 
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  formatter={(value: number) => [`${value.toFixed(1)}%`]}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="production_impact" 
                  stroke={CHART_COLORS.productionImpact}
                  name="Production Impact"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Temperature Correlation */}
      <Card>
        <CardHeader>
          <CardTitle>Temperature vs Production</CardTitle>
          <CardDescription>Correlation between temperature and production efficiency</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="timestamp" 
                  tickFormatter={(value) => formatTimestamp(value, dateRange)}
                />
                <YAxis 
                  yAxisId="temp"
                  orientation="left"
                  tickFormatter={(value) => `${value}°C`}
                />
                <YAxis 
                  yAxisId="production"
                  orientation="right"
                  tickFormatter={(value) => `${value} kW`}
                />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  formatter={(value: number, name: string) => [
                    `${value.toFixed(1)}${name.includes('Temperature') ? '°C' : ' kW'}`,
                    name
                  ]}
                />
                <Legend />
                <Line 
                  yAxisId="temp"
                  type="monotone" 
                  dataKey="temperature" 
                  stroke={CHART_COLORS.temperature}
                  name="Temperature"
                />
                <Line 
                  yAxisId="production"
                  type="monotone" 
                  dataKey="production" 
                  stroke={CHART_COLORS.production}
                  name="Production"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Weather Distribution */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Weather Conditions Distribution</CardTitle>
          <CardDescription>Distribution of weather conditions and their impact on production</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="conditions"
                  tickFormatter={(value) => value.charAt(0).toUpperCase() + value.slice(1)}
                />
                <YAxis 
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip />
                <Legend />
                <Bar 
                  dataKey="production_impact" 
                  fill={CHART_COLORS.productionImpact}
                  name="Production Impact"
                />
                <Bar 
                  dataKey="solar_irradiance" 
                  fill={CHART_COLORS.solarIrradiance}
                  name="Solar Irradiance"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </>
  );
} 