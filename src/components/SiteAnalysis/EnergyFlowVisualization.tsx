import React from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LeafyGreen, Battery, Power, Sun, Wind } from "lucide-react";
import { Site } from "@/types/site";

interface EnergyFlowVisualizationProps {
  site: Site;
}

const EnergyFlowVisualization: React.FC<EnergyFlowVisualizationProps> = ({ site }) => {
  const navigate = useNavigate();

  const handleStorageClick = (unitId: string) => {
    navigate(`/storage-unit/${unitId}`);
  };

  const solarSources = site.energySources.filter(source => source.type === "solar");
  const windSources = site.energySources.filter(source => source.type === "eolic");

  return (
    <div className="relative h-[300px] bg-background/50 rounded-lg p-6 border">
      <div className="absolute inset-0 flex items-center justify-between px-16">
        {/* Production Plants Section */}
        <div className="flex flex-col items-center gap-6">
          <span className="text-sm font-medium">Production</span>
          <div className="space-y-4">
            {solarSources.map((source) => (
              <Dialog key={source.id}>
                <Button
                  variant="outline"
                  className="w-full bg-green-100 hover:bg-green-200 dark:bg-green-900 dark:hover:bg-green-800 border-0"
                >
                  <Sun className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                </Button>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Solar Plant Details</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
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
                </DialogContent>
              </Dialog>
            ))}
            {windSources.map((source) => (
              <Dialog key={source.id}>
                <Button
                  variant="outline"
                  className="w-full bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 border-0"
                >
                  <Wind className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </Button>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Wind Plant Details</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
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
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </div>

        {/* Storage Section */}
        <div className="flex flex-col items-center gap-4">
          <span className="text-sm font-medium">Storage</span>
          <div className="space-y-4">
            {site.storageUnits.map((unit) => (
              <Dialog key={unit.id}>
                <Button
                  variant="outline"
                  className="w-full bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-900 dark:hover:bg-indigo-800 border-0"
                  onClick={(e) => {
                    e.preventDefault();
                    handleStorageClick(unit.id);
                  }}
                >
                  <Battery className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </Button>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Storage Unit Details</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
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
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </div>

        {/* Grid Section */}
        <div className="flex flex-col items-center gap-4">
          <span className="text-sm font-medium">Grid</span>
          <Dialog>
            <Button
              variant="outline"
              className="w-full bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800 border-0"
            >
              <Power className="w-6 h-6 text-red-600 dark:text-red-400" />
            </Button>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Grid Connection Details</DialogTitle>
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
        </div>

        {/* Connection Lines */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Plant to Storage Line */}
          <div className="absolute left-[25%] top-1/2 w-[25%] h-0.5 bg-gradient-to-r from-green-500 to-blue-500">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-blue-500 animate-flow-right" />
          </div>
          
          {/* Storage to Grid Line */}
          <div className="absolute right-[25%] top-1/2 w-[25%] h-0.5 bg-gradient-to-r from-blue-500 to-red-500">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-red-500 animate-flow-right" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnergyFlowVisualization;