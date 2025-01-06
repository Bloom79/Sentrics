import React from "react";
import { Users, Factory, Building2 } from "lucide-react";
import StyledFlowNode from "./StyledFlowNode";
import { FlowNodeData } from "@/types/flowComponents";

const ConsumerNode: React.FC<{ data: FlowNodeData }> = ({ data }) => {
  const getIcon = () => {
    switch (data.type) {
      case "residential":
        return <Users className="w-6 h-6 text-green-500" />;
      case "industrial":
        return <Factory className="w-6 h-6 text-green-500" />;
      case "commercial":
        return <Building2 className="w-6 h-6 text-green-500" />;
      default:
        return <Factory className="w-6 h-6 text-green-500" />;
    }
  };

  return (
    <StyledFlowNode 
      type="target" 
      className="bg-green-50 min-w-[120px]"
      onClick={() => data.onNodeClick(data.id, 'consumer')}
    >
      <div className="flex flex-col items-center gap-2">
        {getIcon()}
        <div className="text-xs font-medium">{data.label}</div>
        {data.consumption && (
          <div className="text-[10px] text-muted-foreground">
            {data.consumption} kW
          </div>
        )}
      </div>
    </StyledFlowNode>
  );
};

export default ConsumerNode;