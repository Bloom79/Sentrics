import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Consumer } from "@/types/site";
import ConsumerContract from "./ConsumerContract";
import ConsumerConsumption from "./ConsumerConsumption";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const ConsumerDetail = () => {
  const { consumerId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Validate if consumerId is in UUID format
  const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(consumerId || '');

  const { data: consumer, isLoading, error } = useQuery({
    queryKey: ['consumer', consumerId],
    queryFn: async () => {
      if (!consumerId || !isValidUUID) {
        throw new Error('Invalid consumer ID format');
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', consumerId)
        .maybeSingle();

      if (error) throw error;
      if (!data) throw new Error('Consumer not found');

      // Map the profile data to match the Consumer type
      const consumerData: Consumer = {
        id: data.id,
        name: data.full_name || 'Unnamed Consumer',
        type: (data.type as 'industrial' | 'commercial') || 'commercial',
        consumption: data.consumption || 0,
        status: data.status || 'inactive',
        specs: data.specs ? {
          peakDemand: data.specs.peakDemand || 0,
          dailyUsage: data.specs.dailyUsage || 0,
          powerFactor: data.specs.powerFactor || 0,
          connectionType: data.specs.connectionType || 'low-voltage'
        } : {
          peakDemand: 0,
          dailyUsage: 0,
          powerFactor: 0,
          connectionType: 'low-voltage'
        }
      };

      return consumerData;
    },
    enabled: isValidUUID,
    meta: {
      onError: (error: Error) => {
        console.error('Error fetching consumer:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load consumer details. Please try again.",
        });
        navigate('/consumers');
      }
    }
  });

  if (!isValidUUID) {
    return <div>Invalid consumer ID format</div>;
  }

  if (isLoading) {
    return <div>Loading consumer details...</div>;
  }

  if (error || !consumer) {
    return <div>Error loading consumer details. Please try again.</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{consumer.name}</h1>
        <p className="text-muted-foreground">Consumer Details and Management</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="consumption">Consumption</TabsTrigger>
          <TabsTrigger value="contracts">Contracts</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-2">
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Type</dt>
                    <dd className="text-sm font-medium">{consumer.type}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Status</dt>
                    <dd className="text-sm font-medium">{consumer.status}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Connection Type</dt>
                    <dd className="text-sm font-medium">{consumer.specs?.connectionType || 'N/A'}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Consumption Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-2">
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Current Consumption</dt>
                    <dd className="text-sm font-medium">{consumer.consumption} kW</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Peak Demand</dt>
                    <dd className="text-sm font-medium">{consumer.specs?.peakDemand || 'N/A'} kW</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Daily Usage</dt>
                    <dd className="text-sm font-medium">{consumer.specs?.dailyUsage || 'N/A'} kWh</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Power Factor</dt>
                    <dd className="text-sm font-medium">{consumer.specs?.powerFactor || 'N/A'}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="consumption">
          <ConsumerConsumption />
        </TabsContent>

        <TabsContent value="contracts">
          <ConsumerContract />
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Consumer Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Settings and configuration options will be added here</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ConsumerDetail;