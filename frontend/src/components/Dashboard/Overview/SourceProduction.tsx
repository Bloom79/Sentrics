import React from "react";
import { Sun, Wind } from "lucide-react";
import MetricsCard from "@/components/Dashboard/MetricsCard";
import { useLanguage } from "@/contexts/LanguageContext";

export const SolarProduction = () => {
  const { t } = useLanguage();
  const mockTrendData = [30, 28, 35, 32, 38, 42, 41];
  
  return (
    <MetricsCard
      title="Solar"
      value="630 kW"
      trend={mockTrendData}
      trendColor="#eab308"
      description={(
        <div className="flex flex-col">
          <span className="text-sm">12 Active Arrays</span>
          <span className="text-green-500 text-sm">Performance: 92%</span>
          <span className="text-xs text-muted-foreground">Peak Today: 850 kW</span>
        </div>
      )}
      icon={<Sun className="w-4 h-4 text-yellow-500" />}
    />
  );
};

export const WindProduction = () => {
  const { t } = useLanguage();
  const mockTrendData = [20, 25, 22, 28, 24, 26, 25];
  
  return (
    <MetricsCard
      title="Wind"
      value="400 kW"
      trend={mockTrendData}
      trendColor="#0ea5e9"
      description={(
        <div className="flex flex-col">
          <span className="text-sm">8 Active Turbines</span>
          <span className="text-blue-500 text-sm">12 m/s NW</span>
          <span className="text-xs text-muted-foreground">Efficiency: 88%</span>
        </div>
      )}
      icon={<Wind className="w-4 h-4 text-blue-500" />}
    />
  );
};