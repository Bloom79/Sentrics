import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSimulation } from '@/hooks/use-simulation';
import { SimulationMetrics, simulationApi } from '@/lib/api/cer';
import { EnergyFlowDiagram } from '@/components/energy-flow';
import { WeatherForecast } from '@/components/weather-forecast';
import { PlayIcon, Square, BarChart3, ChartLineIcon, CalendarDays, Zap, Clock, SunIcon, HomeIcon, BatteryIcon, PowerIcon } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  Area,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";

import { SimulationControls } from './components/SimulationControls';
import { CurrentMetrics } from './components/metrics/CurrentMetrics';
import { OverviewCharts } from './components/charts/Overview';
import { EnergyFlowCharts } from './components/charts/EnergyFlow';
import { DetailedCharts } from './components/charts/DetailedCharts';
import { WeatherImpact } from './components/charts/WeatherImpact';
import { MonitoringProps, ChartData } from './types';
import { filterDataByDateRange, calculateYAxisRanges } from './utils';

// Add new chart components
function YearlyChart({ data, type }: { data: any[], type: 'production' | 'consumption' }) {
  const aggregatedData = data.reduce((acc, item) => {
    const season = item.season;
    if (!acc[season]) {
      acc[season] = {
        season,
        total: 0,
        peak: 0,
        average: 0,
        count: 0
      };
    }
    acc[season].total += item[type];
    acc[season].peak = Math.max(acc[season].peak, item[type]);
    acc[season].average = (acc[season].total / ++acc[season].count);
    return acc;
  }, {});

  const chartData = Object.values(aggregatedData);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Yearly {type.charAt(0).toUpperCase() + type.slice(1)} by Season</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="season" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total" fill="#8884d8" name="Total" />
              <Bar dataKey="peak" fill="#82ca9d" name="Peak" />
              <Bar dataKey="average" fill="#ffc658" name="Average" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

function ParticipantMetrics({ data }: { data: any[] }) {
  const participantData = data.reduce((acc, item) => {
    const metrics = item.participant_metrics || [];
    metrics.forEach((metric: any) => {
      if (!acc[metric.name]) {
        acc[metric.name] = {
          name: metric.name,
          type: metric.type,
          totalProduction: 0,
          totalConsumption: 0,
          peakProduction: 0,
          peakConsumption: 0
        };
      }
      acc[metric.name].totalProduction += metric.production;
      acc[metric.name].totalConsumption += metric.consumption;
      acc[metric.name].peakProduction = Math.max(acc[metric.name].peakProduction, metric.production);
      acc[metric.name].peakConsumption = Math.max(acc[metric.name].peakConsumption, metric.consumption);
    });
    return acc;
  }, {});

  return (
    <Card>
      <CardHeader>
        <CardTitle>Participant Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={Object.values(participantData)} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" />
              <Tooltip />
              <Legend />
              <Bar dataKey="totalProduction" fill="#8884d8" name="Total Production" />
              <Bar dataKey="totalConsumption" fill="#82ca9d" name="Total Consumption" />
              <Bar dataKey="peakProduction" fill="#ffc658" name="Peak Production" />
              <Bar dataKey="peakConsumption" fill="#ff8042" name="Peak Consumption" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

function DailyPatterns({ data }: { data: any[] }) {
  const hourlyData = Array.from({ length: 24 }, (_, hour) => {
    const hourMetrics = data.filter(item => new Date(item.timestamp).getHours() === hour);
    return {
      hour: `${hour}:00`,
      avgProduction: hourMetrics.reduce((sum, item) => sum + item.production, 0) / Math.max(1, hourMetrics.length),
      avgConsumption: hourMetrics.reduce((sum, item) => sum + item.consumption, 0) / Math.max(1, hourMetrics.length),
      peakProduction: Math.max(...hourMetrics.map(item => item.production)),
      peakConsumption: Math.max(...hourMetrics.map(item => item.consumption))
    };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Energy Patterns</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={hourlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="avgProduction" stroke="#8884d8" name="Avg Production" />
              <Line type="monotone" dataKey="avgConsumption" stroke="#82ca9d" name="Avg Consumption" />
              <Line type="monotone" dataKey="peakProduction" stroke="#ffc658" name="Peak Production" strokeDasharray="5 5" />
              <Line type="monotone" dataKey="peakConsumption" stroke="#ff8042" name="Peak Consumption" strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

function EfficiencyMetrics({ data }: { data: any[] }) {
  const metrics = data.reduce((acc, item) => {
    const analysis = item.analysis || {};
    return {
      efficiency: (acc.efficiency || 0) + (analysis.efficiency || 0),
      gridDependency: (acc.gridDependency || 0) + (analysis.grid_dependency || 0),
      count: acc.count + 1
    };
  }, { efficiency: 0, gridDependency: 0, count: 0 });

  const avgEfficiency = metrics.efficiency / metrics.count;
  const avgGridDependency = metrics.gridDependency / metrics.count;

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Efficiency</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Self-Consumption Efficiency</span>
              <span className="text-sm font-medium">{avgEfficiency.toFixed(1)}%</span>
            </div>
            <Progress value={avgEfficiency} className="h-2 bg-blue-100" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Grid Dependency</span>
              <span className="text-sm font-medium">{avgGridDependency.toFixed(1)}%</span>
            </div>
            <Progress value={avgGridDependency} className="h-2 bg-yellow-100" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function Monitoring({ configurationId, location }: MonitoringProps) {
  const { toast } = useToast();
  const [metrics, setMetrics] = useState<SimulationMetrics>({
    production: 0,
    consumption: 0,
    grid_feed_in: 0,
    grid_consumption: 0,
    self_consumption: 0,
    shared_energy: 0
  });
  const [progress, setProgress] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState('');
  const [historicalData, setHistoricalData] = useState<ChartData[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | null>(null);

  const {
    isRunning,
    simulationType,
    startSimulation,
    stopSimulation
  } = useSimulation({
    configurationId,
    config: {
      duration_days: 365,
      simulation_type: 'real',
      include_weather: true,
      include_historical_data: true,
      time_scale: 2.0,
      batch_size: 24
    },
    onMetricsUpdate: (newMetrics) => {
      setMetrics(newMetrics);
      setHistoricalData(prev => {
        const newData = [...prev, { timestamp: new Date().toISOString(), ...newMetrics }];
        return newData.slice(-24);
      });
    },
    onError: (error) => {
      toast({
        title: 'Simulation Error',
        description: error.message,
        variant: 'destructive'
      });
    },
    onProgress: (newProgress, remaining) => {
      setProgress(newProgress);
      setTimeRemaining(remaining);
    }
  });

  const handleStartQuick = () => {
    resetMetrics();
    startSimulation('quick');
  };

  const handleStartReal = () => {
    resetMetrics();
    startSimulation('real');
  };

  const resetMetrics = () => {
    setMetrics({
      production: 0,
      consumption: 0,
      grid_feed_in: 0,
      grid_consumption: 0,
      self_consumption: 0,
      shared_energy: 0
    });
    setHistoricalData([]);
  };

  // Filter data and calculate ranges based on date range
  const filteredData = useMemo(() => 
    filterDataByDateRange(historicalData, dateRange),
    [historicalData, dateRange]
  );

  const yAxisRanges = useMemo(() => 
    calculateYAxisRanges(filteredData),
    [filteredData]
  );

  return (
    <div className="space-y-4">
      <SimulationControls
        isRunning={isRunning}
        progress={progress}
        timeRemaining={timeRemaining}
        simulationType={simulationType}
        onStartQuick={handleStartQuick}
        onStartReal={handleStartReal}
        onStop={stopSimulation}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
      />

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="energy-flow">Energy Flow</TabsTrigger>
          <TabsTrigger value="charts">Detailed Charts</TabsTrigger>
          <TabsTrigger value="weather">Weather Impact</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <CurrentMetrics metrics={metrics} />
            <OverviewCharts
              data={filteredData}
              dateRange={dateRange}
              yAxisRanges={yAxisRanges}
            />
          </div>
        </TabsContent>

        {/* Energy Flow Tab */}
        <TabsContent value="energy-flow">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <EnergyFlowCharts
              data={filteredData}
              dateRange={dateRange}
              yAxisRanges={yAxisRanges}
            />
          </div>
        </TabsContent>

        {/* Detailed Charts Tab */}
        <TabsContent value="charts">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <DetailedCharts
              data={filteredData}
              dateRange={dateRange}
              yAxisRanges={yAxisRanges}
            />
          </div>
        </TabsContent>

        {/* Weather Impact Tab */}
        <TabsContent value="weather">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <WeatherImpact
              data={filteredData}
              dateRange={dateRange}
              yAxisRanges={yAxisRanges}
              location={location}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 