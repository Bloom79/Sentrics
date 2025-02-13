import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Pencil, Trash2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { FlowNodeData } from '@/types/flowComponents';
import { Node } from '@xyflow/react';

interface NodeDetailsSidebarProps {
  node: Node<FlowNodeData>;
  onClose: () => void;
  onDelete: (nodeId: string) => void;
}

export const NodeDetailsSidebar: React.FC<NodeDetailsSidebarProps> = ({
  node,
  onClose,
  onDelete,
}) => {
  const navigate = useNavigate();

  const handleEdit = () => {
    // Navigate to the asset detail page
    navigate(`/assets/${node.id}`);
  };

  return (
    <Card className="absolute right-4 top-4 w-80 p-4 z-20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium text-lg">{node.data.label}</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="h-[calc(100vh-32rem)]">
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Type</h4>
            <p className="text-sm text-muted-foreground capitalize">
              {node.data.type.replace('-', ' ')}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">Status</h4>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                node.data.status === 'active' ? 'bg-green-500' : 'bg-red-500'
              }`} />
              <span className="text-sm text-muted-foreground capitalize">
                {node.data.status}
              </span>
            </div>
          </div>

          {Object.entries(node.data.specs || {}).length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">Specifications</h4>
              <div className="space-y-2">
                {Object.entries(node.data.specs).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-sm text-muted-foreground capitalize">
                      {key.replace('_', ' ')}
                    </span>
                    <span className="text-sm font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="flex justify-between mt-4 pt-4 border-t">
        <Button
          variant="outline"
          size="sm"
          onClick={handleEdit}
          className="flex items-center gap-2"
        >
          <Pencil className="w-4 h-4" />
          Edit
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(node.id)}
          className="flex items-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Delete
        </Button>
      </div>
    </Card>
  );
}; 