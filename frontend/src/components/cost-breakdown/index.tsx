import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { EuroIcon, TrendingUpIcon, PiggyBankIcon, CoinsIcon } from 'lucide-react';

interface CostBreakdownProps {
  data: {
    total_savings: number;
    total_incentives: number;
    revenue_from_sales: number;
    community_incentives: number;
    previous_period?: {
      total_savings: number;
      total_incentives: number;
      revenue_from_sales: number;
      community_incentives: number;
    };
  };
}

export function CostBreakdown({ data }: CostBreakdownProps) {
  const calculateChange = (current: number, previous?: number) => {
    if (!previous) return null;
    const change = ((current - previous) / previous) * 100;
    return change.toFixed(1);
  };

  const MetricCard = ({
    title,
    value,
    previousValue,
    icon: Icon,
    color,
  }: {
    title: string;
    value: number;
    previousValue?: number;
    icon: any;
    color: string;
  }) => {
    const change = calculateChange(value, previousValue);

    return (
      <Card className={`border-l-4 ${color}`}>
        <CardContent className="pt-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              <h3 className="text-2xl font-bold">€{value.toFixed(2)}</h3>
            </div>
            <div className={`rounded-full p-2 ${color.replace('border', 'bg')}`}>
              <Icon className="w-4 h-4" />
            </div>
          </div>
          {change && (
            <div className="mt-4 flex items-center text-sm">
              <TrendingUpIcon className="w-4 h-4 mr-1" />
              <span className={Number(change) >= 0 ? 'text-green-600' : 'text-red-600'}>
                {change}%
              </span>
              <span className="text-muted-foreground ml-1">vs previous period</span>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <MetricCard
          title="Total Savings"
          value={data.total_savings}
          previousValue={data.previous_period?.total_savings}
          icon={PiggyBankIcon}
          color="border-green-500"
        />
        <MetricCard
          title="Total Incentives"
          value={data.total_incentives}
          previousValue={data.previous_period?.total_incentives}
          icon={CoinsIcon}
          color="border-blue-500"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Revenue Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Energy Sales Revenue</span>
                <span className="text-sm font-medium">
                  €{data.revenue_from_sales.toFixed(2)}
                </span>
              </div>
              <Progress value={(data.revenue_from_sales / data.total_savings) * 100} />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Community Incentives</span>
                <span className="text-sm font-medium">
                  €{data.community_incentives.toFixed(2)}
                </span>
              </div>
              <Progress
                value={(data.community_incentives / data.total_savings) * 100}
                className="bg-blue-100"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            {/* Add a chart component here to show monthly trends */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 