import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { AlertTriangle, Zap, AlertOctagon, Gauge } from "lucide-react";
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
    losses?: {
      type: string;
      value: number;
    }[];
  };
}

const EdgeDialog: React.FC<EdgeDialogProps> = ({ open, onClose, edgeData }) => {
  const totalLosses = edgeData.losses?.reduce((acc, loss) => acc + loss.value, 0) || 0;
  
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
              <div className="flex items-center gap-2">
                <Gauge className="w-4 h-4" />
                <p className="text-2xl font-bold">{edgeData.efficiency}%</p>
              </div>
            </div>
          </div>

          {edgeData.losses && edgeData.losses.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Energy Losses</p>
              <div className="bg-muted p-3 rounded-lg space-y-2">
                {edgeData.losses.map((loss, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>{loss.type}:</span>
                    <span className="font-medium">{loss.value.toFixed(2)} kW</span>
                  </div>
                ))}
                <div className="border-t pt-2 mt-2 flex justify-between text-sm font-medium">
                  <span>Total Losses:</span>
                  <span className="text-destructive">{totalLosses.toFixed(2)} kW</span>
                </div>
              </div>
            </div>
          )}

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
                <Alert key={index} variant={fault.type === 'error' ? 'destructive' : 'default'}>
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