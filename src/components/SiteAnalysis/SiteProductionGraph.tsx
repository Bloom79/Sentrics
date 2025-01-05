import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// Mock data - replace with actual API call
const data = [
  { time: "00:00", solar: 0, wind: 50, consumption: 200 },
  { time: "04:00", solar: 0, wind: 150, consumption: 180 },
  { time: "08:00", solar: 200, wind: 100, consumption: 250 },
  { time: "12:00", solar: 400, wind: 80, consumption: 300 },
  { time: "16:00", solar: 300, wind: 120, consumption: 280 },
  { time: "20:00", solar: 50, wind: 180, consumption: 220 },
  { time: "23:59", solar: 0, wind: 140, consumption: 190 },
];

interface SiteProductionGraphProps {
  siteId: string;
}

const SiteProductionGraph = ({ siteId }: SiteProductionGraphProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Production vs. Consumption</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="solar"
                stroke="#f59e0b"
                strokeWidth={2}
                name="Solar"
              />
              <Line
                type="monotone"
                dataKey="wind"
                stroke="#3b82f6"
                strokeWidth={2}
                name="Wind"
              />
              <Line
                type="monotone"
                dataKey="consumption"
                stroke="#ef4444"
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

export default SiteProductionGraph;