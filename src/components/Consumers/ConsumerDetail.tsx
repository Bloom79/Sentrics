import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Consumer, ConsumerType, ConsumerStatus, ConsumerSpecs } from "@/types/site";
import ConsumerContract from "./ConsumerContract";
import ConsumptionFiles from "./ConsumptionFiles";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const ConsumerDetail = () => {
  const { consumerId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { data: consumer, isLoading } = useQuery({
    queryKey: ['consumer', consumerId],
    queryFn: async () => {
      if (!consumerId) {
        throw new Error('Consumer ID is required');
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', consumerId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching consumer:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load consumer details. Please try again.",
        });
        navigate('/consumers');
        throw error;
      }

      if (!data) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Consumer not found.",
        });
        navigate('/consumers');
        throw new Error('Consumer not found');
      }

      const defaultSpecs: ConsumerSpecs = {
        peakDemand: 0,
        dailyUsage: 0,
        powerFactor: 0,
        connectionType: 'low-voltage'
      };

      const consumer: Consumer = {
        id: data.id,
        full_name: data.full_name || '',
        type: (data.type || 'residential') as ConsumerType,
        consumption: data.consumption || 0,
        status: (data.status || 'active') as ConsumerStatus,
        specs: typeof data.specs === 'object' && data.specs !== null
          ? { ...defaultSpecs, ...data.specs } as ConsumerSpecs
          : defaultSpecs,
        address: data.address,
        city: data.city,
        postal_code: data.postal_code,
        country: data.country,
        contact_person: data.contact_person,
        email: data.email,
        phone: data.phone,
        vat_number: data.vat_number,
        notes: data.notes
      };

      return consumer;
    }
  });

  if (isLoading) {
    return <div>Loading consumer details...</div>;
  }

  if (!consumer) {
    return <div>Consumer not found.</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{consumer.full_name}</h1>
        <p className="text-muted-foreground">Consumer Details and Management</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="consumption">Consumption</TabsTrigger>
          <TabsTrigger value="contracts">Contracts</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
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
                    <dd className="text-sm font-medium">{consumer.specs.connectionType}</dd>
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
                    <dd className="text-sm font-medium">{consumer.specs.peakDemand} kW</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Daily Usage</dt>
                    <dd className="text-sm font-medium">{consumer.specs.dailyUsage} kWh</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Power Factor</dt>
                    <dd className="text-sm font-medium">{consumer.specs.powerFactor}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="consumption">
          <Card>
            <CardHeader>
              <CardTitle>Consumption History</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Consumption history visualization will be implemented here</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contracts">
          <ConsumerContract />
        </TabsContent>

        <TabsContent value="files">
          <ConsumptionFiles consumerId={consumerId!} />
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
