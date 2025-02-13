import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { PlayIcon, Square, Zap, Clock } from 'lucide-react';
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";

interface SimulationControlsProps {
  isRunning: boolean;
  progress: number;
  timeRemaining: string;
  simulationType: 'quick' | 'real';
  dateRange: DateRange | null;
  onStartQuick: () => void;
  onStartReal: () => void;
  onStop: () => void;
  onDateRangeChange: (range: DateRange | null) => void;
}

export function SimulationControls({
  isRunning,
  progress,
  timeRemaining,
  simulationType,
  dateRange,
  onStartQuick,
  onStartReal,
  onStop,
  onDateRangeChange
}: SimulationControlsProps) {
  return (
    <Card className="mb-4">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="space-y-2">
          <CardTitle>Simulation Controls</CardTitle>
          {isRunning && (
            <div className="flex items-center gap-4">
              <Progress value={progress} className="w-[200px]" />
              <span className="text-sm text-muted-foreground">{progress.toFixed(1)}%</span>
              {timeRemaining && (
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {timeRemaining} remaining
                </span>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <DateRangePicker
              value={dateRange}
              onChange={onDateRangeChange}
            />
            {dateRange && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDateRangeChange(null)}
              >
                Reset Range
              </Button>
            )}
          </div>
          {!isRunning && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={onStartQuick}
              >
                <Zap className="w-4 h-4 mr-2" />
                Quick Simulation
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={onStartReal}
              >
                <PlayIcon className="w-4 h-4 mr-2" />
                Real Simulation
              </Button>
            </>
          )}
          {isRunning && (
            <>
              <Badge variant="outline" className="mr-2">
                {simulationType === 'quick' ? 'Quick Mode' : 'Real Mode'}
              </Badge>
              <Button
                variant="destructive"
                size="sm"
                onClick={onStop}
              >
                <Square className="w-4 h-4 mr-2" />
                Stop Simulation
              </Button>
            </>
          )}
        </div>
      </CardHeader>
    </Card>
  );
} 