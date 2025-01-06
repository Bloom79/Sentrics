import React from "react";
import { Sun, Zap } from "lucide-react";
import StyledFlowNode from "./StyledFlowNode";
import { FlowNodeData } from "@/types/flowComponents";

const CellNode: React.FC<{ data: FlowNodeData }> = ({ data }) => {
  return (
    <StyledFlowNode 
      type="source" 
      className="bg-yellow-50 min-w-[120px]"
      onClick={() => data.onNodeClick(data.id, 'cell')}
    >
      <div className="flex flex-col items-center gap-2">
        <div className="relative">
          <Sun className="w-8 h-8 text-yellow-500" />
          {data.status === 'active' && (
            <Zap className="w-4 h-4 text-green-500 absolute -top-1 -right-1" />
          )}
        </div>
        <div className="text-sm font-medium">{data.label}</div>
        {data.specs && (
          <div className="grid grid-cols-2 gap-x-3 text-[10px] text-muted-foreground">
            <span>{data.specs.voltage}V</span>
            <span>{data.specs.current}A</span>
            <span>{data.specs.power}W</span>
            <span>{Math.round(data.specs.efficiency || 0)}%</span>
          </div>
        )}
      </div>
    </StyledFlowNode>
  );
};

export default CellNode;