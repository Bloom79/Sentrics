import React from "react";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Asset } from "@/types/site";

interface EditAssetDialogProps {
  asset: Asset;
}

export const EditAssetDialog = ({ asset }: EditAssetDialogProps) => {
  const navigate = useNavigate();

  const handleEditClick = () => {
    navigate(`/assets/${asset.id}?tab=edit`);
  };

  return (
    <Button variant="outline" size="sm" onClick={handleEditClick}>
      <Pencil className="h-4 w-4 mr-2" />
      Edit
    </Button>
  );
};