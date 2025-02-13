import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { format, subDays } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ConsumptionData } from '@/types/consumption';
import { POD } from '@/types/pod';

interface ConsumptionGraphsProps {
  consumerId: string;
  pods: POD[];
}

export const ConsumptionGraphs: React.FC<ConsumptionGraphsProps> = ({ consumerId, pods }) => {
  const endDate = new Date();
  const startDate = subDays(endDate, 7);

  const { data: consumptionData, isLoading } = useQuery({
    queryKey: ['consumption', consumerId, 'hourly', startDate, endDate],
    queryFn: async () => {
      const podQueries = pods.map(async (pod) => {
        const { data, error } = await supabase
          .from('consumption_data')
          .select('*')
          .eq('pod_id', pod.id)
          .eq('granularity', 'hourly')
          .gte('timestamp', startDate.toISOString())
          .lte('timestamp', endDate.toISOString())
          .order('timestamp', { ascending: true });

        if (error) throw error;
        return { pod, data: data as ConsumptionData[] };
      });

      return Promise.all(podQueries);
    },
    enabled: pods.length > 0,
  });

  if (isLoading) {
    return <div>Loading consumption data...</div>;
  }

  if (!consumptionData) {
    return <div>No consumption data available</div>;
  }

  const formatData = () => {
    const timePoints = new Set<string>();
    const podData: { [key: string]: { [key: string]: number } } = {};

    consumptionData.forEach(({ pod, data }) => {
      podData[pod.name] = {};
      data.forEach((point) => {
        const timeKey = format(new Date(point.timestamp), 'MM/dd HH:mm');
        timePoints.add(timeKey);
        podData[pod.name][timeKey] = point.value;
      });
    });

    return Array.from(timePoints).map((timeKey) => {
      const point: any = { timestamp: timeKey };
      Object.keys(podData).forEach((podName) => {
        point[podName] = podData[podName][timeKey] || 0;
      });
      return point;
    });
  };

  const formattedData = formatData();
  const colors = ['#2563eb', '#16a34a', '#dc2626', '#9333ea', '#eab308'];

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Consumption by POD</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={formattedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" />
              <YAxis label={{ value: 'kWh', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              {pods.map((pod, index) => (
                <Line
                  key={pod.id}
                  type="monotone"
                  dataKey={pod.name}
                  stroke={colors[index % colors.length]}
                  dot={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};