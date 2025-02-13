import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface EfficiencyMetricsProps {
  data: any[];
}

export function EfficiencyMetrics({ data }: EfficiencyMetricsProps) {
  const metrics = data.reduce((acc, item) => {
    const analysis = item.analysis || {};
    return {
      efficiency: (acc.efficiency || 0) + (analysis.efficiency || 0),
      gridDependency: (acc.gridDependency || 0) + (analysis.grid_dependency || 0),
      count: acc.count + 1
    };
  }, { efficiency: 0, gridDependency: 0, count: 0 });

  const avgEfficiency = metrics.efficiency / metrics.count;
  const avgGridDependency = metrics.gridDependency / metrics.count;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Self-Consumption Efficiency</span>
          <span className="text-sm font-medium">{avgEfficiency.toFixed(1)}%</span>
        </div>
        <Progress value={avgEfficiency} className="h-2 bg-blue-100" />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Grid Dependency</span>
          <span className="text-sm font-medium">{avgGridDependency.toFixed(1)}%</span>
        </div>
        <Progress value={avgGridDependency} className="h-2 bg-yellow-100" />
      </div>
    </div>
  );
} 