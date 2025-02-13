import React from "react";
import { Asset, AssetMaintenance } from "@/types/site";
import { Card } from "@/components/ui/card";

interface AssetMaintenanceListProps {
  assets: Asset[];
  maintenanceRecords: AssetMaintenance[];
}

export const AssetMaintenanceList: React.FC<AssetMaintenanceListProps> = ({ 
  assets, 
  maintenanceRecords 
}) => {
  return (
    <Card>
      <div className="p-6">
        <h3 className="text-lg font-medium">Maintenance Records</h3>
        {/* We'll implement this component in the next step */}
        <p className="text-sm text-muted-foreground">Coming soon...</p>
      </div>
    </Card>
  );
};