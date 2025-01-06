import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Battery, Factory, Building2, Users, CircuitBoard } from "lucide-react";
import BatteryDetails from "./BatteryDetails";

interface NodeDialogProps {
  open: boolean;
  onClose: () => void;
  nodeType: string;
  nodeId: string;
}

const NodeDialog: React.FC<NodeDialogProps> = ({ open, onClose, nodeType, nodeId }) => {
  const getDialogContent = () => {
    switch (nodeType) {
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
              <BatteryDetails
                battery={{
                  id: nodeId,
                  name: `Storage Unit ${nodeId}`,
                  batteryLevel: 85,
                  direction: "charging",
                  currentPower: 45,
                  timeRemaining: "2h 30m",
                  temperature: 25,
                  voltage: 400,
                  current: 112.5,
                }}
              />
            </div>
          </>
        );
      case 'consumer':
        const ConsumerIcon = {
          residential: Users,
          industrial: Factory,
          commercial: Building2,
        }[nodeId] || Users;
        
        return (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <ConsumerIcon className="w-5 h-5" />
                Consumer Details
              </DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              <p>Consumption details for {nodeId} consumer...</p>
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