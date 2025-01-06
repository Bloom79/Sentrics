import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Battery } from 'lucide-react';
import { FlowNodeData } from '@/types/flowComponents';

interface StorageNodeProps {
  data: FlowNodeData;
}

const StorageNode: React.FC<StorageNodeProps> = ({ data }) => {
  const chargePercentage = data.specs?.currentCharge && data.specs?.maxCapacity 
    ? (data.specs.currentCharge / data.specs.maxCapacity) * 100 
    : 0;

  return (
    <div className="flex flex-col items-center p-4 bg-white rounded-lg border border-gray-200">
      <Handle type="target" position={Position.Left} />
      <div className="flex flex-col items-center gap-2">
        <Battery className="w-8 h-8 text-green-500" />
        <span className="text-sm font-medium">{data.label}</span>
        <span className="text-xs text-muted-foreground">
          {chargePercentage.toFixed(1)}% Charged
        </span>
      </div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
};

export default StorageNode;