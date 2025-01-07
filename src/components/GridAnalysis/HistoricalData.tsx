import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";

const HistoricalData = () => {
  // Mock data - in a real app, this would come from an API
  const historicalData = [
    { date: "2024-01", import: 1200, export: 800 },
    { date: "2024-02", import: 1100, export: 900 },
    { date: "2024-03", import: 1300, export: 750 },
    { date: "2024-04", import: 1400, export: 850 },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Select defaultValue="month">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">Daily</SelectItem>
            <SelectItem value="week">Weekly</SelectItem>
            <SelectItem value="month">Monthly</SelectItem>
            <SelectItem value="year">Yearly</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm">
          <FileDown className="mr-2 h-4 w-4" />
          Export Data
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historical Power Exchange</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={historicalData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="import" stroke="#3b82f6" name="Import" />
              <Line type="monotone" dataKey="export" stroke="#10b981" name="Export" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Exchange Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Import</p>
              <p className="text-2xl font-bold">5,000 kWh</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Export</p>
              <p className="text-2xl font-bold">3,300 kWh</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Net Exchange</p>
              <p className="text-2xl font-bold">1,700 kWh</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HistoricalData;