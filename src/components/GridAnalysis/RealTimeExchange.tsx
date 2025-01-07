import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Gauge } from "@/components/ui/gauge";
import { Bolt, Wave } from "lucide-react";

const mockData = [
  { time: "00:00", import: 200, export: 50 },
  { time: "00:05", import: 220, export: 45 },
  { time: "00:10", import: 180, export: 60 },
  // ... Add more data points
];

export const RealTimeExchange = () => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Real-Time Power Flow</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="import" stroke="#2563eb" name="Import (kW)" />
              <Line type="monotone" dataKey="export" stroke="#16a34a" name="Export (kW)" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Grid Voltage</CardTitle>
            <Bolt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">230.5 V</div>
            <p className="text-xs text-muted-foreground">Nominal: 230V ±10%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Grid Frequency</CardTitle>
            <Wave className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">50.2 Hz</div>
            <p className="text-xs text-muted-foreground">Nominal: 50Hz ±0.2Hz</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Export Capacity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">40%</div>
            <p className="text-xs text-muted-foreground">200/500 kW limit</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};