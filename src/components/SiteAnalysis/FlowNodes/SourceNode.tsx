import React from "react";
import { Sun, Wind } from "lucide-react";
import StyledFlowNode from "./StyledFlowNode";

interface SourceNodeProps {
  data: {
    type: "solar" | "eolic";
    output: number;
    capacity: number;
    onNodeClick: (id: string, type: string) => void;
  };
  id: string;
}

const SourceNode: React.FC<SourceNodeProps> = ({ data, id }) => {
  const Icon = data.type === "solar" ? Sun : Wind;
  const bgColor = data.type === "solar" ? "bg-yellow-50" : "bg-blue-50";
  const iconColor = data.type === "solar" ? "text-yellow-500" : "text-blue-500";
  
  return (
    <StyledFlowNode 
      type="source" 
      className={`${bgColor} min-w-[120px]`}
      onClick={() => data.onNodeClick(id, 'source')}
    >
      <div className="flex flex-col items-center gap-2">
        <Icon className={`w-8 h-8 ${iconColor}`} />
        <div className="text-sm font-medium">
          {data.type === "solar" ? "Solar Array" : "Wind Farm"}
        </div>
        <div className="text-xs text-muted-foreground">
          {data.output} kW / {data.capacity} kW
        </div>
      </div>
    </StyledFlowNode>
  );
};

export default SourceNode;