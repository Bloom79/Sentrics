import React from "react";
import { Sun, Wind } from "lucide-react";
import MetricsCard from "@/components/Dashboard/MetricsCard";
import { useLanguage } from "@/contexts/LanguageContext";

export const SolarProduction = () => {
  const { t } = useLanguage();
  
  return (
    <MetricsCard
      title={t('dashboard.solarProduction')}
      value="630 kW"
      description={
        <div className="flex flex-col text-xs">
          <span>{t('dashboard.solarArrays')}</span>
          <span className="text-green-500">Performance Ratio: 92%</span>
        </div>
      }
      icon={<Sun className="w-4 h-4 text-yellow-500" />}
    />
  );
};

export const WindProduction = () => {
  const { t } = useLanguage();
  
  return (
    <MetricsCard
      title={t('dashboard.windProduction')}
      value="400 kW"
      description={
        <div className="flex flex-col text-xs">
          <span>{t('dashboard.windTurbines')}</span>
          <span className="text-blue-500">12 m/s NW</span>
        </div>
      }
      icon={<Wind className="w-4 h-4 text-blue-500" />}
    />
  );
};