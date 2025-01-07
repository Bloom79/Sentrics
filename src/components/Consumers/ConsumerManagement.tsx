import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ConsumersList from "@/components/SiteDetail/ConsumersList";
import { AddConsumerDialog } from "./AddConsumerDialog";
import { Consumer } from "@/types/site";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const ConsumerManagement = () => {
  const { data: consumers = [], isLoading } = useQuery({
    queryKey: ['consumers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .in('type', ['industrial', 'commercial']);
      
      if (error) throw error;
      
      return data.map((profile): Consumer => ({
        id: profile.id,
        name: profile.full_name || '',
        type: (profile.type as 'industrial' | 'commercial') || 'commercial',
        consumption: profile.consumption || 0,
        status: profile.status || 'active',
        specs: profile.specs ? {
          peakDemand: profile.specs.peakDemand || 0,
          dailyUsage: profile.specs.dailyUsage || 0,
          powerFactor: profile.specs.powerFactor || 0,
          connectionType: profile.specs.connectionType || 'low-voltage'
        } : {
          peakDemand: 0,
          dailyUsage: 0,
          powerFactor: 0,
          connectionType: 'low-voltage'
        }
      }));
    }
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold tracking-tight">
          Consumer Management
        </h2>
        <AddConsumerDialog />
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Active Consumers</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div>Loading consumers...</div>
          ) : (
            <ConsumersList consumers={consumers} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ConsumerManagement;