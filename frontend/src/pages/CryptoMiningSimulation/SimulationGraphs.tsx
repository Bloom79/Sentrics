import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface TimeSeriesPoint {
  timestamp: string;
  generation: number;
  usage: number;
  backup: number;
}

interface FinancialPoint {
  timestamp: string;
  revenue: number;
  costs: number;
  profit: number;
}

interface ROIPoint {
  timestamp: string;
  investment: number;
  returns: number;
  breakeven: number;
}

interface SimulationGraphsProps {
  data: {
    timeSeriesData: {
      energyData: TimeSeriesPoint[];
      financialData: FinancialPoint[];
      roiData: ROIPoint[];
    };
  };
}

export function SimulationGraphs({ data }: SimulationGraphsProps) {
  if (!data?.timeSeriesData) return null;

  const { energyData, financialData, roiData } = data.timeSeriesData;

  const formatCurrency = (value: number) => `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  const formatEnergy = (value: number) => `${value.toLocaleString(undefined, { maximumFractionDigits: 1 })} kWh`;
  const formatDate = (value: string) => new Date(value).toLocaleDateString();

  const CustomTick = (props: any) => {
    const { x, y, payload } = props;
    return (
      <g transform={`translate(${x},${y})`}>
        <text 
          x={0} 
          y={0} 
          dy={16} 
          textAnchor="end" 
          fill="#666"
          transform="rotate(-45)"
        >
          {formatDate(payload.value)}
        </text>
      </g>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Energy Usage Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={energyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="timestamp" 
                  tickFormatter={formatDate}
                  tick={CustomTick}
                  height={60}
                />
                <YAxis tickFormatter={formatEnergy} width={100} />
                <Tooltip 
                  formatter={(value: number) => formatEnergy(value)}
                  labelFormatter={formatDate}
                />
                <Legend />
                <Line type="monotone" dataKey="generation" name="Generation" stroke="#10b981" />
                <Line type="monotone" dataKey="usage" name="Usage" stroke="#3b82f6" />
                <Line type="monotone" dataKey="backup" name="Backup Needed" stroke="#ef4444" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Financial Performance Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={financialData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="timestamp" 
                  tickFormatter={formatDate}
                  tick={CustomTick}
                  height={60}
                />
                <YAxis tickFormatter={formatCurrency} width={100} />
                <Tooltip 
                  formatter={(value: number) => formatCurrency(value)}
                  labelFormatter={formatDate}
                />
                <Legend />
                <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#10b981" />
                <Line type="monotone" dataKey="costs" name="Costs" stroke="#ef4444" />
                <Line type="monotone" dataKey="profit" name="Profit" stroke="#3b82f6" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>ROI Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={roiData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="timestamp" 
                  tickFormatter={formatDate}
                  tick={CustomTick}
                  height={60}
                />
                <YAxis tickFormatter={formatCurrency} width={100} />
                <Tooltip 
                  formatter={(value: number) => formatCurrency(value)}
                  labelFormatter={formatDate}
                />
                <Legend />
                <Line type="monotone" dataKey="investment" name="Initial Investment" stroke="#ef4444" />
                <Line type="monotone" dataKey="returns" name="Cumulative Returns" stroke="#10b981" />
                <Line type="monotone" dataKey="breakeven" name="Break-even Point" stroke="#3b82f6" strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            <ul className="list-disc list-inside space-y-1">
              <li>Initial Investment: Total cost of hardware, setup, and infrastructure</li>
              <li>Cumulative Returns: Total revenue accumulated over time</li>
              <li>Break-even Point: The investment amount that needs to be recovered</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 