import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TimeRangeSelector from "@/components/SiteAnalysis/TimeRangeSelector";
import { Plant } from "@/types/site";
import { BarChart3, DollarSign, TrendingDown, TrendingUp } from "lucide-react";
import MetricsCard from "@/components/Dashboard/MetricsCard";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data - in a real app, this would come from an API
const mockPlant: Plant = {
  id: "1",
  name: "Milano Nord Plant 1",
  type: "solar",
  capacity: 1000,
  currentOutput: 750,
  efficiency: 75,
  status: "online",
  lastUpdate: new Date().toISOString()
};

const mockFinancialData = {
  revenue: {
    grid: 15000,
    consumers: 25000,
    total: 40000
  },
  expenses: {
    operations: 8000,
    maintenance: 5000,
    administrative: 3000,
    total: 16000
  },
  netIncome: 24000,
  historicalData: [
    { date: '2024-01', revenue: 38000, expenses: 15000, netIncome: 23000 },
    { date: '2024-02', revenue: 40000, expenses: 16000, netIncome: 24000 },
    { date: '2024-03', revenue: 42000, expenses: 15500, netIncome: 26500 },
  ]
};

const PlantFinancials = () => {
  const { plantId } = useParams();
  const [timeRange, setTimeRange] = useState("24hours");
  const plant = mockPlant; // In a real app, fetch plant data based on plantId

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">
            Financials - {plant.name}
          </h2>
        </div>
        <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <MetricsCard
          title="Total Revenue"
          value={`$${mockFinancialData.revenue.total.toLocaleString()}`}
          description="Combined income from grid and consumers"
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
          trend={[35000, 37000, 40000]}
          trendColor="#22c55e"
        />
        <MetricsCard
          title="Total Expenses"
          value={`$${mockFinancialData.expenses.total.toLocaleString()}`}
          description="All operational and maintenance costs"
          icon={<TrendingDown className="h-4 w-4 text-muted-foreground" />}
          trend={[14000, 15000, 16000]}
          trendColor="#ef4444"
        />
        <MetricsCard
          title="Net Income"
          value={`$${mockFinancialData.netIncome.toLocaleString()}`}
          description="Revenue minus expenses"
          icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
          trend={[21000, 22000, 24000]}
          trendColor="#3b82f6"
        />
        <MetricsCard
          title="Profit Margin"
          value="60%"
          description="Net income as percentage of revenue"
          icon={<BarChart3 className="h-4 w-4 text-muted-foreground" />}
          trend={[58, 59, 60]}
          trendColor="#a855f7"
        />
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="revenue">Revenue Details</TabsTrigger>
          <TabsTrigger value="expenses">Expenses Details</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Profit & Loss Trend</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockFinancialData.historicalData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stackId="1"
                    stroke="#22c55e" 
                    fill="#22c55e" 
                    fillOpacity={0.2}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="expenses" 
                    stackId="2"
                    stroke="#ef4444" 
                    fill="#ef4444" 
                    fillOpacity={0.2}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="netIncome" 
                    stackId="3"
                    stroke="#3b82f6" 
                    fill="#3b82f6" 
                    fillOpacity={0.2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Revenue Breakdown</h3>
            {/* Revenue details table will be implemented in the next phase */}
          </Card>
        </TabsContent>

        <TabsContent value="expenses" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Expenses Breakdown</h3>
            {/* Expenses details table will be implemented in the next phase */}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PlantFinancials;