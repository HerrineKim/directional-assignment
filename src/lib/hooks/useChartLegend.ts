/**
 * 차트 범례 상태 관리 커스텀 훅
 * 색상 변경과 항목 표시/숨김 기능을 제공합니다.
 * BarChart, DonutChart, StackedBarChart, StackedAreaChart에서 공통으로 사용됩니다.
 */

import { useState, useCallback } from "react";

interface UseChartLegendOptions {
  /** 초기 색상 맵 */
  initialColors: Record<string, string>;
}

/**
 * 차트 범례 상태를 관리하는 커스텀 훅
 * @param options - 초기 색상 설정
 * @returns itemColors, hiddenItems, handleColorChange, handleToggleVisibility
 */
export function useChartLegend({ initialColors }: UseChartLegendOptions) {
  const [itemColors, setItemColors] = useState<Record<string, string>>(initialColors);
  const [hiddenItems, setHiddenItems] = useState<Set<string>>(new Set());

  const handleColorChange = useCallback((name: string, color: string) => {
    setItemColors((prev) => ({ ...prev, [name]: color }));
  }, []);

  const handleToggleVisibility = useCallback((name: string) => {
    setHiddenItems((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  }, []);

  return {
    itemColors,
    hiddenItems,
    handleColorChange,
    handleToggleVisibility,
  };
}
