import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Monitor } from 'lucide-react';
import { FlowNodeData } from '@/types/flowComponents';
import { BaseNode } from './BaseNode';

const SCADANode: React.FC<{ data: FlowNodeData }> = ({ data }) => {
  return (
    <BaseNode data={data} icon={<Monitor className="w-5 h-5 text-purple-500" />}>
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className="w-3 h-3 bg-purple-500"
      />
    </BaseNode>
  );
};

export default SCADANode; 