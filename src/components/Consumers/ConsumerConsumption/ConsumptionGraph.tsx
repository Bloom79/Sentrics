import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { addDays } from "date-fns";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DateRange } from "react-day-picker";

interface ConsumptionGraphProps {
  consumerId: string;
}

type ConsumptionData = {
  timestamp: string;
  value: number;
}

export const ConsumptionGraph = ({ consumerId }: ConsumptionGraphProps) => {
  const [granularity, setGranularity] = React.useState("hourly");
  const [dateRange, setDateRange] = React.useState<DateRange>({
    from: addDays(new Date(), -7),
    to: new Date(),
  });

  const { data: consumptionData } = useQuery({
    queryKey: ['consumption', consumerId, granularity, dateRange],
    queryFn: async () => {
      if (!dateRange.from || !dateRange.to) return [];

      const { data, error } = await supabase
        .from('consumption_data')
        .select('*')
        .eq('consumer_id', consumerId)
        .eq('granularity', granularity)
        .gte('timestamp', dateRange.from.toISOString())
        .lte('timestamp', dateRange.to.toISOString())
        .order('timestamp');

      if (error) throw error;
      return (data || []) as ConsumptionData[];
    },
    enabled: Boolean(dateRange.from && dateRange.to),
  });

  const handleDateRangeChange = (range: DateRange) => {
    setDateRange(range);
  };

  return (
    <Card className="mt-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Consumption Analysis</CardTitle>
        <div className="flex items-center gap-4">
          <Select value={granularity} onValueChange={setGranularity}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select granularity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hourly">Hourly</SelectItem>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
          <DatePickerWithRange
            date={dateRange}
            setDate={handleDateRangeChange}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={consumptionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="timestamp" 
                tickFormatter={(value) => new Date(value).toLocaleDateString()} 
              />
              <YAxis 
                label={{ 
                  value: 'Consumption (kWh)', 
                  angle: -90, 
                  position: 'insideLeft' 
                }} 
              />
              <Tooltip 
                labelFormatter={(value) => new Date(value).toLocaleString()}
                formatter={(value) => [`${value} kWh`, 'Consumption']}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};