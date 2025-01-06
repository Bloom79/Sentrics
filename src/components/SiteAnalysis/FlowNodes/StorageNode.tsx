import React from "react";
import { Battery } from "lucide-react";
import StyledFlowNode from "./StyledFlowNode";

interface StorageNodeProps {
  data: {
    id: string;
    charge: number;
    capacity: number;
    onNodeClick: (id: string, type: string) => void;
  };
}

const StorageNode: React.FC<StorageNodeProps> = ({ data }) => {
  return (
    <StyledFlowNode 
      type="both" 
      className="bg-purple-50 min-w-[120px]" 
      onClick={() => data.onNodeClick(data.id, 'storage')}
    >
      <div className="flex flex-col items-center gap-2">
        <Battery className="w-8 h-8 text-purple-500" />
        <div className="text-sm font-medium">Storage Unit</div>
        <div className="text-xs text-muted-foreground">
          {data.charge} kWh / {data.capacity} kWh
        </div>
      </div>
    </StyledFlowNode>
  );
};

export default StorageNode;