import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Battery, Zap } from "lucide-react";

interface EdgeDialogProps {
  open: boolean;
  onClose: () => void;
  edgeData: {
    id: string;
    source: string;
    target: string;
    energyFlow: number;
    efficiency: number;
    status: 'active' | 'inactive';
  };
}

const EdgeDialog: React.FC<EdgeDialogProps> = ({ open, onClose, edgeData }) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Energy Transfer Details
          </DialogTitle>
          <DialogDescription>
            Connection from {edgeData.source} to {edgeData.target}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium mb-1">Energy Flow</p>
              <p className="text-2xl font-bold">{edgeData.energyFlow} kW</p>
            </div>
            <div>
              <p className="text-sm font-medium mb-1">Efficiency</p>
              <p className="text-2xl font-bold">{edgeData.efficiency}%</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              edgeData.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
            }`} />
            <span className="text-sm capitalize">{edgeData.status}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EdgeDialog;