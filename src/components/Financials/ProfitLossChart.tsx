import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TimeRange } from "@/types/flowComponents";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface ProfitLossChartProps {
  timeRange: TimeRange;
}

const ProfitLossChart = ({ timeRange }: ProfitLossChartProps) => {
  // Mock data - in a real app, this would come from an API
  const data = [
    { name: "Jan", revenue: 4000, expenses: 2400, profit: 1600 },
    { name: "Feb", revenue: 3000, expenses: 1398, profit: 1602 },
    { name: "Mar", revenue: 2000, expenses: 9800, profit: -7800 },
    { name: "Apr", revenue: 2780, expenses: 3908, profit: -1128 },
    { name: "May", revenue: 1890, expenses: 4800, profit: -2910 },
    { name: "Jun", revenue: 2390, expenses: 3800, profit: -1410 },
    { name: "Jul", revenue: 3490, expenses: 4300, profit: -810 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profit & Loss Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="revenue"
                stackId="1"
                stroke="#22c55e"
                fill="#22c55e"
              />
              <Area
                type="monotone"
                dataKey="expenses"
                stackId="1"
                stroke="#ef4444"
                fill="#ef4444"
              />
              <Area
                type="monotone"
                dataKey="profit"
                stroke="#3b82f6"
                fill="#3b82f6"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfitLossChart;