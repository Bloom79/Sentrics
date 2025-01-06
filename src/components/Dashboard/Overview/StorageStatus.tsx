import React from "react";
import { Battery } from "lucide-react";
import MetricsCard from "@/components/Dashboard/MetricsCard";
import { useLanguage } from "@/contexts/LanguageContext";

const StorageStatus = () => {
  const { t } = useLanguage();
  
  return (
    <MetricsCard
      title={t('dashboard.storageEfficiency')}
      value="92%"
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