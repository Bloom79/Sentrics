import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Info } from "lucide-react";
import { Asset } from "@/types/site";

interface StringConfigDialogProps {
  open: boolean;
  onClose: () => void;
  array: Asset;
  stringNumber: number;
  availablePanels: Asset[];
  onSave: (stringNumber: number, panelIds: string[]) => void;
}

export const StringConfigDialog = ({
  open,
  onClose,
  array,
  stringNumber,
  availablePanels,
  onSave,
}: StringConfigDialogProps) => {
  const stringAssignments = array.dynamic_attributes?.string_assignments || {};
  const panelsPerString = array.dynamic_attributes?.panels_per_string || 0;
  
  // Get panels currently assigned to this string
  const assignedPanelIds = Object.entries(stringAssignments)
    .filter(([_, str]) => str === stringNumber)
    .map(([panelId]) => panelId);

  // Calculate string metrics
  const assignedPanels = availablePanels.filter(panel => assignedPanelIds.includes(panel.id));
  const totalVoltage = assignedPanels.reduce((sum, panel) => {
    const voltage = panel.dynamic_attributes?.nominal_voltage || 0;
    return sum + voltage;
  }, 0);
  const totalCurrent = assignedPanels.length > 0 
    ? assignedPanels[0].dynamic_attributes?.nominal_current || 0 
    : 0;
  const totalPower = totalVoltage * totalCurrent;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Configure String {stringNumber}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* String Metrics */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="text-sm font-medium">Voltage</div>
              <div className="mt-1 text-2xl">{totalVoltage.toFixed(1)}V</div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-sm font-medium">Current</div>
              <div className="mt-1 text-2xl">{totalCurrent.toFixed(1)}A</div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-sm font-medium">Power</div>
              <div className="mt-1 text-2xl">{totalPower.toFixed(1)}W</div>
            </div>
          </div>

          {/* Panel Assignment */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Assigned Panels</h4>
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {assignedPanels.length} / {panelsPerString} panels
                </span>
              </div>
            </div>

            <ScrollArea className="h-[300px] border rounded-lg">
              <div className="p-4 space-y-2">
                {availablePanels.map((panel) => {
                  const isAssigned = assignedPanelIds.includes(panel.id);
                  return (
                    <div
                      key={panel.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <div className="font-medium">{panel.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {panel.manufacturer} - {panel.model} ({panel.rated_power}W)
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={isAssigned ? "default" : "outline"}>
                          {isAssigned ? "Assigned" : "Available"}
                        </Badge>
                        <Button
                          variant={isAssigned ? "destructive" : "default"}
                          size="sm"
                          onClick={() => {
                            const newAssignedPanels = isAssigned
                              ? assignedPanelIds.filter(id => id !== panel.id)
                              : [...assignedPanelIds, panel.id];
                            onSave(stringNumber, newAssignedPanels);
                          }}
                        >
                          {isAssigned ? "Remove" : "Add"}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 