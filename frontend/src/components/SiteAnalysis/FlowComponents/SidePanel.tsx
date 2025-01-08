import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Battery, Sun, Wind, Factory, Grid, Zap, Cable } from "lucide-react";
import { FlowNodeData } from "@/types/flowComponents";

interface SidePanelProps {
  open: boolean;
  onClose: () => void;
  nodeData?: FlowNodeData;
}

const SidePanel: React.FC<SidePanelProps> = ({ open, onClose, nodeData }) => {
  if (!nodeData) return null;

  const getIcon = () => {
    switch (nodeData.type) {
      case 'source':
        return nodeData.label?.toLowerCase().includes('solar') ? 
          <Sun className="h-6 w-6" /> : 
          <Wind className="h-6 w-6" />;
      case 'storage':
        return <Battery className="h-6 w-6" />;
      case 'consumer':
        return <Factory className="h-6 w-6" />;
      case 'grid':
        return <Grid className="h-6 w-6" />;
      case 'inverter':
        return <Zap className="h-6 w-6" />;
      case 'transformer':
        return <Cable className="h-6 w-6" />;
      default:
        return null;
    }
  };

  const renderSpecs = () => {
    if (!nodeData.specs) return null;

    return (
      <div className="grid grid-cols-2 gap-4 mt-4">
        {Object.entries(nodeData.specs).map(([key, value]) => (
          <div key={key} className="space-y-1">
            <p className="text-sm font-medium capitalize">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </p>
            <p className="text-sm text-muted-foreground">
              {typeof value === 'number' ? 
                value % 1 === 0 ? value : value.toFixed(2) : 
                value}
            </p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader className="space-y-4">
          <div className="flex items-center gap-3">
            {getIcon()}
            <SheetTitle>{nodeData.label}</SheetTitle>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded-full text-xs ${
              nodeData.status === 'active' ? 
                'bg-green-100 text-green-800' : 
                'bg-yellow-100 text-yellow-800'
            }`}>
              {nodeData.status}
            </span>
          </div>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-8rem)] mt-6">
          {renderSpecs()}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default SidePanel;