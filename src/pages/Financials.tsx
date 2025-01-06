import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TimeRangeSelector from "@/components/SiteAnalysis/TimeRangeSelector";
import { AppBreadcrumb } from "@/components/Layout/Breadcrumb";
import { DollarSign, TrendingUp, TrendingDown, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TimeRange } from "@/types/flowComponents";
import FinancialMetrics from "@/components/Financials/FinancialMetrics";
import RevenueBreakdown from "@/components/Financials/RevenueBreakdown";
import ExpensesBreakdown from "@/components/Financials/ExpensesBreakdown";
import ProfitLossChart from "@/components/Financials/ProfitLossChart";

const Financials = () => {
  const { plantId } = useParams();
  const [timeRange, setTimeRange] = useState<TimeRange>("24hours");

  const handleExport = () => {
    // Implement export functionality
    console.log("Exporting financial data...");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <AppBreadcrumb />
        <Button onClick={handleExport} variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Earnings & Expenses</h2>
        <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
      </div>

      <FinancialMetrics timeRange={timeRange} />

      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="profit-loss">Profit & Loss</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-4">
          <RevenueBreakdown timeRange={timeRange} />
        </TabsContent>

        <TabsContent value="expenses" className="space-y-4">
          <ExpensesBreakdown timeRange={timeRange} />
        </TabsContent>

        <TabsContent value="profit-loss" className="space-y-4">
          <ProfitLossChart timeRange={timeRange} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Financials;