import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GridOverview } from "@/components/GridAnalysis/GridOverview";
import { RealTimeExchange } from "@/components/GridAnalysis/RealTimeExchange";
import { HistoricalData } from "@/components/GridAnalysis/HistoricalData";
import { ContractsView } from "@/components/GridAnalysis/ContractsView";
import { FinancialSettlement } from "@/components/GridAnalysis/FinancialSettlement";
import { FileExchangeTab } from "@/components/GridAnalysis/FileExchange/FileExchangeTab";

const GridAnalysis = () => {
  return (
    <div className="container space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Grid Analysis</h1>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="realtime">Real-Time Exchange</TabsTrigger>
          <TabsTrigger value="historical">Historical Data</TabsTrigger>
          <TabsTrigger value="files">File Exchange</TabsTrigger>
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

        <TabsContent value="files" className="space-y-4">
          <FileExchangeTab />
        </TabsContent>

        <TabsContent value="contracts" className="space-y-4">
          <ContractsView />
        </TabsContent>

        <TabsContent value="financial" className="space-y-4">
          <FinancialSettlement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GridAnalysis;