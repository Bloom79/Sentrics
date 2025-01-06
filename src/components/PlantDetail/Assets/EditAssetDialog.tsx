import React from "react";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SolarAsset, WindAsset } from "@/types/site";
import { EditAssetForm } from "./EditAssetForm";

interface EditAssetDialogProps {
  asset: SolarAsset | WindAsset;
  onEdit: (asset: SolarAsset | WindAsset) => void;
}

export const EditAssetDialog = ({ asset, onEdit }: EditAssetDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Pencil className="h-4 w-4 mr-2" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Asset</DialogTitle>
          <DialogDescription>
            Make changes to the asset information below.
          </DialogDescription>
        </DialogHeader>
        <EditAssetForm asset={asset} onSubmit={onEdit} />
      </DialogContent>
    </Dialog>
  );
};