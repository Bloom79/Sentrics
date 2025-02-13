import React from "react";
import { Activity, TrendingUp, TrendingDown } from "lucide-react";
import MetricsCard from "@/components/Dashboard/MetricsCard";
import { useLanguage } from "@/contexts/LanguageContext";

const ProductionOverview = () => {
  const { t } = useLanguage();
  const productionChange = 5.2;
  const mockTrendData = [40, 35, 45, 42, 48, 52, 51];

  return (
    <MetricsCard
      title="Total Production"
      value="1,030 kW"
      trend={mockTrendData}
      trendColor="#3b82f6"
      description={(
        <div className="flex items-center gap-1">
          {productionChange >= 0 ? (
            <>
              <TrendingUp className="w-3 h-3 text-green-500" />
              <span className="text-green-500">+{productionChange}%</span>
            </>
          ) : (
            <>
              <TrendingDown className="w-3 h-3 text-red-500" />
              <span className="text-red-500">{productionChange}%</span>
            </>
          )}
          <span className="text-muted-foreground ml-1">vs last hour</span>
        </div>
      )}
      icon={<Activity className="w-4 h-4 text-accent" />}
    />
  );
};

export default ProductionOverview;