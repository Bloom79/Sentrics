import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ConsumersList from "@/components/SiteDetail/ConsumersList";
import { Consumer } from "@/types/site";

const ConsumerManagement = () => {
  const mockConsumers: Consumer[] = [
    {
      id: "1",
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
    },
    {
      id: "2",
      name: "Shopping Mall B",
      type: "commercial",
      consumption: 450,
      status: "active",
      specs: {
        peakDemand: 600,
        dailyUsage: 10800,
        powerFactor: 0.92,
        connectionType: "medium-voltage"
      }
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold tracking-tight">
          Consumer Management
        </h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Consumer
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Active Consumers</CardTitle>
        </CardHeader>
        <CardContent>
          <ConsumersList consumers={mockConsumers} />
        </CardContent>
      </Card>
    </div>
  );
};

export default ConsumerManagement;