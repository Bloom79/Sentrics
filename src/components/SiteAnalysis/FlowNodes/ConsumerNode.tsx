import React from "react";
import { Users, Factory, Building2, Power } from "lucide-react";
import StyledFlowNode from "./StyledFlowNode";
import { FlowNodeData } from "@/types/flowComponents";

const ConsumerNode: React.FC<{ data: FlowNodeData }> = ({ data }) => {
  const getIcon = () => {
    switch (data.type) {
      case "residential":
        return <Users className="w-8 h-8 text-green-500" />;
      case "industrial":
        return <Factory className="w-8 h-8 text-green-500" />;
      case "commercial":
        return <Building2 className="w-8 h-8 text-green-500" />;
      default:
        return <Factory className="w-8 h-8 text-green-500" />;
    }
  };

  return (
    <StyledFlowNode 
      type="target" 
      className="bg-green-50 min-w-[140px]"
      onClick={() => data.onNodeClick(data.id, 'consumer')}
    >
      <div className="flex flex-col items-center gap-2">
        <div className="relative">
          {getIcon()}
          {data.consumption && data.consumption > 500 && (
            <Power className="w-4 h-4 text-yellow-500 absolute -top-1 -right-1" />
          )}
        </div>
        <div className="text-sm font-medium">{data.label}</div>
        {data.consumption && (
          <div className="grid grid-cols-1 gap-1 text-[10px] text-muted-foreground">
            <span>Current: {data.consumption} kW</span>
            <span>Type: {data.type}</span>
          </div>
        )}
      </div>
    </StyledFlowNode>
  );
};

export default ConsumerNode;