/**
 * 누적 막대 차트 컴포넌트
 * 여러 데이터 시리즈를 누적 막대 형태로 표시합니다.
 * 백분율 표시 및 원본 값 표시 모드를 지원합니다.
 */

"use client";

import { useMemo } from "react";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { CustomLegend } from "./CustomLegend";
import { StackedTooltip } from "./StackedTooltip";
import { useChartLegend } from "@/lib/hooks/useChartLegend";

/** StackedBarChart 컴포넌트 props */
interface StackedBarChartProps<T = Record<string, string | number>> {
  data: T[];
  xKey: string;
  stackKeys: Array<{ key: string; name: string; color: string }>;
  title: string;
  showOriginalValues?: boolean;
  originalKeyMap?: Record<string, string>;
}

export function StackedBarChart<T extends Record<string, string | number>>({
  data,
  xKey,
  stackKeys,
  title,
  showOriginalValues = false,
  originalKeyMap = {},
}: StackedBarChartProps<T>) {
  const initialColors = useMemo(() => {
    const initial: Record<string, string> = {};
    stackKeys.forEach(({ key, color }) => {
      initial[key] = color;
    });
    return initial;
  }, [stackKeys]);

  const { itemColors, hiddenItems, handleColorChange, handleToggleVisibility } = useChartLegend({
    initialColors,
  });

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
          <RechartsBarChart data={data}>
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
              cursor={{ fill: 'currentColor', opacity: 0.05 }}
            />
            {visibleStackKeys.map(({ key, name }) => (
              <Bar
                key={key}
                dataKey={key}
                stackId="a"
                fill={itemColors[key] || stackKeys.find((sk) => sk.key === key)?.color || "#8884d8"}
                name={name}
                hide={hiddenItems.has(name)}
                stroke="hsl(var(--background))"
                strokeWidth={1}
                animationDuration={800}
                animationBegin={0}
              />
            ))}
          </RechartsBarChart>
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

