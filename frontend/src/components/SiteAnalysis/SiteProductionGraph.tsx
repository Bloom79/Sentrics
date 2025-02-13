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

// Updated mock data to include split consumption
const data = [
  { 
    time: "00:00", 
    solar: 0, 
    wind: 50, 
    directConsumption: 120,
    gridDelivery: 80,
    storage: -150 
  },
  { 
    time: "04:00", 
    solar: 0, 
    wind: 150, 
    directConsumption: 100,
    gridDelivery: 80,
    storage: -30 
  },
  { 
    time: "08:00", 
    solar: 200, 
    wind: 100, 
    directConsumption: 150,
    gridDelivery: 100,
    storage: 50 
  },
  { 
    time: "12:00", 
    solar: 400, 
    wind: 80, 
    directConsumption: 180,
    gridDelivery: 120,
    storage: 180 
  },
  { 
    time: "16:00", 
    solar: 300, 
    wind: 120, 
    directConsumption: 160,
    gridDelivery: 120,
    storage: 140 
  },
  { 
    time: "20:00", 
    solar: 50, 
    wind: 180, 
    directConsumption: 140,
    gridDelivery: 80,
    storage: 10 
  },
  { 
    time: "23:59", 
    solar: 0, 
    wind: 140, 
    directConsumption: 110,
    gridDelivery: 80,
    storage: -50 
  },
];

interface SiteProductionGraphProps {
  siteId: string;
}

const SiteProductionGraph = ({ siteId }: SiteProductionGraphProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Production, Consumption & Storage</CardTitle>
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
                dataKey="directConsumption"
                stroke="#ef4444"
                strokeWidth={2}
                name="Direct Consumption"
              />
              <Line
                type="monotone"
                dataKey="gridDelivery"
                stroke="#dc2626"
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Grid Delivery (Terna)"
              />
              <Line
                type="monotone"
                dataKey="storage"
                stroke="#10b981"
                strokeWidth={2}
                name="Storage"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default SiteProductionGraph;