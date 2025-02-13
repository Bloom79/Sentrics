import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Cable } from 'lucide-react';
import { FlowNodeData } from '@/types/flowComponents';
import { BaseNode } from './BaseNode';

const CollectorSubstationNode: React.FC<{ data: FlowNodeData }> = ({ data }) => {
  return (
    <BaseNode data={data} icon={<Cable className="w-5 h-5 text-indigo-500" />}>
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className="w-3 h-3 bg-indigo-500"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className="w-3 h-3 bg-indigo-500"
      />
    </BaseNode>
  );
};

export default CollectorSubstationNode; 