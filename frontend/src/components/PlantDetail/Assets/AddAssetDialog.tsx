import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plant, AssetType } from "@/types/site";
import { AddAssetForm } from "./AddAssetForm";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface AddAssetDialogProps {
  plant: Plant;
  open: boolean;
  onClose: () => void;
  defaultAssetType?: string;
}

const AddAssetDialog: React.FC<AddAssetDialogProps> = ({
  plant,
  open,
  onClose,
  defaultAssetType
}) => {
  const { data: assetType } = useQuery({
    queryKey: ["asset_type", defaultAssetType],
    queryFn: async () => {
      if (!defaultAssetType) return null;
      const { data, error } = await supabase
        .from("asset_types")
        .select("*")
        .eq("name", defaultAssetType)
        .single();
      
      if (error) throw error;
      return data as AssetType;
    },
    enabled: !!defaultAssetType
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className={cn(
        "sm:max-w-[1200px] max-h-[90vh]",
        "bg-gradient-to-b from-background to-muted/20",
        "flex flex-col"
      )}>
        <div className="flex-1 overflow-y-auto pr-2">
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-2xl font-semibold">Add New Asset</DialogTitle>
            <DialogDescription className="text-lg">
              Add a new {defaultAssetType?.toLowerCase() || "asset"} to {plant.name}
            </DialogDescription>
          </DialogHeader>
          <AddAssetForm 
            plant={plant} 
            defaultAssetType={assetType} 
            onSuccess={() => {
              onClose();
            }} 
            onCancel={onClose}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { AddAssetDialog };