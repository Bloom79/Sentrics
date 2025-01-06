import React, { DragEvent } from 'react';
import { Sun, Wind, Battery, Factory, Grid } from 'lucide-react';
import { Card } from '@/components/ui/card';

const paletteItems = [
  { type: 'source', label: 'Solar Array', icon: Sun },
  { type: 'source', label: 'Wind Farm', icon: Wind },
  { type: 'storage', label: 'Storage', icon: Battery },
  { type: 'consumer', label: 'Consumer', icon: Factory },
  { type: 'grid', label: 'Grid', icon: Grid },
];

interface NodePaletteProps {
  onDragStart: (event: DragEvent, nodeType: string) => void;
}

const NodePalette: React.FC<NodePaletteProps> = ({ onDragStart }) => {
  return (
    <Card className="absolute left-4 top-20 z-10 p-4">
      <h3 className="text-sm font-medium mb-2">Components</h3>
      <div className="flex flex-col gap-2">
        {paletteItems.map((item) => (
          <div
            key={`${item.type}-${item.label}`}
            className="flex items-center gap-2 p-2 border rounded cursor-move hover:bg-accent"
            draggable
            onDragStart={(event) => onDragStart(event, item.type)}
          >
            <item.icon className="w-4 h-4" />
            <span className="text-sm">{item.label}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default NodePalette;