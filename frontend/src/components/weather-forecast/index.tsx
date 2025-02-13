import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { api } from '@/lib/api';
import { CloudSunIcon, CloudRainIcon, SunIcon, ThermometerIcon, DropletIcon, WindIcon } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { DateRange } from 'react-day-picker';
import { useMemo } from 'react';
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

interface WeatherForecastProps {
  location: {
    lat: number;
    lng: number;
  };
  dateRange?: DateRange | null;
}

interface WeatherData {
  date: string;
  temperature: number;
  conditions: string;
  production_impact: number;
  precipitation: number;
  wind_speed: number;
  solar_irradiance: number;
  cloud_cover: number;
  humidity: number;
  forecast_description: string;
}

function getImpactColor(impact: number): string {
  if (impact > 10) return 'text-green-500';
  if (impact > 0) return 'text-green-400';
  if (impact > -20) return 'text-yellow-500';
  if (impact > -50) return 'text-orange-500';
  return 'text-red-500';
}

function getImpactBadge(impact: number): JSX.Element {
  let variant: 'default' | 'success' | 'warning' | 'destructive' = 'default';
  let label = '';

  if (impact > 10) {
    variant = 'success';
    label = 'Excellent';
  } else if (impact > 0) {
    variant = 'success';
    label = 'Good';
  } else if (impact > -20) {
    variant = 'warning';
    label = 'Moderate';
  } else if (impact > -50) {
    variant = 'warning';
    label = 'Poor';
  } else {
    variant = 'destructive';
    label = 'Very Poor';
  }

  return <Badge variant={variant}>{label}</Badge>;
}

function getWeatherIcon(conditions: string) {
  switch (conditions.toLowerCase()) {
    case 'rain':
    case 'cloudy':
      return <CloudRainIcon className="w-8 h-8 text-blue-500" />;
    case 'partly_cloudy':
      return <CloudSunIcon className="w-8 h-8 text-yellow-500" />;
    default:
      return <SunIcon className="w-8 h-8 text-yellow-500" />;
  }
}

