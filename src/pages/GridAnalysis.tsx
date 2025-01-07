import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GridOverview from "@/components/GridAnalysis/GridOverview";
import RealTimeExchange from "@/components/GridAnalysis/RealTimeExchange";
import HistoricalData from "@/components/GridAnalysis/HistoricalData";
import ContractsAgreements from "@/components/GridAnalysis/ContractsAgreements";
import FinancialSettlement from "@/components/GridAnalysis/FinancialSettlement";

const GridAnalysis = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Grid Exchange</h1>
          <p className="text-muted-foreground">
            Monitor and manage your grid connection with Terna
          </p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="realtime">Real-Time Exchange</TabsTrigger>
          <TabsTrigger value="historical">Historical Data</TabsTrigger>
          <TabsTrigger value="contracts">Contracts</TabsTrigger>
          <TabsTrigger value="financial">Financial Settlement</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <GridOverview />
        </TabsContent>

        <TabsContent value="realtime" className="space-y-4">
          <RealTimeExchange />
        </TabsContent>

        <TabsContent value="historical" className="space-y-4">
          <HistoricalData />
        </TabsContent>

        <TabsContent value="contracts" className="space-y-4">
          <ContractsAgreements />
        </TabsContent>

        <TabsContent value="financial" className="space-y-4">
          <FinancialSettlement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GridAnalysis;