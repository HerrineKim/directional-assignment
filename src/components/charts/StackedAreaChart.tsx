"use client";

import {
  AreaChart as RechartsAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface StackedAreaChartProps {
  data: Array<Record<string, string | number>>;
  xKey: string;
  stackKeys: Array<{ key: string; name: string; color: string }>;
  title: string;
}

export function StackedAreaChart({
  data,
  xKey,
  stackKeys,
  title,
}: StackedAreaChartProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      <ResponsiveContainer width="100%" height={400}>
        <RechartsAreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xKey} />
          <YAxis label={{ value: "백분율 (%)", angle: -90, position: "insideLeft" }} />
          <Tooltip />
          <Legend />
          {stackKeys.map(({ key, name, color }) => (
            <Area
              key={key}
              type="monotone"
              dataKey={key}
              stackId="1"
              stroke={color}
              fill={color}
              name={name}
            />
          ))}
        </RechartsAreaChart>
      </ResponsiveContainer>
    </div>
  );
}