export function WeatherForecast({ location, dateRange }: WeatherForecastProps) {
  // Always call useQuery hook
  const { data, isLoading, error } = useQuery({
    queryKey: ['weather', location, dateRange],
    queryFn: async () => {
      const response = await api.get<WeatherData[]>('/api/cer/weather/forecast', {
        params: {
          ...location,
          start_date: dateRange?.from?.toISOString(),
          end_date: dateRange?.to?.toISOString()
        },
      });
      return response.data;
    },
    enabled: Boolean(location.lat && location.lng),
  });

  // Always calculate filtered data
  const filteredData = useMemo(() => {
    if (!data) return [];
    return dateRange?.from
      ? data.filter(day => {
          const date = new Date(day.date);
          if (dateRange.to) {
            return date >= dateRange.from && date <= dateRange.to;
          }
          return date >= dateRange.from;
        })
      : data;
  }, [data, dateRange]);

  // Always calculate statistics
  const stats = useMemo(() => {
    if (!filteredData.length) return null;

    const impacts = filteredData.map(d => d.production_impact);
    return {
      average: impacts.reduce((a, b) => a + b, 0) / impacts.length,
      max: Math.max(...impacts),
      min: Math.min(...impacts),
      bestDay: filteredData.reduce((a, b) => a.production_impact > b.production_impact ? a : b),
      worstDay: filteredData.reduce((a, b) => a.production_impact < b.production_impact ? a : b),
      daysAboveZero: impacts.filter(i => i > 0).length,
      totalDays: impacts.length
    };
  }, [filteredData]);

  // Always calculate weekly data
  const weeklyData = useMemo(() => {
    if (!filteredData.length) return [];
    
    const weeks: { [key: string]: any[] } = {};
    filteredData.forEach(day => {
      const date = new Date(day.date);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      const weekKey = weekStart.toISOString().split('T')[0];
      
      if (!weeks[weekKey]) {
        weeks[weekKey] = [];
      }
      weeks[weekKey].push(day);
    });

    return Object.entries(weeks).map(([week, days]) => ({
      week,
      avgImpact: days.reduce((sum, d) => sum + d.production_impact, 0) / days.length,
      avgTemp: days.reduce((sum, d) => sum + d.temperature, 0) / days.length,
      sunnyDays: days.filter(d => d.conditions === 'sunny').length,
      rainyDays: days.filter(d => d.conditions === 'rain').length
    }));
  }, [filteredData]);

  // Always calculate range type
  const isLongRange = useMemo(() => filteredData.length > 14, [filteredData]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Weather & Production Impact</CardTitle>
          <CardDescription>Loading weather data...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Weather & Production Impact</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertDescription>
              Failed to load weather forecast. Please try again later.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle>Production Impact Summary</CardTitle>
          <CardDescription>
            {dateRange?.from 
              ? `Analysis from ${dateRange.from.toLocaleDateString()} to ${dateRange.to?.toLocaleDateString() || 'now'}`
              : 'Next 7 days forecast'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {stats && (
            <div className="space-y-6">
              {/* Overall Statistics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <span className="text-sm font-medium">Average Impact</span>
                  <p className={`text-2xl font-bold ${getImpactColor(stats.average)}`}>
                    {stats.average > 0 ? '+' : ''}{stats.average.toFixed(1)}%
                  </p>
                </div>
                <div className="space-y-2">
                  <span className="text-sm font-medium">Favorable Days</span>
                  <p className="text-2xl font-bold text-green-500">
                    {stats.daysAboveZero}/{stats.totalDays}
                  </p>
                </div>
                <div className="space-y-2">
                  <span className="text-sm font-medium">Best Impact</span>
                  <p className="text-2xl font-bold text-green-500">
                    +{stats.max.toFixed(1)}%
                  </p>
                </div>
                <div className="space-y-2">
                  <span className="text-sm font-medium">Worst Impact</span>
                  <p className="text-2xl font-bold text-red-500">
                    {stats.min.toFixed(1)}%
                  </p>
                </div>
              </div>

              {/* Impact Trend Chart */}
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={isLongRange ? weeklyData : filteredData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey={isLongRange ? "week" : "date"} 
                      tickFormatter={(value) => {
                        const date = new Date(value);
                        return isLongRange 
                          ? `Week of ${date.toLocaleDateString()}`
                          : date.toLocaleDateString();
                      }}
                    />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: number) => `${value.toFixed(1)}%`}
                      labelFormatter={(label) => {
                        const date = new Date(label);
                        return isLongRange 
                          ? `Week of ${date.toLocaleDateString()}`
                          : date.toLocaleDateString();
                      }}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey={isLongRange ? "avgImpact" : "production_impact"}
                      name="Production Impact"
                      stroke="#8884d8"
                      fill="#8884d8"
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Daily Forecast Cards - Show only for short ranges */}
      {!isLongRange && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredData.map((day) => (
            <Card key={day.date} className="relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4">
                {getImpactBadge(day.production_impact)}
              </div>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {getWeatherIcon(day.conditions)}
                  <div>
                    {new Date(day.date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <ThermometerIcon className="w-4 h-4 text-gray-500" />
                    <span>{day.temperature}°C</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DropletIcon className="w-4 h-4 text-blue-500" />
                    <span>{day.humidity}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <WindIcon className="w-4 h-4 text-gray-500" />
                    <span>{day.wind_speed} m/s</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <SunIcon className="w-4 h-4 text-yellow-500" />
                    <span>{day.solar_irradiance} W/m²</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Production Impact</span>
                    <span className={`text-sm font-medium ${getImpactColor(day.production_impact)}`}>
                      {day.production_impact > 0 ? '+' : ''}{day.production_impact}%
                    </span>
                  </div>
                  <Progress 
                    value={50 + (day.production_impact / 2)} 
                    className="h-2"
                  />
                </div>

                <p className="text-sm text-muted-foreground mt-2">
                  {day.forecast_description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Weekly Analysis - Show only for long ranges */}
      {isLongRange && (
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Weather Patterns</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="week"
                      tickFormatter={(value) => {
                        const date = new Date(value);
                        return date.toLocaleDateString();
                      }}
                    />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="avgTemp"
                      name="Avg Temperature (°C)"
                      stroke="#ff7300"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="sunnyDays"
                      name="Sunny Days"
                      stroke="#8884d8"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
} 