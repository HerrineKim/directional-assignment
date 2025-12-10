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

const DEFAULT_COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#00ff00"];

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
      <div className="h-[300px] sm:h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart data={filteredData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={nameKey} />
            <YAxis />
            <Tooltip />
            <Bar dataKey={dataKey}>
              {filteredData.map((entry, index) => {
                const name = entry[nameKey as keyof typeof entry] as string;
                const color = itemColors[name] || colors[data.findIndex((d) => d[nameKey as keyof typeof d] === name) % colors.length];
                return <Cell key={`cell-${index}`} fill={color} />;
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

