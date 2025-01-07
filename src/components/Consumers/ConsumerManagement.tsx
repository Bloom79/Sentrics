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
      // First, let's log what types we're looking for
      console.log("Fetching consumers from profiles table");
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .not('type', 'is', null); // Get all profiles that have a type set
      
      if (error) {
        console.error("Error fetching consumers:", error);
        throw error;
      }
      
      console.log("Raw profiles data:", data); // Debug log
      
      return data?.map(profile => {
        // Ensure specs is properly parsed if it's a string
        let specs;
        if (typeof profile.specs === 'string') {
          try {
            specs = JSON.parse(profile.specs);
          } catch (e) {
            specs = {
              peakDemand: 0,
              dailyUsage: 0,
              powerFactor: 0,
              connectionType: 'low-voltage'
            };
          }
        } else {
          specs = profile.specs || {
            peakDemand: 0,
            dailyUsage: 0,
            powerFactor: 0,
            connectionType: 'low-voltage'
          };
        }

        return {
          id: profile.id,
          full_name: profile.full_name || '',
          type: (profile.type as "residential" | "commercial" | "industrial") || 'residential',
          consumption: Number(profile.consumption) || 0,
          status: (profile.status as "active" | "inactive" | "pending") || 'active',
          specs: {
            peakDemand: Number(specs.peakDemand) || 0,
            dailyUsage: Number(specs.dailyUsage) || 0,
            powerFactor: Number(specs.powerFactor) || 0,
            connectionType: specs.connectionType || 'low-voltage'
          }
        };
      }) as Consumer[] || [];
    }
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold tracking-tight">
          Consumer Management
        </h2>
        <AddConsumerDialog onSuccess={() => refetch()} />
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