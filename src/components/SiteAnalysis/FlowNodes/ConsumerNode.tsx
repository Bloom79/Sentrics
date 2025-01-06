import React from "react";
import { Users, Factory, Building2 } from "lucide-react";
import StyledFlowNode from "./StyledFlowNode";

interface ConsumerNodeProps {
  data: {
    type: "residential" | "industrial" | "commercial";
    consumption: number;
    onNodeClick: (id: string, type: string) => void;
  };
  id: string;
}

const ConsumerNode: React.FC<ConsumerNodeProps> = ({ data, id }) => {
  const getIcon = () => {
    switch (data.type) {
      case "residential":
        return <Users className="w-8 h-8 text-green-500" />;
      case "industrial":
        return <Factory className="w-8 h-8 text-green-500" />;
      case "commercial":
        return <Building2 className="w-8 h-8 text-green-500" />;
    }
  };

  const getLabel = () => {
    switch (data.type) {
      case "residential":
        return "Residential";
      case "industrial":
        return "Industrial";
      case "commercial":
        return "Commercial";
    }
  };

  return (
    <StyledFlowNode 
      type="target" 
      className="bg-green-50 min-w-[120px]"
      onClick={() => data.onNodeClick(id, 'consumer')}
    >
      <div className="flex flex-col items-center gap-2">
        {getIcon()}
        <div className="text-sm font-medium">{getLabel()}</div>
        <div className="text-xs text-muted-foreground">
          {data.consumption} kW
        </div>
      </div>
    </StyledFlowNode>
  );
};

export default ConsumerNode;