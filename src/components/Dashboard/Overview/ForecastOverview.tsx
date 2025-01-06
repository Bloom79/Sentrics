import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sun, Wind, Activity, AlertCircle, Battery, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Button } from "@/components/ui/button";

// Mock forecast data - replace with actual API data later
const mockForecastData = {
  solar: [
    { time: "06:00", value: 200, confidence: 90 },
    { time: "09:00", value: 450, confidence: 85 },
    { time: "12:00", value: 850, confidence: 95 },
    { time: "15:00", value: 650, confidence: 90 },
    { time: "18:00", value: 200, confidence: 85 },
  ],
  wind: [
    { time: "06:00", value: 300, confidence: 80 },
    { time: "09:00", value: 400, confidence: 85 },
    { time: "12:00", value: 350, confidence: 75 },
    { time: "15:00", value: 450, confidence: 80 },
    { time: "18:00", value: 500, confidence: 85 },
  ],
  batteryRecommendations: [
    {
      id: 1,
      priority: "high",
      action: "Schedule battery charge",
      time: "10:00",
      description: "High solar production expected at 12:00. Charge batteries before peak to optimize storage.",
      impact: "Potential savings: 200 EUR",
    },
    {
      id: 2,
      priority: "medium",
      action: "Optimize wind turbines",
      time: "15:00",
      description: "Strong winds expected from 15:00. Adjust turbine angles for maximum efficiency.",
      impact: "Efficiency increase: 15%",
    },
  ],
};

const ForecastOverview = () => {
  const { toast } = useToast();

  const handleActionClick = (action: string) => {
    toast({
      title: "Action Scheduled",
      description: `${action} has been scheduled.`,
    });
  };

  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Solar Forecast */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Solar Forecast</CardTitle>
            <Sun className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="h-[100px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockForecastData.solar}>
                  <defs>
                    <linearGradient id="solarGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#facc15" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#facc15" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#facc15"
                    fillOpacity={1}
                    fill="url(#solarGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              <p className="text-sm font-medium">Peak Production: 850 kW at 12:00</p>
              <p className="text-xs text-muted-foreground">90% Confidence (±5%)</p>
            </div>
          </CardContent>
        </Card>

        {/* Wind Forecast */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Wind Forecast</CardTitle>
            <Wind className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="h-[100px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockForecastData.wind}>
                  <defs>
                    <linearGradient id="windGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#3b82f6"
                    fillOpacity={1}
                    fill="url(#windGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              <p className="text-sm font-medium">Peak Production: 500 kW at 18:00</p>
              <p className="text-xs text-muted-foreground">85% Confidence (±8%)</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommended Actions */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Recommended Actions</CardTitle>
          <Activity className="h-4 w-4 text-accent" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockForecastData.batteryRecommendations.map((recommendation) => (
              <div
                key={recommendation.id}
                className={`flex items-start gap-4 p-2 rounded-lg ${
                  recommendation.priority === "high"
                    ? "bg-yellow-500/10"
                    : "bg-green-500/10"
                }`}
              >
                <AlertCircle
                  className={`h-5 w-5 mt-0.5 ${
                    recommendation.priority === "high"
                      ? "text-yellow-500"
                      : "text-green-500"
                  }`}
                />
                <div className="flex-1">
                  <p className="text-sm font-medium">{recommendation.action}</p>
                  <p className="text-xs text-muted-foreground mb-2">
                    {recommendation.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => handleActionClick(recommendation.action)}
                      className="text-xs bg-background hover:bg-accent px-2 py-1 rounded-md transition-colors"
                    >
                      Schedule Action
                    </button>
                    <span className="text-xs text-muted-foreground">
                      {recommendation.impact}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForecastOverview;