import React from "react";
import { useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConsumerContractsList } from "@/components/Financials/Contracts/ConsumerContractsList";
import { GridContractsList } from "@/components/Financials/Contracts/GridContractsList";

const Contracts = () => {
  const { plantId, siteId } = useParams();

  const getEntityTitle = () => {
    if (plantId) return "Plant Contracts";
    if (siteId) return "Site Contracts";
    return "Contracts";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">{getEntityTitle()}</h2>
      </div>

      <Tabs defaultValue="consumer" className="space-y-4">
        <TabsList>
          <TabsTrigger value="consumer">Consumer Contracts</TabsTrigger>
          <TabsTrigger value="grid">Grid Contracts</TabsTrigger>
        </TabsList>
        <TabsContent value="consumer" className="space-y-4">
          <ConsumerContractsList />
        </TabsContent>
        <TabsContent value="grid" className="space-y-4">
          <GridContractsList />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Contracts;