import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { LineChart as LineChartIcon } from "lucide-react";

interface HistoricalPerformanceProps {
  siteId: string;
}

const HistoricalPerformance = ({ siteId }: HistoricalPerformanceProps) => {
  // Mock data - replace with actual historical data
  const data = [
    { date: "2024-01-01", production: 450, consumption: 380 },
    { date: "2024-01-02", production: 420, consumption: 360 },
    { date: "2024-01-03", production: 480, consumption: 400 },
    { date: "2024-01-04", production: 460, consumption: 390 },
    { date: "2024-01-05", production: 440, consumption: 370 },
    { date: "2024-01-06", production: 500, consumption: 420 },
    { date: "2024-01-07", production: 470, consumption: 400 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LineChartIcon className="h-5 w-5" />
          Historical Performance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="production"
                stroke="#10b981"
                strokeWidth={2}
                name="Production"
              />
              <Line
                type="monotone"
                dataKey="consumption"
                stroke="#f59e0b"
                strokeWidth={2}
                name="Consumption"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default HistoricalPerformance;