import React from "react";
import { Battery } from "lucide-react";
import MetricsCard from "@/components/Dashboard/MetricsCard";
import { useLanguage } from "@/contexts/LanguageContext";

const StorageStatus = () => {
  const { t } = useLanguage();
  const mockTrendData = [45, 48, 52, 50, 54, 55, 53];
  
  return (
    <MetricsCard
      title="Storage"
      value="92%"
      trend={mockTrendData}
      trendColor="#059669"
      description={(
        <div className="flex flex-col">
          <span className="text-sm">850 kWh Available</span>
          <span className="text-green-500 text-sm">Charging: +250 kW</span>
          <span className="text-xs text-muted-foreground">Temp: 23°C</span>
        </div>
      )}
      icon={<Battery className="w-4 h-4 text-secondary" />}
    />
  );
};

export default StorageStatus;