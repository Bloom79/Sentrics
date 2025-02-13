import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { time: "00:00", congestion: 30 },
  { time: "04:00", congestion: 25 },
  { time: "08:00", congestion: 65 },
  { time: "12:00", congestion: 85 },
  { time: "16:00", congestion: 70 },
  { time: "20:00", congestion: 45 },
  { time: "23:59", congestion: 35 },
];

const CongestionTrends = () => {
  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="congestion"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CongestionTrends;