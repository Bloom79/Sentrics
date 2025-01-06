import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowDownToLine, Battery, Factory, Sun } from "lucide-react";

interface EnergyEfficiencyDisplayProps {
  siteId: string;
}

const EnergyEfficiencyDisplay = ({ siteId }: EnergyEfficiencyDisplayProps) => {
  // Mock data - replace with actual data from API
  const efficiencyData = {
    solarToStorage: 92, // Solar to Storage efficiency
    storageToPower: 95, // Storage to Power conversion efficiency
    powerToConsumer: 98, // Power delivery to consumer efficiency
    totalSystemEfficiency: 85, // Overall system efficiency
    losses: {
      solarConversion: 8,
      storageConversion: 5,
      distribution: 2,
    },
  };

  const calculateCumulativeEfficiency = (stage: number): number => {
    const stages = [
      efficiencyData.solarToStorage,
      efficiencyData.storageToPower,
      efficiencyData.powerToConsumer,
    ];
    return stages.slice(0, stage).reduce((acc, curr) => (acc * curr) / 100, 100);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowDownToLine className="h-5 w-5" />
          Energy Conversion Efficiency
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Overall System Efficiency */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Total System Efficiency</span>
              <span>{efficiencyData.totalSystemEfficiency}%</span>
            </div>
            <Progress value={efficiencyData.totalSystemEfficiency} className="h-2" />
          </div>

          {/* Conversion Stages */}
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Sun className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-medium">Solar to Storage</span>
                <span className="ml-auto text-sm">{efficiencyData.solarToStorage}%</span>
              </div>
              <Progress value={calculateCumulativeEfficiency(1)} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Loss: {efficiencyData.losses.solarConversion}% (Panel conversion & transmission)
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Battery className="h-4 w-4 text-purple-500" />
                <span className="text-sm font-medium">Storage to Power</span>
                <span className="ml-auto text-sm">{efficiencyData.storageToPower}%</span>
              </div>
              <Progress value={calculateCumulativeEfficiency(2)} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Loss: {efficiencyData.losses.storageConversion}% (Storage & conversion)
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Factory className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">Power to Consumer</span>
                <span className="ml-auto text-sm">{efficiencyData.powerToConsumer}%</span>
              </div>
              <Progress value={calculateCumulativeEfficiency(3)} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Loss: {efficiencyData.losses.distribution}% (Distribution)
              </p>
            </div>
          </div>

          {/* Cumulative Efficiency */}
          <div className="rounded-lg bg-muted p-4">
            <h4 className="text-sm font-medium mb-2">Cumulative System Efficiency</h4>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-bold">{calculateCumulativeEfficiency(1).toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">After Storage</p>
              </div>
              <div>
                <div className="text-lg font-bold">{calculateCumulativeEfficiency(2).toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">After Conversion</p>
              </div>
              <div>
                <div className="text-lg font-bold">{calculateCumulativeEfficiency(3).toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">Final Delivery</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnergyEfficiencyDisplay;