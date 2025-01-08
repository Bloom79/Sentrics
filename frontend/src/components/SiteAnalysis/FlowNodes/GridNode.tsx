import React from "react";
import { CircuitBoard } from "lucide-react";
import StyledFlowNode from "./StyledFlowNode";

interface GridNodeProps {
  data: {
    delivery: number;
    onNodeClick: (id: string, type: string) => void;
  };
  id: string;
}

const GridNode: React.FC<GridNodeProps> = ({ data, id }) => {
  return (
    <StyledFlowNode 
      type="both" 
      className="bg-red-50 min-w-[120px]"
      onClick={() => data.onNodeClick(id, 'grid')}
    >
      <div className="flex flex-col items-center gap-2">
        <CircuitBoard className="w-8 h-8 text-red-500" />
        <div className="text-sm font-medium">Power Grid</div>
        <div className="text-xs text-muted-foreground">
          {data.delivery} kW
        </div>
      </div>
    </StyledFlowNode>
  );
};

export default GridNode;