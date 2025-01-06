import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Battery } from 'lucide-react';
import { FlowNodeData } from '@/types/flowComponents';

interface BESSNodeProps {
  data: FlowNodeData;
}

const BESSNode: React.FC<BESSNodeProps> = ({ data }) => {
  const stateOfCharge = data.specs?.stateOfCharge || 0;
  const chargingStatus = data.specs?.chargingPower && data.specs.chargingPower > 0 ? 'charging' : 'discharging';
  
  return (
    <div className="flex flex-col items-center p-4 bg-white rounded-lg border border-gray-200">
      <Handle type="target" position={Position.Left} />
      <div className="flex flex-col items-center gap-2">
        <Battery className={`w-8 h-8 ${chargingStatus === 'charging' ? 'text-green-500' : 'text-amber-500'}`} />
        <span className="text-sm font-medium">{data.label}</span>
        <div className="flex flex-col items-center text-xs">
          <span className="text-muted-foreground">
            {stateOfCharge}% SoC
          </span>
          <span className={`capitalize ${chargingStatus === 'charging' ? 'text-green-600' : 'text-amber-600'}`}>
            {chargingStatus}
          </span>
        </div>
      </div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
};

export default BESSNode;