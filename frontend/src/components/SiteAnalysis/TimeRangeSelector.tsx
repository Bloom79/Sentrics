import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Pause, Play } from "lucide-react";
import { TimeRange } from '@/types/flowComponents';

interface TimeRangeSelectorProps {
  value: TimeRange;
  onChange: (value: TimeRange) => void;
  isPaused?: boolean;
  onPauseChange?: (paused: boolean) => void;
}

const TimeRangeSelector = ({ value, onChange, isPaused = false, onPauseChange }: TimeRangeSelectorProps) => {
  return (
    <div className="flex items-center gap-4">
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

      {value === "realtime" && onPauseChange && (
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPauseChange(!isPaused)}
          title={isPaused ? "Resume" : "Pause"}
        >
          {isPaused ? (
            <Play className="h-4 w-4" />
          ) : (
            <Pause className="h-4 w-4" />
          )}
        </Button>
      )}
    </div>
  );
};

export default TimeRangeSelector;