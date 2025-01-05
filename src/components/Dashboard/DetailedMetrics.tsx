import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";

const mockData = [
  { month: "Gen", production: 4000, consumption: 2400 },
  { month: "Feb", production: 3000, consumption: 1398 },
  { month: "Mar", production: 2000, consumption: 9800 },
  { month: "Apr", production: 2780, consumption: 3908 },
  { month: "Mag", production: 1890, consumption: 4800 },
  { month: "Giu", production: 2390, consumption: 3800 },
];

const DetailedMetrics = () => {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Produzione vs Consumo</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          className="h-[300px]"
          config={{
            production: {
              theme: {
                light: "hsl(var(--primary))",
                dark: "hsl(var(--primary))",
              },
            },
            consumption: {
              theme: {
                light: "hsl(var(--muted))",
                dark: "hsl(var(--muted))",
              },
            },
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mockData}>
              <XAxis dataKey="month" />
              <YAxis />
              <ChartTooltip />
              <Bar dataKey="production" name="Produzione" fill="currentColor" />
              <Bar dataKey="consumption" name="Consumo" fill="currentColor" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default DetailedMetrics;