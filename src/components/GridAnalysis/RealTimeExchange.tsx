import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const RealTimeExchange = () => {
  // Mock data - in a real app, this would come from real-time API
  const realtimeData = [
    { time: "00:00", power: 120 },
    { time: "00:01", power: 132 },
    { time: "00:02", power: 145 },
    { time: "00:03", power: 160 },
    { time: "00:04", power: 155 },
    { time: "00:05", power: 148 },
  ];

  const gridMetrics = {
    voltage: 230,
    frequency: 50.01,
    exportCapacity: 500,
    currentExport: 400,
  };

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Real-Time Power Exchange</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={realtimeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="power"
                stroke="#3b82f6"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Grid Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Voltage</span>
                <span>{gridMetrics.voltage} V</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Frequency</span>
                <span>{gridMetrics.frequency} Hz</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Export Capacity Usage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress 
              value={(gridMetrics.currentExport / gridMetrics.exportCapacity) * 100} 
            />
            <div className="flex justify-between text-sm">
              <span>Current: {gridMetrics.currentExport} kW</span>
              <span>Max: {gridMetrics.exportCapacity} kW</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RealTimeExchange;