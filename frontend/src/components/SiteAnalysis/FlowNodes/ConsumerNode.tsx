import React, { forwardRef } from "react";
import { Users, Factory, Building2, Power } from "lucide-react";
import StyledFlowNode from "./StyledFlowNode";
import { FlowNodeData } from "@/types/flowComponents";
import NodeTooltip from "./NodeTooltip";

interface ConsumerNodeProps {
  data: FlowNodeData;
}

const ConsumerNode = forwardRef<HTMLDivElement, ConsumerNodeProps>(({ data }, ref) => {
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

  const tooltipContent = (
    <div>
      <h4 className="font-medium mb-2">{data.label} Details</h4>
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        <div>
          <p className="text-muted-foreground">Peak Demand</p>
          <p>{data.specs?.peakDemand || 0} kW</p>
        </div>
        <div>
          <p className="text-muted-foreground">Daily Usage</p>
          <p>{data.specs?.dailyUsage || 0} kWh</p>
        </div>
        <div>
          <p className="text-muted-foreground">Power Factor</p>
          <p>{data.specs?.powerFactor || 0}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Connection Type</p>
          <p className="capitalize">{data.specs?.connectionType || "N/A"}</p>
        </div>
      </div>
    </div>
  );

  return (
    <NodeTooltip tooltipContent={tooltipContent}>
      <StyledFlowNode 
        ref={ref}
        type="target" 
        className="bg-green-50 min-w-[140px]"
        onClick={() => data.onNodeClick?.(data.id, 'consumer')}
      >
        <div className="flex flex-col items-center gap-2">
          {getIcon()}
          <span className="text-sm font-medium">{data.label}</span>
          <span className="text-sm font-bold text-muted-foreground">
            {data.specs?.consumption || 0} kW
          </span>
        </div>
      </StyledFlowNode>
    </NodeTooltip>
  );
});

ConsumerNode.displayName = "ConsumerNode";

export default ConsumerNode;