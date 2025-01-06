import React from "react";
import { Sun, Wind } from "lucide-react";
import { Handle, Position } from '@xyflow/react';
import { FlowNodeData } from '@/types/flowComponents';

interface SourceNodeProps {
  data: FlowNodeData;
}

const SourceNode: React.FC<SourceNodeProps> = ({ data }) => {
  // Determine if it's a solar array based on the label
  const isSolar = data.label?.toLowerCase().includes('solar');
  const Icon = isSolar ? Sun : Wind;
  const bgColor = isSolar ? "bg-yellow-50" : "bg-blue-50";
  const iconColor = isSolar ? "text-yellow-500" : "text-blue-500";
  
  return (
    <div className={`flex flex-col items-center p-4 ${bgColor} rounded-lg border border-gray-200`}>
      <Handle type="source" position={Position.Right} />
      <div className="flex flex-col items-center gap-2">
        <Icon className={`w-8 h-8 ${iconColor}`} />
        <span className="text-sm font-medium">{data.label}</span>
        <span className="text-xs text-muted-foreground">
          {data.specs?.output || 0} kW / {data.specs?.capacity || 0} kW
        </span>
      </div>
    </div>
  );
};

export default SourceNode;