import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Sun } from 'lucide-react';
import { FlowNodeData } from '@/types/flowComponents';
import { BaseNode } from './BaseNode';

const SolarPanelNode: React.FC<{ data: FlowNodeData }> = ({ data }) => {
  return (
    <BaseNode data={data} icon={<Sun className="w-5 h-5 text-yellow-500" />}>
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className="w-3 h-3 bg-yellow-500"
      />
    </BaseNode>
  );
};

export default SolarPanelNode; 