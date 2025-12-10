/**
 * 멀티 라인 차트 컴포넌트
 * 여러 팀/그룹의 데이터를 좌/우 Y축으로 비교 표시하는 라인 차트입니다.
 * 팀별 색상 변경, 라인 표시/숨김, 겹치는 데이터 포인트 감지 기능을 제공합니다.
 */

"use client";

import { useState, useMemo, Fragment } from "react";
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { CustomLegend } from "./CustomLegend";

/** MultiLineChart 컴포넌트 props */
interface MultiLineChartProps {
  data: Array<Record<string, string | number>>;
  xKey: string;
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

interface TooltipPayloadEntry {
  dataKey?: string;
  value?: string | number;
  name?: string | number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadEntry[];
  label?: string | number;
  hoveredTeams?: string[];
}

const CustomTooltip = ({ active, payload, label, hoveredTeams }: CustomTooltipProps) => {
  if (!active || !payload || !payload.length || !hoveredTeams || hoveredTeams.length === 0) return null;

  const teamData: Record<string, Record<string, string | number>> = {};

  hoveredTeams.forEach((teamName) => {
    const teamEntries: Record<string, string | number> = {};
    payload.forEach((entry: TooltipPayloadEntry) => {
      if (entry.dataKey?.startsWith(teamName + "_") && entry.value !== undefined) {
        teamEntries[entry.dataKey] = entry.value;
      }
    });
    if (Object.keys(teamEntries).length > 0) {
      teamData[teamName] = teamEntries;
    }
  });

  if (Object.keys(teamData).length === 0) return null;

  const xValue = label;

  return (
    <div className="bg-background border rounded-lg p-3 shadow-lg">
      <p className="text-sm mb-2 font-medium">
        {typeof xValue === "string" && xValue.includes("잔")
          ? `커피: ${xValue}`
          : typeof xValue === "string" && xValue.includes("개")
          ? `간식: ${xValue}`
          : xValue}
      </p>
      {Object.entries(teamData).map(([teamName, entries]) => (
        <div key={teamName} className="mb-3 last:mb-0">
          <p className="font-semibold mb-1">{teamName}</p>
          {Object.entries(entries).map(([key, value]) => {
            const label = key.includes("bugs")
              ? "버그"
              : key.includes("meetingsMissed")
              ? "회의불참"
              : key.includes("productivity")
              ? "생산성"
              : "사기";
            return (
              <p key={key} className="text-sm pl-2">
                {label}: {value}
              </p>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export function MultiLineChart({
  data,
  xKey,
  teams,
  title,
  leftYAxisLabel,
  rightYAxisLabel,
}: MultiLineChartProps) {
  const [teamColors, setTeamColors] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    teams.forEach((team) => {
      initial[team.name] = team.color;
    });
    return initial;
  });

  const [hiddenItems, setHiddenItems] = useState<Set<string>>(new Set());
  const [hoveredTeams, setHoveredTeams] = useState<string[]>([]);

  const findOverlappingTeams = (
    payload: Record<string, string | number>,
    currentTeam: string,
    dataKey: string
  ): string[] => {
    const currentValue = payload[`${currentTeam}_${dataKey}`];
    if (currentValue === undefined) return [currentTeam];

    const overlapping = [currentTeam];

    teams.forEach((team) => {
      if (team.name === currentTeam) return;

      const teamValue = payload[`${team.name}_${dataKey}`];
      if (teamValue === undefined || teamValue === null) return;

      if (Number(teamValue) === Number(currentValue)) {
        overlapping.push(team.name);
      }
    });

    return overlapping;
  };

  const handleColorChange = (name: string, color: string) => {
    const teamName = name.split(" - ")[0];
    setTeamColors((prev) => ({ ...prev, [teamName]: color }));
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

  const legendItems = useMemo(() => {
    const items: Array<{ name: string; color: string }> = [];
    teams.forEach((team) => {
      const color = teamColors[team.name] || team.color;
      items.push({
        name: `${team.name} - ${leftYAxisLabel}`,
        color,
      });
      items.push({
        name: `${team.name} - ${rightYAxisLabel}`,
        color,
      });
    });
    return items;
  }, [teams, leftYAxisLabel, rightYAxisLabel, teamColors]);

  const groupedLegendItems = useMemo(() => {
    return teams.map((team) => {
      const color = teamColors[team.name] || team.color;
      return {
        team: team.name,
        color,
        items: [
          {
            name: `${team.name} - ${leftYAxisLabel}`,
            color,
          },
          {
            name: `${team.name} - ${rightYAxisLabel}`,
            color,
          },
        ],
      };
    });
  }, [teams, leftYAxisLabel, rightYAxisLabel, teamColors]);

  return (
    <div className="space-y-4">
      {title && <h3 className="text-lg font-semibold">{title}</h3>}
      <div className="h-[450px] sm:h-[600px] pb-8 p-4 bg-linear-to-br from-background to-muted/20 rounded-xl shadow-sm border">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsLineChart data={data} margin={{ bottom: 30 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
            <XAxis
              dataKey={xKey}
              label={{
                value: xKey.includes("cups") ? "커피 섭취량 (잔/일)" : "스낵 수",
                position: "bottom",
                offset: 10,
              }}
              tick={{ fill: 'currentColor', fontSize: 12 }}
              tickLine={{ stroke: 'currentColor', opacity: 0.2 }}
            />
            <YAxis
              yAxisId="left"
              label={{ value: leftYAxisLabel, angle: -90, position: "insideLeft" }}
              tick={{ fill: 'currentColor', fontSize: 12 }}
              tickLine={{ stroke: 'currentColor', opacity: 0.2 }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              label={{ value: rightYAxisLabel, angle: 90, position: "insideRight" }}
              tick={{ fill: 'currentColor', fontSize: 12 }}
              tickLine={{ stroke: 'currentColor', opacity: 0.2 }}
            />
            <Tooltip content={<CustomTooltip hoveredTeams={hoveredTeams} />} cursor={false} />
            {teams.map((team) => {
              const color = teamColors[team.name] || team.color;
              const leftName = `${team.name} - ${leftYAxisLabel}`;
              const rightName = `${team.name} - ${rightYAxisLabel}`;
              return (
                <Fragment key={team.name}>
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey={`${team.name}_${team.leftKey}`}
                    stroke={color}
                    strokeWidth={3}
                    animationDuration={800}
                    animationBegin={0}
                    dot={(props: { cx?: number; cy?: number; payload?: Record<string, string | number> }) => {
                      const { cx, cy, payload } = props;
                      if (cx === undefined || cy === undefined) return null;
                      return (
                        <circle
                          cx={cx}
                          cy={cy}
                          r={4}
                          fill={color}
                          onMouseEnter={() => {
                            if (payload) {
                              const overlapping = findOverlappingTeams(payload, team.name, team.leftKey);
                              setHoveredTeams(overlapping);
                            }
                          }}
                          onMouseLeave={() => setHoveredTeams([])}
                          style={{ cursor: 'pointer' }}
                        />
                      );
                    }}
                    activeDot={(props: { cx?: number; cy?: number; payload?: Record<string, string | number> }) => {
                      const { cx, cy, payload } = props;
                      if (cx === undefined || cy === undefined) return null;
                      return (
                        <circle
                          cx={cx}
                          cy={cy}
                          r={6}
                          fill={color}
                          onMouseEnter={() => {
                            if (payload) {
                              const overlapping = findOverlappingTeams(payload, team.name, team.leftKey);
                              setHoveredTeams(overlapping);
                            }
                          }}
                          onMouseLeave={() => setHoveredTeams([])}
                          style={{ cursor: 'pointer' }}
                        />
                      );
                    }}
                    name={leftName}
                    hide={hiddenItems.has(leftName)}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey={`${team.name}_${team.rightKey}`}
                    stroke={color}
                    strokeDasharray="5 5"
                    strokeWidth={3}
                    animationDuration={800}
                    animationBegin={0}
                    dot={(props: { cx?: number; cy?: number; payload?: Record<string, string | number> }) => {
                      const { cx, cy, payload } = props;
                      if (cx === undefined || cy === undefined) return null;
                      const size = 6;
                      return (
                        <rect
                          x={cx - size / 2}
                          y={cy - size / 2}
                          width={size}
                          height={size}
                          fill={color}
                          stroke={color}
                          strokeWidth={1.5}
                          onMouseEnter={() => {
                            if (payload) {
                              const overlapping = findOverlappingTeams(payload, team.name, team.rightKey);
                              setHoveredTeams(overlapping);
                            }
                          }}
                          onMouseLeave={() => setHoveredTeams([])}
                          style={{ cursor: 'pointer' }}
                        />
                      );
                    }}
                    activeDot={(props: { cx?: number; cy?: number; payload?: Record<string, string | number> }) => {
                      const { cx, cy, payload } = props;
                      if (cx === undefined || cy === undefined) return null;
                      const size = 8;
                      return (
                        <rect
                          x={cx - size / 2}
                          y={cy - size / 2}
                          width={size}
                          height={size}
                          fill={color}
                          stroke={color}
                          strokeWidth={2}
                          onMouseEnter={() => {
                            if (payload) {
                              const overlapping = findOverlappingTeams(payload, team.name, team.rightKey);
                              setHoveredTeams(overlapping);
                            }
                          }}
                          onMouseLeave={() => setHoveredTeams([])}
                          style={{ cursor: 'pointer' }}
                        />
                      );
                    }}
                    name={rightName}
                    hide={hiddenItems.has(rightName)}
                  />
                </Fragment>
              );
            })}
          </RechartsLineChart>
        </ResponsiveContainer>
      </div>
      <CustomLegend
        items={legendItems}
        onColorChange={handleColorChange}
        onToggleVisibility={handleToggleVisibility}
        hiddenItems={hiddenItems}
        groupedByTeam={true}
        groupedItems={groupedLegendItems}
      />
    </div>
  );
}

