import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ContractForm } from "./ContractForm";
import { useParams } from "react-router-dom";

export const AddContractDialog = () => {
  const [open, setOpen] = React.useState(false);
  const { consumerId } = useParams();

  if (!consumerId) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Contract
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Contract</DialogTitle>
        </DialogHeader>
        <ContractForm consumerId={consumerId} onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};