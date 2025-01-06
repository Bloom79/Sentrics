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
      description={
        <div className="flex flex-col text-xs">
          <span>{t('dashboard.optimalPerformance')}</span>
          <span className="text-green-500">Charging: +250 kW</span>
        </div>
      }
      icon={<Battery className="w-4 h-4 text-secondary" />}
    />
  );
};

export default StorageStatus;