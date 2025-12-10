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
        // 실제로 스크롤이 가능한지 확인 (스크롤바 너비 포함, 더 큰 여유 공간)
        const scrollbarWidth = 17; // 일반적인 스크롤바 너비
        const threshold = 50; // 더 큰 여유 공간
        const actuallyNeedsScroll = contentWidth > containerWidth + scrollbarWidth + threshold;
        
        // 실제로 스크롤이 가능한지 테스트
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

    // 약간의 지연을 두어 렌더링 완료 후 확인
    const timeoutId = setTimeout(checkScroll, 150);
    // ResizeObserver를 사용하여 더 정확한 감지
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
          needsScroll ? styles.scrollContainer : styles.noScrollContainer
        )}
      >
        <div ref={contentRef} className={styles.content}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
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
              >
                {filteredData.map((entry, index) => {
                  const name = entry[nameKey as keyof typeof entry] as string;
                  const color = itemColors[name] || colors[data.findIndex((d) => d[nameKey as keyof typeof d] === name) % colors.length];
                  return <Cell key={`cell-${index}`} fill={color} />;
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

