import React from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { LeafyGreen, Battery, Home, Power } from "lucide-react";
import { Site } from "@/types/site";

interface EnergyFlowVisualizationProps {
  site: Site;
}

const EnergyFlowVisualization: React.FC<EnergyFlowVisualizationProps> = ({ site }) => {
  const navigate = useNavigate();

  const handleStorageClick = (unitId: string) => {
    navigate(`/storage-unit/${unitId}`);
  };

  return (
    <div className="relative h-[300px] bg-background/50 rounded-lg p-6 border">
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Plant Section */}
        <div className="absolute left-16 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <div className="p-4 bg-green-100 dark:bg-green-900 rounded-full hover:scale-110 transition-transform cursor-pointer">
                <LeafyGreen className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Energy Production</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {site.energySources.map(source => (
                  <div key={source.id} className="space-y-2">
                    <h4 className="font-medium capitalize">{source.type} Plant</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Capacity</p>
                        <p>{source.capacity} kW</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Current Output</p>
                        <p>{source.currentOutput} kW</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Status</p>
                        <p className="capitalize">{source.status}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>
          <span className="text-sm font-medium">Production</span>
        </div>

        {/* Storage Section */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <div 
                className="p-4 bg-blue-100 dark:bg-blue-900 rounded-full hover:scale-110 transition-transform cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  if (site.storageUnits[0]) {
                    handleStorageClick(site.storageUnits[0].id);
                  }
                }}
              >
                <Battery className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Storage System</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {site.storageUnits.map(unit => (
                  <div key={unit.id} className="space-y-2">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Capacity</p>
                        <p>{unit.capacity} kWh</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Current Charge</p>
                        <p>{unit.currentCharge} kWh</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Status</p>
                        <p className="capitalize">{unit.status}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Health</p>
                        <p>{unit.health}%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>
          <span className="text-sm font-medium">Storage</span>
        </div>

        {/* Consumer/Grid Section */}
        <div className="absolute right-16 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <div className="p-4 bg-red-100 dark:bg-red-900 rounded-full hover:scale-110 transition-transform cursor-pointer">
                <Power className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Grid Connection</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Status</p>
                    <p className="capitalize">{site.gridConnection.status}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Frequency</p>
                    <p>{site.gridConnection.frequency} Hz</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Voltage</p>
                    <p>{site.gridConnection.voltage} V</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Congestion</p>
                    <p>{site.gridConnection.congestionLevel}</p>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <span className="text-sm font-medium">Grid</span>
        </div>

        {/* Connection Lines */}
        <div className="absolute inset-0">
          {/* Plant to Storage Line */}
          <div className="absolute left-36 top-1/2 w-[calc(50%-144px)] h-0.5 bg-gradient-to-r from-green-500 to-blue-500">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-blue-500 animate-flow-right" />
          </div>
          
          {/* Storage to Grid Line */}
          <div className="absolute right-36 top-1/2 w-[calc(50%-144px)] h-0.5 bg-gradient-to-r from-blue-500 to-red-500">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-red-500 animate-flow-right" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnergyFlowVisualization;