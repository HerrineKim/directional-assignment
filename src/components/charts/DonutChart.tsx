/**
 * 도넛 차트 컴포넌트
 * Recharts 기반의 도넛(파이) 차트로, 그라데이션 효과와 커스텀 범례를 지원합니다.
 * 항목별 색상 변경, 표시/숨김 기능, 반응형 스크롤을 제공합니다.
 */

"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { CustomLegend } from "./CustomLegend";
import styles from "./DonutChart.module.css";
import { cn } from "@/lib/utils";
import { CHART_COLORS, CHART_ANIMATION_DURATION, CHART_ANIMATION_BEGIN } from "@/lib/constants";

/** DonutChart 컴포넌트 props */
interface DonutChartProps {
  data: Array<{ name: string; value: number }>;
  dataKey: string;
  nameKey: string;
  title: string;
  colors?: readonly string[];
}

const COLORS = CHART_COLORS;

export function DonutChart({
  data,
  dataKey,
  nameKey,
  title,
  colors = COLORS,
}: DonutChartProps) {
  const [itemColors, setItemColors] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    data.forEach((item, index) => {
      initial[item[nameKey as keyof typeof item] as string] = colors[index % colors.length];
    });
    return initial;
  });

  const [hiddenItems, setHiddenItems] = useState<Set<string>>(new Set());
  const [needsScroll, setNeedsScroll] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const checkScroll = () => {
      if (containerRef.current && contentRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const contentWidth = contentRef.current.scrollWidth;
        const scrollbarWidth = 17;
        const threshold = 50;
        const actuallyNeedsScroll = contentWidth > containerWidth + scrollbarWidth + threshold;
        
        if (actuallyNeedsScroll && containerRef.current) {
          const originalScrollLeft = containerRef.current.scrollLeft;
          containerRef.current.scrollLeft = 1;
          const canScroll = containerRef.current.scrollLeft > 0;
          containerRef.current.scrollLeft = originalScrollLeft;
          setNeedsScroll(canScroll);
        } else {
          setNeedsScroll(false);
        }
      }
    };

    const timeoutId = setTimeout(checkScroll, 150);
    let resizeObserver: ResizeObserver | null = null;
    if (containerRef.current && contentRef.current) {
      resizeObserver = new ResizeObserver(() => {
        setTimeout(checkScroll, 50);
      });
      resizeObserver.observe(containerRef.current);
      resizeObserver.observe(contentRef.current);
    }
    window.addEventListener("resize", () => {
      setTimeout(checkScroll, 50);
    });
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", checkScroll);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [filteredData]);

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
      <div
        ref={containerRef}
        className={cn(
          styles.container,
          needsScroll ? styles.scrollContainer : styles.noScrollContainer,
          "bg-linear-to-br from-background to-muted/20 rounded-xl shadow-sm border p-4"
        )}
      >
        <div ref={contentRef} className={styles.content}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <defs>
                {filteredData.map((entry, index) => {
                  const name = entry[nameKey as keyof typeof entry] as string;
                  const color = itemColors[name] || colors[data.findIndex((d) => d[nameKey as keyof typeof d] === name) % colors.length];
                  return (
                    <linearGradient key={`gradient-${index}`} id={`donut-gradient-${name}`} x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor={color} stopOpacity={0.9} />
                      <stop offset="100%" stopColor={color} stopOpacity={0.6} />
                    </linearGradient>
                  );
                })}
              </defs>
              <Pie
                data={filteredData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={120}
                innerRadius={60}
                fill="#8884d8"
                dataKey={dataKey}
                nameKey={nameKey}
                animationDuration={CHART_ANIMATION_DURATION}
                animationBegin={CHART_ANIMATION_BEGIN}
              >
                {filteredData.map((entry, index) => {
                  const name = entry[nameKey as keyof typeof entry] as string;
                  return <Cell key={`cell-${index}`} fill={`url(#donut-gradient-${name})`} />;
                })}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
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

