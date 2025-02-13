import React from "react";
import { Plant } from "@/types/site";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AddAssetDialog } from "./Assets/AddAssetDialog";

interface CollectorSubstationTabProps {
  plant: Plant;
}

export const CollectorSubstationTab = ({ plant }: CollectorSubstationTabProps) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Collector Substations</h3>
          <p className="text-sm text-muted-foreground">
            Manage collector substations for {plant.name}
          </p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Substation
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Substations will be listed here */}
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">
            No substations configured yet. Click the "Add Substation" button to create one.
          </p>
        </Card>
      </div>

      <AddAssetDialog 
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        plant={plant}
        defaultAssetType="Collector Substation"
      />
    </div>
  );
}; 