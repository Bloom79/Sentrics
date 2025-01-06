import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Battery, Factory, Building2, Users, CircuitBoard, Zap, Cable, Sun } from "lucide-react";

interface NodeDialogProps {
  open: boolean;
  onClose: () => void;
  nodeType: string;
  nodeId: string;
}

const NodeDialog: React.FC<NodeDialogProps> = ({ open, onClose, nodeType, nodeId }) => {
  const getDialogContent = () => {
    switch (nodeType) {
      case 'cell':
        return (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Sun className="w-5 h-5" />
                Solar Cell Details
              </DialogTitle>
              <DialogDescription>
                Individual solar cell specifications and performance
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Voltage</p>
                  <p className="text-sm text-muted-foreground">0.6V</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Current</p>
                  <p className="text-sm text-muted-foreground">8A</p>
                </div>
              </div>
            </div>
          </>
        );

      case 'string':
        return (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CircuitBoard className="w-5 h-5" />
                String Details
              </DialogTitle>
              <DialogDescription>
                Solar cell string specifications and performance
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Total Voltage</p>
                  <p className="text-sm text-muted-foreground">1.8V</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Current</p>
                  <p className="text-sm text-muted-foreground">8A</p>
                </div>
              </div>
            </div>
          </>
        );

      case 'inverter':
        return (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Inverter Details
              </DialogTitle>
              <DialogDescription>
                DC to AC conversion specifications
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Efficiency</p>
                  <p className="text-sm text-muted-foreground">98%</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Status</p>
                  <p className="text-sm text-muted-foreground">Active</p>
                </div>
              </div>
            </div>
          </>
        );

      case 'transformer':
        return (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Cable className="w-5 h-5" />
                Transformer Details
              </DialogTitle>
              <DialogDescription>
                Voltage transformation specifications
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Output Voltage</p>
                  <p className="text-sm text-muted-foreground">400V</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Efficiency</p>
                  <p className="text-sm text-muted-foreground">95%</p>
                </div>
              </div>
            </div>
          </>
        );

      case 'storage':
        return (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Battery className="w-5 h-5" />
                Storage Unit Details
              </DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              <p>Details about the storage unit...</p>
            </div>
          </>
        );

      case 'grid':
        return (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CircuitBoard className="w-5 h-5" />
                Power Grid Details
              </DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              <p>Grid connection and power flow details...</p>
            </div>
          </>
        );

      case 'consumer':
        return (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Factory className="w-5 h-5" />
                Consumer Details
              </DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              <p>Consumption details for {nodeId} consumer...</p>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        {getDialogContent()}
      </DialogContent>
    </Dialog>
  );
};

export default NodeDialog;
