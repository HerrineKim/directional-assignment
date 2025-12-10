"use client";

import { useState, useEffect, useRef } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LegendItem {
  name: string;
  color: string;
  value?: string | number;
}

interface CustomLegendProps {
  items: LegendItem[];
  onColorChange: (name: string, color: string) => void;
  onToggleVisibility: (name: string) => void;
  hiddenItems?: Set<string>;
}

export function CustomLegend({
  items,
  onColorChange,
  onToggleVisibility,
  hiddenItems = new Set(),
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

  return (
    <div className="flex flex-wrap gap-4 justify-center mt-4 p-4 bg-muted/30 rounded-lg">
      {items.map((item) => {
        const isHidden = hiddenItems.has(item.name);
        return (
          <div
            key={item.name}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-background/50 transition-colors"
          >
            {/* Color indicator */}
            <div className="relative" ref={colorPickerOpen === item.name ? colorPickerRef : null}>
              <div
                className="w-4 h-4 rounded border-2 border-background shadow-sm cursor-pointer"
                style={{ backgroundColor: item.color }}
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

            {/* Label */}
            <span
              className={`text-sm ${isHidden ? "line-through opacity-50" : ""}`}
              style={{ color: isHidden ? undefined : item.color }}
            >
              {item.name}
            </span>

            {/* Toggle visibility button */}
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

