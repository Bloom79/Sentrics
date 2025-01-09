import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { AddAssetForm } from "./AddAssetForm";
import { Plant } from "@/types/site";

interface AddAssetDialogProps {
  plant: Plant;
}

export const AddAssetDialog = ({ plant }: AddAssetDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Asset
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Asset</DialogTitle>
          <DialogDescription>
            Add a new asset to {plant.name}
          </DialogDescription>
        </DialogHeader>
        <AddAssetForm plant={plant} />
      </DialogContent>
    </Dialog>
  );
};