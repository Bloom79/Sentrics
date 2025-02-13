import React from "react";
import { Sun, Wind } from "lucide-react";
import { Handle, Position } from '@xyflow/react';
import { FlowNodeData } from '@/types/flowComponents';
import NodeTooltip from "./NodeTooltip";

interface SourceNodeProps {
  data: FlowNodeData;
}

const SourceNode: React.FC<SourceNodeProps> = ({ data }) => {
  const isSolar = data.label?.toLowerCase().includes('solar');
  const Icon = isSolar ? Sun : Wind;
  const bgColor = isSolar ? "bg-yellow-50" : "bg-blue-50";
  const iconColor = isSolar ? "text-yellow-500" : "text-blue-500";
  
  const tooltipContent = (
    <div>
      <h4 className="font-medium mb-2">{data.label} Details</h4>
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        <div>
          <p className="text-muted-foreground">Capacity</p>
          <p>{data.specs?.capacity || 0} kW</p>
        </div>
        <div>
          <p className="text-muted-foreground">Efficiency</p>
          <p>{data.specs?.efficiency || 0}%</p>
        </div>
        <div>
          <p className="text-muted-foreground">Temperature</p>
          <p>{data.specs?.temperature || 0}°C</p>
        </div>
        <div>
          <p className="text-muted-foreground">Status</p>
          <p className="capitalize">{data.status}</p>
        </div>
      </div>
    </div>
  );
  
  return (
    <NodeTooltip tooltipContent={tooltipContent}>
      <div className={`flex flex-col items-center p-4 ${bgColor} rounded-lg border border-gray-200`}>
        <Handle type="source" position={Position.Right} />
        <div className="flex flex-col items-center gap-2">
          <Icon className={`w-8 h-8 ${iconColor}`} />
          <span className="text-sm font-medium">{data.label}</span>
          <span className="text-sm font-bold text-muted-foreground">
            {data.specs?.power || 0} kW
          </span>
        </div>
      </div>
    </NodeTooltip>
  );
};

export default SourceNode;