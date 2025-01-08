import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gauge } from "lucide-react";

interface EfficiencyMetricsProps {
  siteId: string;
}

const EfficiencyMetrics = ({ siteId }: EfficiencyMetricsProps) => {
  // Mock data - replace with actual metrics
  const metrics = {
    systemEfficiency: 92,
    energyYield: 4.2,
    performanceRatio: 0.85,
    capacityFactor: 0.28,
    availabilityRate: 99.5,
    gridIntegrationScore: 95,
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gauge className="h-5 w-5" />
          Efficiency Metrics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <p className="text-sm font-medium">System Efficiency</p>
            <p className="text-2xl font-bold">{metrics.systemEfficiency}%</p>
            <p className="text-xs text-muted-foreground">
              Overall system performance
            </p>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm font-medium">Energy Yield</p>
            <p className="text-2xl font-bold">{metrics.energyYield}</p>
            <p className="text-xs text-muted-foreground">
              kWh/kWp/day
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Performance Ratio</p>
            <p className="text-2xl font-bold">{metrics.performanceRatio}</p>
            <p className="text-xs text-muted-foreground">
              Actual vs theoretical output
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Capacity Factor</p>
            <p className="text-2xl font-bold">{(metrics.capacityFactor * 100).toFixed(1)}%</p>
            <p className="text-xs text-muted-foreground">
              Actual vs maximum possible output
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Availability Rate</p>
            <p className="text-2xl font-bold">{metrics.availabilityRate}%</p>
            <p className="text-xs text-muted-foreground">
              System uptime
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Grid Integration</p>
            <p className="text-2xl font-bold">{metrics.gridIntegrationScore}%</p>
            <p className="text-xs text-muted-foreground">
              Grid compatibility score
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EfficiencyMetrics;