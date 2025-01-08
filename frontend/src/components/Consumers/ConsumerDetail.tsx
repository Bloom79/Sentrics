import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ConsumerOverview from "./ConsumerOverview";
import ConsumerContract from "./ConsumerContract";
import ConsumerConsumption from "./ConsumerConsumption";
import ConsumerPODs from "./ConsumerPODs";
import ConsumerSettings from "./ConsumerSettings/ConsumerSettings";
import { Consumer } from "@/types/site";

const ConsumerDetail = () => {
  const { consumerId } = useParams();

  const { data: consumer, isLoading } = useQuery({
    queryKey: ['consumer', consumerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', consumerId)
        .single();
      
      if (error) throw error;

      const consumerData: Consumer = {
        id: data.id,
        name: data.full_name || '',
        full_name: data.full_name || '',
        type: data.type || 'commercial',
        status: data.status || 'active',
        created_at: data.created_at,
        specs: {
          peakDemand: data.specs?.peakDemand || 0,
          dailyUsage: data.specs?.dailyUsage || 0,
          powerFactor: data.specs?.powerFactor || 0,
          connectionType: data.specs?.connectionType || 'low-voltage'
        }
      };
      
      return consumerData;
    }
  });

  if (isLoading) return <div>Loading...</div>;
  if (!consumer) return <div>Consumer not found</div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{consumer.name}</h2>
        <p className="text-muted-foreground">
          Manage consumer details, contracts, and consumption
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="pods">PODs</TabsTrigger>
          <TabsTrigger value="contracts">Contracts</TabsTrigger>
          <TabsTrigger value="consumption">Consumption</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <ConsumerOverview consumer={consumer} />
        </TabsContent>

        <TabsContent value="pods">
          <ConsumerPODs consumerId={consumer.id} />
        </TabsContent>

        <TabsContent value="contracts">
          <ConsumerContract consumerId={consumer.id} />
        </TabsContent>

        <TabsContent value="consumption">
          <ConsumerConsumption consumerId={consumer.id} />
        </TabsContent>

        <TabsContent value="settings">
          <ConsumerSettings consumerId={consumer.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ConsumerDetail;