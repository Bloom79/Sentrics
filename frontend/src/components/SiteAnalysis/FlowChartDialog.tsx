import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { EnergyFlow } from '@/types/flowComponents';

interface FlowChartDialogProps {
  open: boolean;
  onClose: () => void;
  data: EnergyFlow[];
  sourceLabel: string;
  targetLabel: string;
  flowType?: 'power' | 'voltage' | 'current';
}

const FlowChartDialog = ({ 
  open, 
  onClose, 
  data, 
  sourceLabel, 
  targetLabel,
  flowType = 'power' 
}: FlowChartDialogProps) => {
  const getUnit = () => {
    switch (flowType) {
      case 'voltage':
        return 'V';
      case 'current':
        return 'A';
      default:
        return 'kW';
    }
  };

  const getStatistics = () => {
    if (!data.length) return { avg: 0, max: 0, min: 0 };
    
    const values = data.map(d => d.currentValue);
    return {
      avg: values.reduce((a, b) => a + b, 0) / values.length,
      max: Math.max(...values),
      min: Math.min(...values)
    };
  };

  const stats = getStatistics();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Energy Flow: {sourceLabel} → {targetLabel}</DialogTitle>
          <DialogDescription>
            Historical data showing {flowType} flow between components
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
          <div className="text-center">
            <div className="font-medium">Average</div>
            <div className="text-muted-foreground">
              {stats.avg.toFixed(2)} {getUnit()}
            </div>
          </div>
          <div className="text-center">
            <div className="font-medium">Maximum</div>
            <div className="text-muted-foreground">
              {stats.max.toFixed(2)} {getUnit()}
            </div>
          </div>
          <div className="text-center">
            <div className="font-medium">Minimum</div>
            <div className="text-muted-foreground">
              {stats.min.toFixed(2)} {getUnit()}
            </div>
          </div>
        </div>

        <div className="h-[400px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="timestamp" 
                tickFormatter={(value) => new Date(value).toLocaleTimeString()} 
              />
              <YAxis 
                label={{ 
                  value: getUnit(), 
                  angle: -90, 
                  position: 'insideLeft' 
                }}
              />
              <Tooltip 
                labelFormatter={(value) => new Date(value).toLocaleString()}
                formatter={(value) => [`${value} ${getUnit()}`, flowType]}
              />
              <Legend />
              <Line 
                name={`${flowType} Flow`}
                type="monotone" 
                dataKey="currentValue" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={false}
              />
              <Line 
                name="Average"
                type="monotone" 
                dataKey="avgValue" 
                stroke="#10b981" 
                strokeWidth={1}
                strokeDasharray="5 5"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FlowChartDialog;