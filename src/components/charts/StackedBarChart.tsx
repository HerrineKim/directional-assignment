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

interface StackedBarChartProps<T = Record<string, string | number>> {
  data: T[];
  xKey: string;
  stackKeys: Array<{ key: string; name: string; color: string }>;
  title: string;
}

export function StackedBarChart<T extends Record<string, string | number>>({
  data,
  xKey,
  stackKeys,
  title,
}: StackedBarChartProps<T>) {
  return (
    <div className="space-y-4">
      {title && <h3 className="text-lg font-semibold">{title}</h3>}
      <div className="h-[300px] sm:h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
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
    </div>
  );
}

