import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SitesList from "@/components/Dashboard/SitesList";

const SitesOverview = () => {
  const mockSites = [
    {
      id: "1",
      name: "Milano Nord",
      status: "online",
      lastUpdate: new Date().toISOString(),
      dailyProduction: 1200,
      monthlyProduction: 36000,
      efficiency: 95,
      co2Saved: 25.5
    },
    {
      id: "2",
      name: "Roma Sud",
      status: "maintenance",
      lastUpdate: new Date().toISOString(),
      dailyProduction: 980,
      monthlyProduction: 29400,
      efficiency: 88,
      co2Saved: 20.8
    },
    {
      id: "3",
      name: "Torino Est",
      status: "offline",
      lastUpdate: new Date().toISOString(),
      dailyProduction: 0,
      monthlyProduction: 31200,
      efficiency: 0,
      co2Saved: 18.3
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Sites Overview</h1>
      </div>
      <SitesList sites={mockSites} selectedTimeRange="24h" />
    </div>
  );
};

export default SitesOverview;