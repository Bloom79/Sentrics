import React from "react";
import { Cable } from "lucide-react";
import StyledFlowNode from "./StyledFlowNode";
import { FlowNodeData } from "@/types/flowComponents";

const TransformerNode: React.FC<{ data: FlowNodeData }> = ({ data }) => {
  return (
    <StyledFlowNode 
      type="both" 
      className="bg-indigo-50 min-w-[120px]"
      onClick={() => data.onNodeClick(data.id, 'transformer')}
    >
      <div className="flex flex-col items-center gap-2">
        <Cable className="w-6 h-6 text-indigo-500" />
        <div className="text-xs font-medium">{data.label}</div>
        {data.specs && (
          <div className="text-[10px] text-muted-foreground">
            {data.specs.voltage}V
          </div>
        )}
      </div>
    </StyledFlowNode>
  );
};

export default TransformerNode;