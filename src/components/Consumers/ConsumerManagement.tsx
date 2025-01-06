import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ConsumersList from "@/components/SiteDetail/ConsumersList";
import { Consumer } from "@/types/site";
import { AddConsumerDialog } from "./AddConsumerDialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const ConsumerManagement = () => {
  const { data: consumers, refetch } = useQuery({
    queryKey: ['consumers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .in('type', ['residential', 'commercial', 'industrial']);
      
      if (error) {
        console.error("Error fetching consumers:", error);
        throw error;
      }
      
      console.log("Fetched consumers:", data); // Debug log
      
      return data?.map(consumer => ({
        id: consumer.id,
        full_name: consumer.full_name,
        type: consumer.type as "residential" | "commercial" | "industrial",
        consumption: consumer.consumption || 0,
        status: consumer.status || 'active',
        specs: consumer.specs ? {
          peakDemand: consumer.specs.peakDemand || 0,
          dailyUsage: consumer.specs.dailyUsage || 0,
          powerFactor: consumer.specs.powerFactor || 0,
          connectionType: consumer.specs.connectionType || 'low-voltage'
        } : {
          peakDemand: 0,
          dailyUsage: 0,
          powerFactor: 0,
          connectionType: 'low-voltage'
        }
      })) as Consumer[] || [];
    }
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold tracking-tight">
          Consumer Management
        </h2>
        <AddConsumerDialog onSuccess={refetch} />
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Active Consumers</CardTitle>
        </CardHeader>
        <CardContent>
          <ConsumersList consumers={consumers || []} />
        </CardContent>
      </Card>
    </div>
  );
};

export default ConsumerManagement;