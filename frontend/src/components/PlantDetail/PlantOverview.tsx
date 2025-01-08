import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plant } from "@/types/site";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Battery, Sun, Wind, Gauge, Calendar, Leaf, Zap, Activity, Cpu } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface PlantOverviewProps {
  plant: Plant;
}

const generateMockData = () => {
  return Array.from({ length: 24 }, (_, i) => ({
    time: `${i}:00`,
    output: Math.random() * 100,
  }));
};

const PlantOverview: React.FC<PlantOverviewProps> = ({ plant }) => {
  const data = generateMockData();
  const lastUpdate = plant.lastUpdate ? new Date(plant.lastUpdate) : new Date();

  const getPlantTypeIcon = () => {
    return plant.type === "solar" ? (
      <Sun className="h-4 w-4 text-yellow-500" />
    ) : (
      <Wind className="h-4 w-4 text-blue-500" />
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Output</CardTitle>
            <Zap className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{plant.currentOutput} kW</div>
            <p className="text-xs text-muted-foreground">
              {((plant.currentOutput / plant.capacity) * 100).toFixed(1)}% of capacity
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Plant Type</CardTitle>
            {getPlantTypeIcon()}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{plant.type}</div>
            <p className="text-xs text-muted-foreground">
              Total Capacity: {plant.capacity} kW
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance</CardTitle>
            <Activity className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{plant.efficiency}%</div>
            <p className="text-xs text-muted-foreground">
              Operating Efficiency
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            <Cpu className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{plant.status}</div>
            <p className="text-xs text-muted-foreground">
              Last Update: {formatDistanceToNow(lastUpdate, { addSuffix: true })}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Output Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="outputGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="output"
                  stroke="#3b82f6"
                  fillOpacity={1}
                  fill="url(#outputGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlantOverview;