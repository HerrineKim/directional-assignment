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
  Cell,
} from "recharts";

interface BarChartProps {
  data: Array<{ name: string; value: number }>;
  dataKey: string;
  nameKey: string;
  title: string;
  colors?: string[];
}

const DEFAULT_COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#00ff00"];

export function BarChart({
  data,
  dataKey,
  nameKey,
  title,
  colors = DEFAULT_COLORS,
}: BarChartProps) {
  return (
    <div className="space-y-4">
      {title && <h3 className="text-lg font-semibold">{title}</h3>}
      <div className="h-[300px] sm:h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={nameKey} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey={dataKey}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

