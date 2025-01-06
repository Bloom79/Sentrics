import React from "react";
import { useParams } from "react-router-dom";
import { Consumer } from "@/types/site";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ConsumersList from "@/components/SiteDetail/ConsumersList";

const SiteDetail = () => {
  const { siteId } = useParams();

  const mockConsumers: Consumer[] = [
    {
      id: "123e4567-e89b-12d3-a456-426614174000",
      full_name: "Industrial Consumer A",
      type: "industrial",
      consumption: 1500,
      status: "active",
      specs: {
        peakDemand: 2000,
        dailyUsage: 36000,
        powerFactor: 0.95,
        connectionType: "high-voltage"
      }
    },
    {
      id: "223e4567-e89b-12d3-a456-426614174001",
      full_name: "Commercial Consumer B",
      type: "commercial",
      consumption: 750,
      status: "active",
      specs: {
        peakDemand: 1000,
        dailyUsage: 18000,
        powerFactor: 0.92,
        connectionType: "medium-voltage"
      }
    }
  ];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Site Details for Site ID: {siteId}</CardTitle>
        </CardHeader>
        <CardContent>
          <ConsumersList consumers={mockConsumers} />
        </CardContent>
      </Card>
    </div>
  );
};

export default SiteDetail;
