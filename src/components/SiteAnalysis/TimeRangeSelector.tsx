import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TimeRange } from '@/types/flowComponents';

interface TimeRangeSelectorProps {
  value: TimeRange;
  onChange: (value: TimeRange) => void;
}

const TimeRangeSelector = ({ value, onChange }: TimeRangeSelectorProps) => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium">Time Range:</span>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select time range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="realtime">Real-time</SelectItem>
          <SelectItem value="15min">Last 15 minutes</SelectItem>
          <SelectItem value="1hour">Last hour</SelectItem>
          <SelectItem value="24hours">Last 24 hours</SelectItem>
          <SelectItem value="custom">Custom</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default TimeRangeSelector;