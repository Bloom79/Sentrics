import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { AlertTriangle, Zap, AlertOctagon } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface EdgeDialogProps {
  open: boolean;
  onClose: () => void;
  edgeData: {
    id: string;
    source: string;
    target: string;
    energyFlow: number;
    efficiency: number;
    status: 'active' | 'inactive' | 'error';
    faults?: {
      type: 'warning' | 'error';
      message: string;
    }[];
  };
}

const EdgeDialog: React.FC<EdgeDialogProps> = ({ open, onClose, edgeData }) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {edgeData.status === 'error' ? (
              <AlertOctagon className="w-5 h-5 text-red-500" />
            ) : (
              <Zap className="w-5 h-5" />
            )}
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
              edgeData.status === 'active' ? 'bg-green-500' : 
              edgeData.status === 'error' ? 'bg-red-500' : 'bg-gray-400'
            }`} />
            <span className="text-sm capitalize">{edgeData.status}</span>
          </div>

          {edgeData.faults && edgeData.faults.length > 0 && (
            <div className="space-y-2">
              {edgeData.faults.map((fault, index) => (
                <Alert key={index} variant={fault.type === 'error' ? 'destructive' : 'warning'}>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{fault.message}</AlertDescription>
                </Alert>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EdgeDialog;