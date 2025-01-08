import React from "react";
import { CircuitBoard } from "lucide-react";
import StyledFlowNode from "./StyledFlowNode";
import { FlowNodeData } from "@/types/flowComponents";

const StringNode: React.FC<{ data: FlowNodeData }> = ({ data }) => {
  return (
    <StyledFlowNode 
      type="both" 
      className="bg-orange-50 min-w-[100px]"
      onClick={() => data.onNodeClick(data.id, 'string')}
    >
      <div className="flex flex-col items-center gap-2">
        <CircuitBoard className="w-6 h-6 text-orange-500" />
        <div className="text-xs font-medium">{data.label}</div>
        {data.specs && (
          <div className="text-[10px] text-muted-foreground">
            {data.specs.inputVoltage}V / {data.specs.outputPower}W
          </div>
        )}
      </div>
    </StyledFlowNode>
  );
};

export default StringNode;