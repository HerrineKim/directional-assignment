/**
 * 커스텀 범례 컴포넌트
 * 차트의 범례를 표시하며, 색상 변경과 항목 표시/숨김 기능을 제공합니다.
 * 단일 항목 또는 팀별 그룹화된 항목을 지원합니다.
 */

"use client";

import { useState, useEffect, useRef } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import styles from "./CustomLegend.module.css";
import { cn } from "@/lib/utils";

/** 범례 아이템 타입 */
interface LegendItem {
  name: string;
  color: string;
  value?: string | number;
}

interface GroupedLegendItem {
  team: string;
  color: string;
  items: Array<{ name: string; color: string }>;
}

interface CustomLegendProps {
  items: LegendItem[];
  onColorChange: (name: string, color: string) => void;
  onToggleVisibility: (name: string) => void;
  hiddenItems?: Set<string>;
  groupedByTeam?: boolean;
  groupedItems?: GroupedLegendItem[];
}

export function CustomLegend({
  items,
  onColorChange,
  onToggleVisibility,
  hiddenItems = new Set(),
  groupedByTeam = false,
  groupedItems = [],
}: CustomLegendProps) {
  const [colorPickerOpen, setColorPickerOpen] = useState<string | null>(null);
  const colorPickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
        setColorPickerOpen(null);
      }
    };

    if (colorPickerOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [colorPickerOpen]);

  const handleColorChange = (name: string, e: React.ChangeEvent<HTMLInputElement>) => {
    onColorChange(name, e.target.value);
    setColorPickerOpen(null);
  };

  const toggleTeamVisibility = (team: string, items: Array<{ name: string }>) => {
    const allHidden = items.every((item) => hiddenItems.has(item.name));
    items.forEach((item) => {
      if (allHidden) {
        if (hiddenItems.has(item.name)) {
          onToggleVisibility(item.name);
        }
      } else {
        if (!hiddenItems.has(item.name)) {
          onToggleVisibility(item.name);
        }
      }
    });
  };

  if (groupedByTeam && groupedItems.length > 0) {
    return (
      <div className="mt-4 p-3 sm:p-4 bg-muted/30 rounded-lg">
        <div className="flex flex-wrap gap-4 justify-start sm:justify-center">
          {groupedItems.map((group) => {
            const groupItems = group.items;
            const allHidden = groupItems.every((item) => hiddenItems.has(item.name));

            return (
              <div
                key={group.team}
                className="flex flex-col gap-2 px-3 py-2 rounded-md hover:bg-background/50 transition-colors border border-border/50"
              >
                <div className="flex items-center gap-2">
                  <div className="relative" ref={colorPickerOpen === group.team ? colorPickerRef : null}>
                    <div
                      className={styles.colorIndicator}
                      style={{ "--legend-color": group.color } as React.CSSProperties}
                      onClick={() => setColorPickerOpen(colorPickerOpen === group.team ? null : group.team)}
                    />
                    {colorPickerOpen === group.team && (
                      <div className="absolute top-6 left-0 z-50 bg-background border rounded-lg shadow-lg p-2">
                        <input
                          type="color"
                          value={group.color}
                          onChange={(e) => {
                            if (groupItems.length > 0) {
                              handleColorChange(groupItems[0].name, e);
                            }
                          }}
                          className="w-8 h-8 cursor-pointer"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    )}
                  </div>

                  <span
                    className={cn(
                      "font-semibold text-sm",
                      allHidden && "line-through opacity-50"
                    )}
                    style={{ "--label-color": group.color } as React.CSSProperties}
                  >
                    {group.team}
                  </span>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => toggleTeamVisibility(group.team, groupItems)}
                    title={allHidden ? "팀 전체 보이기" : "팀 전체 숨기기"}
                  >
                    {allHidden ? (
                      <EyeOff className="h-3.5 w-3.5" />
                    ) : (
                      <Eye className="h-3.5 w-3.5" />
                    )}
                  </Button>
                </div>

                <div className="flex flex-col gap-2 ml-7 pl-2 border-l-2 border-border/30">
                    {groupItems.map((item) => {
                      const isHidden = hiddenItems.has(item.name);
                      return (
                        <div
                          key={item.name}
                          className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-background/30 transition-colors"
                        >
                          <div className="relative" ref={colorPickerOpen === item.name ? colorPickerRef : null}>
                            <div
                              className={styles.colorIndicator}
                              style={{ "--legend-color": item.color } as React.CSSProperties}
                              onClick={() => setColorPickerOpen(colorPickerOpen === item.name ? null : item.name)}
                            />
                            {colorPickerOpen === item.name && (
                              <div className="absolute top-6 left-0 z-50 bg-background border rounded-lg shadow-lg p-2">
                                <input
                                  type="color"
                                  value={item.color}
                                  onChange={(e) => handleColorChange(item.name, e)}
                                  className="w-8 h-8 cursor-pointer"
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </div>
                            )}
                          </div>

                          <span
                            className={cn(styles.label, isHidden && "line-through opacity-50")}
                            style={!isHidden ? ({ "--label-color": item.color } as React.CSSProperties) : undefined}
                          >
                            {item.name}
                          </span>

                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => onToggleVisibility(item.name)}
                            title={isHidden ? "보이기" : "숨기기"}
                          >
                            {isHidden ? (
                              <EyeOff className="h-3.5 w-3.5" />
                            ) : (
                              <Eye className="h-3.5 w-3.5" />
                            )}
                          </Button>
                        </div>
                      );
                    })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-1 sm:gap-2 justify-start sm:justify-center mt-4 p-2 sm:p-3 bg-muted/30 rounded-lg">
      {items.map((item) => {
        const isHidden = hiddenItems.has(item.name);
        return (
          <div
            key={item.name}
            className="flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2 py-1 rounded-md hover:bg-background/50 transition-colors"
          >
            <div className="relative" ref={colorPickerOpen === item.name ? colorPickerRef : null}>
              <div
                className={styles.colorIndicator}
                style={{ "--legend-color": item.color } as React.CSSProperties}
                onClick={() => setColorPickerOpen(colorPickerOpen === item.name ? null : item.name)}
              />
              {colorPickerOpen === item.name && (
                <div className="absolute top-6 left-0 z-50 bg-background border rounded-lg shadow-lg p-2">
                  <input
                    type="color"
                    value={item.color}
                    onChange={(e) => handleColorChange(item.name, e)}
                    className="w-8 h-8 cursor-pointer"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              )}
            </div>

            <span
              className={cn(styles.label, isHidden && "line-through opacity-50")}
              style={!isHidden ? ({ "--label-color": item.color } as React.CSSProperties) : undefined}
            >
              {item.name}
            </span>

            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => onToggleVisibility(item.name)}
              title={isHidden ? "보이기" : "숨기기"}
            >
              {isHidden ? (
                <EyeOff className="h-3.5 w-3.5" />
              ) : (
                <Eye className="h-3.5 w-3.5" />
              )}
            </Button>
          </div>
        );
      })}
    </div>
  );
}

