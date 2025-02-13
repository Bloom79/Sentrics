import React from "react";
import { Plant, Asset } from "@/types/site";
import { EditAssetForm } from "./EditAssetForm";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

interface EditTabProps {
  plant: Plant;
  asset: Asset;
}

export const EditTab = ({ plant, asset }: EditTabProps) => {
  const router = useRouter();
  const { toast } = useToast();

  const handleSuccess = () => {
    toast({
      title: "Success",
      description: "Asset updated successfully",
    });
    router.push(`/plants/${plant.id}/assets/${asset.id}`);
  };

  const handleCancel = () => {
    router.push(`/plants/${plant.id}/assets/${asset.id}`);
  };

  return (
    <div className="container py-6">
      <EditAssetForm 
        plant={plant} 
        asset={asset} 
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </div>
  );
}; 