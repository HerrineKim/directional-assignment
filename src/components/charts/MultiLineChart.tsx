"use client";

import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Dot,
} from "recharts";

interface MultiLineChartProps {
  data: Array<Record<string, string | number>>;
  xKey: string;
  leftYAxisKey: string;
  rightYAxisKey: string;
  teams: Array<{
    name: string;
    leftKey: string;
    rightKey: string;
    color: string;
  }>;
  title: string;
  leftYAxisLabel: string;
  rightYAxisLabel: string;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || !payload.length) return null;

  // Group by team (same color) - find the team from the first payload entry
  const firstEntry = payload[0];
  if (!firstEntry?.dataKey) return null;
  
  const teamName = firstEntry.dataKey.split("_")[0]; // Extract team name from key like "Frontend_bugs"
  const teamEntries: Record<string, any> = {};
  
  // Collect all data for this team
  payload.forEach((entry: any) => {
    if (entry.dataKey?.startsWith(teamName + "_")) {
      teamEntries[entry.dataKey] = entry.value;
    }
  });

  const xValue = label;

  return (
    <div className="bg-background border rounded-lg p-3 shadow-lg">
      <p className="font-semibold mb-2">{teamName}</p>
      <p className="text-sm mb-2">
        {typeof xValue === "string" && xValue.includes("잔") 
          ? `커피: ${xValue}` 
          : typeof xValue === "string" && xValue.includes("개")
          ? `간식: ${xValue}`
          : xValue}
      </p>
      {Object.entries(teamEntries).map(([key, value]) => {
        const label = key.includes("bugs")
          ? "버그"
          : key.includes("meetingsMissed")
          ? "회의불참"
          : key.includes("productivity")
          ? "생산성"
          : "사기";
        return (
          <p key={key} className="text-sm">
            {label}: {value}
          </p>
        );
      })}
    </div>
  );
};

export function MultiLineChart({
  data,
  xKey,
  leftYAxisKey,
  rightYAxisKey,
  teams,
  title,
  leftYAxisLabel,
  rightYAxisLabel,
}: MultiLineChartProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      <ResponsiveContainer width="100%" height={500}>
        <RechartsLineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey={xKey}
            label={{
              value: xKey.includes("cups") ? "커피 섭취량 (잔/일)" : "스낵 수",
              position: "insideBottom",
              offset: -5,
            }}
          />
          <YAxis
            yAxisId="left"
            label={{ value: leftYAxisLabel, angle: -90, position: "insideLeft" }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            label={{ value: rightYAxisLabel, angle: 90, position: "insideRight" }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          {teams.map((team) => (
            <>
              <Line
                key={`${team.name}_${team.leftKey}`}
                yAxisId="left"
                type="monotone"
                dataKey={`${team.name}_${team.leftKey}`}
                stroke={team.color}
                strokeWidth={2}
                dot={{ r: 4, fill: team.color }}
                name={`${team.name} - ${leftYAxisLabel}`}
              />
              <Line
                key={`${team.name}_${team.rightKey}`}
                yAxisId="right"
                type="monotone"
                dataKey={`${team.name}_${team.rightKey}`}
                stroke={team.color}
                strokeDasharray="5 5"
                strokeWidth={2}
                dot={(props: any) => (
                  <Dot
                    {...props}
                    r={4}
                    fill={team.color}
                    stroke={team.color}
                    strokeWidth={2}
                  >
                    <rect
                      x={props.cx - 4}
                      y={props.cy - 4}
                      width={8}
                      height={8}
                      fill={team.color}
                    />
                  </Dot>
                )}
                name={`${team.name} - ${rightYAxisLabel}`}
              />
            </>
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
}

