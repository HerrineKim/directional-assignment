"use client";

interface StackedTooltipProps {
  active?: boolean;
  payload?: Array<{
    dataKey?: string;
    value?: number;
    name?: string;
    color?: string;
    payload?: Record<string, string | number>;
  }>;
  label?: string;
  showOriginal?: boolean;
  originalKeys?: Record<string, string>;
}

export function StackedTooltip({ 
  active, 
  payload, 
  label,
  showOriginal = false,
  originalKeys = {},
}: StackedTooltipProps) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-background border rounded-lg p-3 shadow-lg">
      <p className="font-semibold mb-2">{label}</p>
      {payload.map((entry, index) => {
        if (!entry.dataKey || !entry.name) return null;
        
        let displayValue = entry.value;
        if (showOriginal && entry.payload) {
          const originalKey = originalKeys[entry.dataKey] || `${entry.dataKey}_original`;
          const originalValue = entry.payload[originalKey];
          if (originalValue !== undefined) {
            displayValue = Number(originalValue);
          }
        }

        const formattedValue = typeof displayValue === 'number' 
          ? (showOriginal ? displayValue.toFixed(2) : Number(displayValue.toFixed(2)))
          : displayValue;

        return (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {formattedValue}{!showOriginal && '%'}
          </p>
        );
      })}
    </div>
  );
}
