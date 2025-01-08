import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AddAssetForm } from "./AddAssetForm";

export const AddAssetButton = ({ plantType }: { plantType: "solar" | "wind" }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Asset
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Asset</DialogTitle>
          <DialogDescription>
            Add a new {plantType === "solar" ? "solar panel or inverter" : "wind turbine"} to your plant.
          </DialogDescription>
        </DialogHeader>
        <AddAssetForm plantType={plantType} />
      </DialogContent>
    </Dialog>
  );
};