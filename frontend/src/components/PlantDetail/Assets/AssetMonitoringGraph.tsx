import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Asset, AssetMonitoring } from "@/types/site";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface AssetMonitoringGraphProps {
  asset: Asset;
  monitoringData?: AssetMonitoring[];
}

export const AssetMonitoringGraph = ({ asset, monitoringData = [] }: AssetMonitoringGraphProps) => {
  const data = monitoringData.map(record => ({
    timestamp: new Date(record.timestamp).toLocaleTimeString(),
    value: record.value,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Monitoring</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#2563eb" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};