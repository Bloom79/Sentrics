import React from "react";
import { Sun } from "lucide-react";
import StyledFlowNode from "./StyledFlowNode";
import { FlowNodeData } from "@/types/flowComponents";

const CellNode: React.FC<{ data: FlowNodeData }> = ({ data }) => {
  return (
    <StyledFlowNode 
      type="source" 
      className="bg-yellow-50 min-w-[80px]"
      onClick={() => data.onNodeClick(data.id, 'cell')}
    >
      <div className="flex flex-col items-center gap-2">
        <Sun className="w-6 h-6 text-yellow-500" />
        <div className="text-xs font-medium">{data.label}</div>
        {data.specs && (
          <div className="text-[10px] text-muted-foreground">
            {data.specs.voltage}V / {data.specs.current}A
          </div>
        )}
      </div>
    </StyledFlowNode>
  );
};

export default CellNode;