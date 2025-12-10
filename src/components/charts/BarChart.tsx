"use client";

import { useState, useMemo } from "react";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { CustomLegend } from "./CustomLegend";

interface BarChartProps {
  data: Array<{ name: string; value: number }>;
  dataKey: string;
  nameKey: string;
  title: string;
  colors?: string[];
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ name?: string; value?: number; payload?: any }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-background border rounded-lg p-3 shadow-lg">
      <p className="text-sm font-medium">
        {label}: {payload[0]?.value}
      </p>
    </div>
  );
};

const DEFAULT_COLORS = [
  "#FF6B9D", // 핑크
  "#C44569", // 라즈베리
  "#FFA07A", // 연어
  "#FFD93D", // 밝은 노랑
  "#6BCB77", // 민트 그린
  "#4D96FF", // 밝은 파랑
  "#9D84B7", // 라벤더
  "#FDA085", // 복숭아
];

export function BarChart({
  data,
  dataKey,
  nameKey,
  title,
  colors = DEFAULT_COLORS,
}: BarChartProps) {
  const [itemColors, setItemColors] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    data.forEach((item, index) => {
      initial[item[nameKey as keyof typeof item] as string] = colors[index % colors.length];
    });
    return initial;
  });

  const [hiddenItems, setHiddenItems] = useState<Set<string>>(new Set());

  const handleColorChange = (name: string, color: string) => {
    setItemColors((prev) => ({ ...prev, [name]: color }));
  };

  const handleToggleVisibility = (name: string) => {
    setHiddenItems((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  };

  const filteredData = useMemo(() => {
    return data.filter((item) => !hiddenItems.has(item[nameKey as keyof typeof item] as string));
  }, [data, nameKey, hiddenItems]);

  const legendItems = useMemo(() => {
    return data.map((item) => {
      const name = item[nameKey as keyof typeof item] as string;
      return {
        name,
        color: itemColors[name] || colors[data.indexOf(item) % colors.length],
        value: item[dataKey as keyof typeof item],
      };
    });
  }, [data, nameKey, dataKey, itemColors, colors]);

  return (
    <div className="space-y-4">
      {title && <h3 className="text-lg font-semibold">{title}</h3>}
      <div className="h-[300px] sm:h-[400px] p-4 bg-gradient-to-br from-background to-muted/20 rounded-xl shadow-sm border">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart data={filteredData}>
            <defs>
              {filteredData.map((entry, index) => {
                const name = entry[nameKey as keyof typeof entry] as string;
                const color = itemColors[name] || colors[data.findIndex((d) => d[nameKey as keyof typeof d] === name) % colors.length];
                return (
                  <linearGradient key={`gradient-${index}`} id={`gradient-${name}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity={0.8} />
                    <stop offset="100%" stopColor={color} stopOpacity={0.3} />
                  </linearGradient>
                );
              })}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
            <XAxis
              dataKey={nameKey}
              tick={{ fill: 'currentColor', fontSize: 12 }}
              tickLine={{ stroke: 'currentColor', opacity: 0.2 }}
            />
            <YAxis
              tick={{ fill: 'currentColor', fontSize: 12 }}
              tickLine={{ stroke: 'currentColor', opacity: 0.2 }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'currentColor', opacity: 0.05 }} />
            <Bar
              dataKey={dataKey}
              radius={[8, 8, 0, 0]}
              animationDuration={800}
              animationBegin={0}
            >
              {filteredData.map((entry, index) => {
                const name = entry[nameKey as keyof typeof entry] as string;
                return <Cell key={`cell-${index}`} fill={`url(#gradient-${name})`} />;
              })}
            </Bar>
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
      <CustomLegend
        items={legendItems}
        onColorChange={handleColorChange}
        onToggleVisibility={handleToggleVisibility}
        hiddenItems={hiddenItems}
      />
    </div>
  );
}

