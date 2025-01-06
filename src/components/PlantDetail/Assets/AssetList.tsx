import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plant, SolarAsset, WindAsset } from "@/types/site";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Server, Wind, AlertCircle, Gauge, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AddAssetButton } from "./AddAssetButton";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { EditAssetDialog } from "./EditAssetDialog";
import { useToast } from "@/hooks/use-toast";

interface AssetListProps {
  plant: Plant;
  assets: SolarAsset[] | WindAsset[];
}

export const AssetList = ({ plant, assets }: AssetListProps) => {
  const { toast } = useToast();
  
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

  const handleDelete = (assetId: string) => {
    // In a real app, this would make an API call to delete the asset
    console.log("Deleting asset:", assetId);
    toast({
      title: "Asset deleted",
      description: "The asset has been successfully removed.",
    });
  };

  const handleEdit = (asset: SolarAsset | WindAsset) => {
    // In a real app, this would make an API call to update the asset
    console.log("Editing asset:", asset);
    toast({
      title: "Asset updated",
      description: "The asset has been successfully updated.",
    });
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
              <div className="grid gap-4">
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
                <div className="flex justify-end gap-2">
                  <EditAssetDialog asset={asset} onEdit={handleEdit} />
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the asset
                          and remove it from our servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(asset.id)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    </div>
  );
};