import React from "react";
import { Cable, Zap } from "lucide-react";
import StyledFlowNode from "./StyledFlowNode";
import { FlowNodeData } from "@/types/flowComponents";

const TransformerNode: React.FC<{ data: FlowNodeData }> = ({ data }) => {
  return (
    <StyledFlowNode 
      type="both" 
      className="bg-indigo-50 min-w-[140px]"
      onClick={() => data.onNodeClick(data.id, 'transformer')}
    >
      <div className="flex flex-col items-center gap-2">
        <div className="relative">
          <Cable className="w-8 h-8 text-indigo-500" />
          {data.status === 'active' && (
            <Zap className="w-4 h-4 text-green-500 absolute -top-1 -right-1" />
          )}
        </div>
        <div className="text-sm font-medium">{data.label}</div>
        {data.specs && (
          <div className="grid grid-cols-2 gap-x-3 text-[10px] text-muted-foreground">
            <span>In: {data.specs.voltage}V</span>
            <span>Out: {data.specs.power}V</span>
            <span>Load: {data.specs.current}A</span>
            <span>Eff: {data.specs.efficiency}%</span>
          </div>
        )}
      </div>
    </StyledFlowNode>
  );
};

export default TransformerNode;