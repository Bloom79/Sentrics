import React from "react";
import { Power } from "lucide-react";
import StyledFlowNode from "./StyledFlowNode";

interface GridNodeProps {
  data: {
    delivery: number;
    onNodeClick: (id: string, type: string) => void;
  };
}

const GridNode: React.FC<GridNodeProps> = ({ data }) => {
  return (
    <StyledFlowNode 
      type="both" 
      className="bg-red-50 min-w-[120px]"
      onClick={() => data.onNodeClick('grid', 'grid')}
    >
      <div className="flex flex-col items-center gap-2">
        <Power className="w-8 h-8 text-red-500" />
        <div className="text-sm font-medium">Power Grid</div>
        <div className="text-xs text-muted-foreground">
          {data.delivery} kW
        </div>
      </div>
    </StyledFlowNode>
  );
};

export default GridNode;