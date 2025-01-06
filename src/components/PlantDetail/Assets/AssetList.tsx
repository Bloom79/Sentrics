import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plant, SolarAsset, WindAsset } from "@/types/site";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Wind, AlertCircle, Server, Gauge } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AddAssetButton } from "./AddAssetButton";

interface AssetListProps {
  plant: Plant;
  assets: SolarAsset[] | WindAsset[];
}

export const AssetList = ({ plant, assets }: AssetListProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational":
        return "bg-green-500";
      case "faulty":
        return "bg-red-500";
      case "maintenance":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Assets</h2>
        <AddAssetButton plantType={plant.type} />
      </div>
      
      <div className="space-y-6">
        {assets.map((asset) => (
          <Collapsible key={asset.id}>
            <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border p-4 hover:bg-muted">
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${getStatusColor(asset.status)}`} />
                <span>{asset.serialNumber}</span>
              </div>
              <Badge>{asset.status}</Badge>
            </CollapsibleTrigger>
            <CollapsibleContent className="px-4 py-2">
              <div className="grid gap-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>Model: {asset.model}</div>
                  <div>Installation: {new Date(asset.installationDate).toLocaleDateString()}</div>
                  {'efficiency' in asset && <div>Efficiency: {asset.efficiency}%</div>}
                  {'lastOutput' in asset && <div>Last Output: {asset.lastOutput}W</div>}
                  {'currentOutput' in asset && <div>Current Output: {asset.currentOutput}kW</div>}
                  {'manufacturer' in asset && <div>Manufacturer: {asset.manufacturer}</div>}
                  {'ratedCapacity' in asset && <div>Rated Capacity: {asset.ratedCapacity}kW</div>}
                  <div>Location: {asset.location}</div>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    </div>
  );
};