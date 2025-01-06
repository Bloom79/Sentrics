import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { EnergyFlow } from '@/types/flowComponents';

interface FlowChartDialogProps {
  open: boolean;
  onClose: () => void;
  data: EnergyFlow[];
  sourceLabel: string;
  targetLabel: string;
}

const FlowChartDialog = ({ open, onClose, data, sourceLabel, targetLabel }: FlowChartDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Energy Flow: {sourceLabel} → {targetLabel}</DialogTitle>
        </DialogHeader>
        <div className="h-[300px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="timestamp" 
                tickFormatter={(value) => new Date(value).toLocaleTimeString()} 
              />
              <YAxis />
              <Tooltip 
                labelFormatter={(value) => new Date(value).toLocaleString()}
                formatter={(value) => [`${value} kW`, 'Flow']}
              />
              <Line 
                type="monotone" 
                dataKey="currentValue" 
                stroke="#3b82f6" 
                strokeWidth={2}
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