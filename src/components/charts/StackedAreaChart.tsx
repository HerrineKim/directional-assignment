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
  originalKeyMap?: Record<string, string>;
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
      <div className="h-[300px] sm:h-[400px] p-4 bg-linear-to-br from-background to-muted/20 rounded-xl shadow-sm border">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsAreaChart data={data}>
            <defs>
              {visibleStackKeys.map(({ key }) => {
                const color = itemColors[key] || stackKeys.find((sk) => sk.key === key)?.color || "#8884d8";
                return (
                  <linearGradient key={`gradient-${key}`} id={`area-gradient-${key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={color} stopOpacity={0.2} />
                  </linearGradient>
                );
              })}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
            <XAxis
              dataKey={xKey}
              tick={{ fill: 'currentColor', fontSize: 12 }}
              tickLine={{ stroke: 'currentColor', opacity: 0.2 }}
            />
            <YAxis
              label={{ value: "백분율 (%)", angle: -90, position: "insideLeft" }}
              domain={[0, 100]}
              tick={{ fill: 'currentColor', fontSize: 12 }}
              tickLine={{ stroke: 'currentColor', opacity: 0.2 }}
            />
            <Tooltip
              content={
                <StackedTooltip
                  showOriginal={showOriginalValues}
                  originalKeys={originalKeyMap}
                />
              }
            />
            {visibleStackKeys.map(({ key, name }) => {
              const color = itemColors[key] || stackKeys.find((sk) => sk.key === key)?.color || "#8884d8";
              return (
                <Area
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stackId="1"
                  stroke={color}
                  strokeWidth={2}
                  fill={`url(#area-gradient-${key})`}
                  name={name}
                  hide={hiddenItems.has(name)}
                  animationDuration={800}
                  animationBegin={0}
                />
              );
            })}
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

