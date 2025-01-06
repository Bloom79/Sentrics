import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ConsumerOverview from "@/components/Consumers/ConsumerOverview";
import ConsumerManagement from "@/components/Consumers/ConsumerManagement";
import { ConsumerContractsList } from "@/components/Financials/Contracts/ConsumerContractsList";

const Consumers = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Consumers</h1>
        <p className="text-muted-foreground">
          Manage and monitor your energy consumers
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="management">All Consumers</TabsTrigger>
          <TabsTrigger value="contracts">Contracts</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <ConsumerOverview />
        </TabsContent>
        
        <TabsContent value="management" className="space-y-4">
          <ConsumerManagement />
        </TabsContent>

        <TabsContent value="contracts" className="space-y-4">
          <ConsumerContractsList />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Consumers;