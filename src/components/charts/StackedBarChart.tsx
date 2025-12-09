"use client";

import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface StackedBarChartProps {
  data: Array<Record<string, string | number>>;
  xKey: string;
  stackKeys: Array<{ key: string; name: string; color: string }>;
  title: string;
}

export function StackedBarChart({
  data,
  xKey,
  stackKeys,
  title,
}: StackedBarChartProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      <ResponsiveContainer width="100%" height={400}>
        <RechartsBarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xKey} />
          <YAxis label={{ value: "백분율 (%)", angle: -90, position: "insideLeft" }} />
          <Tooltip />
          <Legend />
          {stackKeys.map(({ key, name, color }) => (
            <Bar key={key} dataKey={key} stackId="a" fill={color} name={name} />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}

