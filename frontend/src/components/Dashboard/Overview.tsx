import React from 'react';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const data = [
  { time: '00:00', production: 0, consumption: 0 },
  { time: '04:00', production: 0, consumption: 0 },
  { time: '08:00', production: 0, consumption: 0 },
  { time: '12:00', production: 0, consumption: 0 },
  { time: '16:00', production: 0, consumption: 0 },
  { time: '20:00', production: 0, consumption: 0 },
  { time: '23:59', production: 0, consumption: 0 },
];

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
        <XAxis
          dataKey="time"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value} kWh`}
        />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="production"
          stroke="#4ade80"
          strokeWidth={2}
          name="Production"
        />
        <Line
          type="monotone"
          dataKey="consumption"
          stroke="#f43f5e"
          strokeWidth={2}
          name="Consumption"
        />
      </LineChart>
    </ResponsiveContainer>
  );
} 