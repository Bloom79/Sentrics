import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Wind } from 'lucide-react';
import { FlowNodeData } from '@/types/flowComponents';
import { BaseNode } from './BaseNode';

const WindTurbineNode: React.FC<{ data: FlowNodeData }> = ({ data }) => {
  return (
    <BaseNode data={data} icon={<Wind className="w-5 h-5 text-blue-500" />}>
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className="w-3 h-3 bg-blue-500"
      />
    </BaseNode>
  );
};

export default WindTurbineNode; 