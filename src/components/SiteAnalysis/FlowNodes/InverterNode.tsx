import React from "react";
import { Zap } from "lucide-react";
import StyledFlowNode from "./StyledFlowNode";
import { FlowNodeData } from "@/types/flowComponents";

const InverterNode: React.FC<{ data: FlowNodeData }> = ({ data }) => {
  return (
    <StyledFlowNode 
      type="both" 
      className="bg-purple-50 min-w-[120px]"
      onClick={() => data.onNodeClick(data.id, 'inverter')}
    >
      <div className="flex flex-col items-center gap-2">
        <Zap className="w-6 h-6 text-purple-500" />
        <div className="text-xs font-medium">{data.label}</div>
        {data.specs && (
          <div className="text-[10px] text-muted-foreground">
            Efficiency: {data.specs.efficiency}%
          </div>
        )}
      </div>
    </StyledFlowNode>
  );
};

export default InverterNode;