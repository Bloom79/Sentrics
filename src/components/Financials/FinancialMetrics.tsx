import React from "react";
import { DollarSign, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import MetricsCard from "@/components/Dashboard/MetricsCard";

interface FinancialMetricsProps {
  plantId?: string;
  siteId?: string;
  consumerId?: string;
  dateRange: { from: Date; to: Date };
}

const FinancialMetrics = ({ plantId, siteId, consumerId, dateRange }: FinancialMetricsProps) => {
  // Mock data - in a real app, this would come from an API
  const metrics = {
    totalRevenue: 125000,
    totalExpenses: 45000,
    netIncome: 80000,
    trend: [65, 70, 75, 80, 85, 82, 80],
  };

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <MetricsCard
        title="Total Revenue"
        value={`$${metrics.totalRevenue.toLocaleString()}`}
        description="Total revenue from grid and consumer sales"
        icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
        trend={metrics.trend}
        trendColor="#22c55e"
      />
      <MetricsCard
        title="Total Expenses"
        value={`$${metrics.totalExpenses.toLocaleString()}`}
        description="Operating costs and maintenance"
        icon={<TrendingDown className="h-4 w-4 text-muted-foreground" />}
        trend={metrics.trend.map(v => v * 0.4)}
        trendColor="#ef4444"
      />
      <MetricsCard
        title="Net Income"
        value={`$${metrics.netIncome.toLocaleString()}`}
        description="Revenue minus expenses"
        icon={<Wallet className="h-4 w-4 text-muted-foreground" />}
        trend={metrics.trend.map(v => v * 0.6)}
        trendColor="#3b82f6"
      />
    </div>
  );
};

export default FinancialMetrics;