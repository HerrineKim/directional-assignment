"use client";

import { useState, useMemo } from "react";
import {
  AreaChart as RechartsAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { CustomLegend } from "./CustomLegend";
import { StackedTooltip } from "./StackedTooltip";

interface StackedAreaChartProps<T = Record<string, string | number>> {
  data: T[];
  xKey: string;
  stackKeys: Array<{ key: string; name: string; color: string }>;
  title: string;
  showOriginalValues?: boolean;
  originalKeyMap?: Record<string, string>; // key -> originalKey mapping
}

export function StackedAreaChart<T extends Record<string, string | number>>({
  data,
  xKey,
  stackKeys,
  title,
  showOriginalValues = false,
  originalKeyMap = {},
}: StackedAreaChartProps<T>) {
  const [itemColors, setItemColors] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    stackKeys.forEach(({ key, color }) => {
      initial[key] = color;
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

  const visibleStackKeys = useMemo(() => {
    return stackKeys.filter(({ name }) => !hiddenItems.has(name));
  }, [stackKeys, hiddenItems]);

  const legendItems = useMemo(() => {
    return stackKeys.map(({ key, name }) => ({
      name,
      color: itemColors[key] || stackKeys.find((sk) => sk.key === key)?.color || "#8884d8",
    }));
  }, [stackKeys, itemColors]);

  return (
    <div className="space-y-4">
      {title && <h3 className="text-lg font-semibold">{title}</h3>}
      <div className="h-[300px] sm:h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsAreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xKey} />
            <YAxis 
              label={{ value: "백분율 (%)", angle: -90, position: "insideLeft" }}
              domain={[0, 100]}
            />
            <Tooltip 
              content={
                <StackedTooltip 
                  showOriginal={showOriginalValues}
                  originalKeys={originalKeyMap}
                />
              }
            />
            {visibleStackKeys.map(({ key, name }) => (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                stackId="1"
                stroke={itemColors[key] || stackKeys.find((sk) => sk.key === key)?.color || "#8884d8"}
                fill={itemColors[key] || stackKeys.find((sk) => sk.key === key)?.color || "#8884d8"}
                name={name}
                hide={hiddenItems.has(name)}
              />
            ))}
          </RechartsAreaChart>
        </ResponsiveContainer>
      </div>
      <CustomLegend
        items={legendItems}
        onColorChange={(name, color) => {
          const stackKey = stackKeys.find((sk) => sk.name === name);
          if (stackKey) {
            handleColorChange(stackKey.key, color);
          }
        }}
        onToggleVisibility={handleToggleVisibility}
        hiddenItems={hiddenItems}
      />
    </div>
  );
}

