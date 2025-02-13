import React from 'react';
import { FlowNodeData } from '@/types/flowComponents';
import { Card } from '@/components/ui/card';

interface BaseNodeProps {
  data: FlowNodeData;
  icon: React.ReactNode;
  children: React.ReactNode;
}

export const BaseNode: React.FC<BaseNodeProps> = ({ data, icon, children }) => {
  const handleClick = () => {
    if (data.onNodeClick) {
      data.onNodeClick(data.id, data.type);
    }
  };

  return (
    <Card
      className={`p-3 min-w-[150px] cursor-pointer ${
        data.status === 'error' ? 'border-red-500' :
        data.status === 'inactive' ? 'border-gray-400' : 'border-green-500'
      }`}
      onClick={handleClick}
    >
      <div className="flex items-center gap-2">
        {icon}
        <div className="flex-1">
          <p className="text-sm font-medium truncate">{data.label}</p>
          {data.specs?.power && (
            <p className="text-xs text-muted-foreground">
              {data.specs.power} kW
            </p>
          )}
        </div>
        <div className={`w-2 h-2 rounded-full ${
          data.status === 'error' ? 'bg-red-500' :
          data.status === 'inactive' ? 'bg-gray-400' : 'bg-green-500'
        }`} />
      </div>
      {children}
    </Card>
  );
}; 