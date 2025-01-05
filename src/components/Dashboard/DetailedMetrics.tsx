import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Legend } from "recharts";

const mockData = [
  { 
    month: "Gen", 
    solarProduction: 2500,
    windProduction: 1500,
    consumption: 2400,
    efficiency: 92
  },
  { 
    month: "Feb", 
    solarProduction: 2000,
    windProduction: 1000,
    consumption: 1398,
    efficiency: 94
  },
  { 
    month: "Mar", 
    solarProduction: 1200,
    windProduction: 800,
    consumption: 1800,
    efficiency: 88
  },
  { 
    month: "Apr", 
    solarProduction: 1780,
    windProduction: 1000,
    consumption: 1908,
    efficiency: 91
  },
  { 
    month: "Mag", 
    solarProduction: 1090,
    windProduction: 800,
    consumption: 1800,
    efficiency: 89
  },
  { 
    month: "Giu", 
    solarProduction: 1590,
    windProduction: 800,
    consumption: 1800,
    efficiency: 90
  },
];

const DetailedMetrics = () => {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Produzione vs Consumo per Fonte</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          className="h-[300px]"
          config={{
            solarProduction: {
              theme: {
                light: "#F97316", // Bright Orange for Solar
                dark: "#F97316",
              },
            },
            windProduction: {
              theme: {
                light: "#0EA5E9", // Ocean Blue for Wind
                dark: "#0EA5E9",
              },
            },
            consumption: {
              theme: {
                light: "#8B5CF6", // Vivid Purple for Consumption
                dark: "#8B5CF6",
              },
            },
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={mockData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <XAxis dataKey="month" />
              <YAxis />
              <ChartTooltip 
                formatter={(value: number, name: string) => {
                  const formattedName = {
                    solarProduction: "Produzione Solare",
                    windProduction: "Produzione Eolica",
                    consumption: "Consumo"
                  }[name] || name;
                  return [`${value} kW`, formattedName];
                }}
              />
              <Legend 
                formatter={(value: string) => {
                  const labels = {
                    solarProduction: "Produzione Solare",
                    windProduction: "Produzione Eolica",
                    consumption: "Consumo"
                  };
                  return labels[value as keyof typeof labels] || value;
                }}
              />
              <Bar 
                dataKey="solarProduction" 
                name="solarProduction" 
                fill="currentColor"
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="windProduction" 
                name="windProduction" 
                fill="currentColor"
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="consumption" 
                name="consumption" 
                fill="currentColor"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default DetailedMetrics;