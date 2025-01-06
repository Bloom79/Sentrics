import React from 'react';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { Panel } from '@xyflow/react';

interface FlowControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitView: () => void;
}

const FlowControls: React.FC<FlowControlsProps> = ({
  onZoomIn,
  onZoomOut,
  onFitView,
}) => {
  return (
    <Panel position="top-right" className="bg-background/95 p-2 rounded-lg shadow-sm border flex gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={onZoomIn}
        className="h-8 w-8"
      >
        <ZoomIn className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={onZoomOut}
        className="h-8 w-8"
      >
        <ZoomOut className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={onFitView}
        className="h-8 w-8"
      >
        <Maximize2 className="h-4 w-4" />
      </Button>
    </Panel>
  );
};

export default FlowControls;