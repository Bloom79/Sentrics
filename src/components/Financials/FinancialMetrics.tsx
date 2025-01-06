import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, TrendingDown } from "lucide-react";
import { TimeRange } from "@/types/flowComponents";
import MetricsCard from "@/components/Dashboard/MetricsCard";

interface FinancialMetricsProps {
  timeRange: TimeRange;
}

const FinancialMetrics = ({ timeRange }: FinancialMetricsProps) => {
  // Mock data - in a real app, this would come from an API
  const metrics = {
    totalRevenue: {
      value: "$125,430",
      trend: [65, 75, 70, 80, 85, 90],
      change: "+12.5%",
    },
    totalExpenses: {
      value: "$45,890",
      trend: [30, 35, 32, 38, 36, 40],
      change: "+8.2%",
    },
    netIncome: {
      value: "$79,540",
      trend: [35, 40, 38, 42, 49, 50],
      change: "+15.3%",
    },
  };

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <MetricsCard
        title="Total Revenue"
        value={metrics.totalRevenue.value}
        description={
          <div className="flex items-center gap-1">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <span className="text-green-500">{metrics.totalRevenue.change}</span>
          </div>
        }
        icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
        trend={metrics.totalRevenue.trend}
        trendColor="#22c55e"
      />

      <MetricsCard
        title="Total Expenses"
        value={metrics.totalExpenses.value}
        description={
          <div className="flex items-center gap-1">
            <TrendingUp className="h-4 w-4 text-red-500" />
            <span className="text-red-500">{metrics.totalExpenses.change}</span>
          </div>
        }
        icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
        trend={metrics.totalExpenses.trend}
        trendColor="#ef4444"
      />

      <MetricsCard
        title="Net Income"
        value={metrics.netIncome.value}
        description={
          <div className="flex items-center gap-1">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <span className="text-green-500">{metrics.netIncome.change}</span>
          </div>
        }
        icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
        trend={metrics.netIncome.trend}
        trendColor="#22c55e"
      />
    </div>
  );
};

export default FinancialMetrics;