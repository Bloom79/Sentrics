import React from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Consumer } from "@/types/site";
import ConsumerContract from "./ConsumerContract";

const ConsumerDetail = () => {
  const { consumerId } = useParams();
  
  // Mock consumer data - replace with actual data fetching
  const consumer: Consumer = {
    id: consumerId || "",
    name: "Industrial Park A",
    type: "industrial",
    consumption: 750,
    status: "active",
    specs: {
      peakDemand: 1000,
      dailyUsage: 18000,
      powerFactor: 0.95,
      connectionType: "high-voltage"
    }
  };

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
