"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface DonutChartProps {
  data: Array<{ name: string; value: number }>;
  dataKey: string;
  nameKey: string;
  title: string;
  colors?: string[];
}

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#00ff00"];

export function DonutChart({
  data,
  dataKey,
  nameKey,
  title,
  colors = COLORS,
}: DonutChartProps) {
  return (
    <div className="space-y-4">
      {title && <h3 className="text-lg font-semibold">{title}</h3>}
      <div className="h-[300px] sm:h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
            outerRadius={120}
            innerRadius={60}
            fill="#8884d8"
            dataKey={dataKey}
            nameKey={nameKey}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

