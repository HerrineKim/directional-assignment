"use client";

import { useState, useEffect, useMemo } from "react";
import { BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart } from "@/components/charts/BarChart";
import { DonutChart } from "@/components/charts/DonutChart";
import { StackedBarChart } from "@/components/charts/StackedBarChart";
import { StackedAreaChart } from "@/components/charts/StackedAreaChart";
import { MultiLineChart } from "@/components/charts/MultiLineChart";
import { mockApi } from "@/lib/api/mock";
import ChartsLoading from "./loading";
import type {
  TopCoffeeBrandsResponse,
  PopularSnackBrandsResponse,
  WeeklyMoodTrendResponse,
  WeeklyWorkoutTrendResponse,
  CoffeeConsumptionResponse,
  SnackImpactResponse,
} from "@/lib/types/chart";

const COLORS = [
  "#FF6B9D", // 핑크
  "#C44569", // 라즈베리
  "#FFA07A", // 연어
  "#FFD93D", // 밝은 노랑
  "#6BCB77", // 민트 그린
  "#4D96FF", // 밝은 파랑
  "#9D84B7", // 라벤더
  "#FDA085", // 복숭아
];

export default function ChartsPage() {
  const [coffeeBrands, setCoffeeBrands] = useState<TopCoffeeBrandsResponse | null>(null);
  const [snackBrands, setSnackBrands] = useState<PopularSnackBrandsResponse | null>(null);
  const [moodTrend, setMoodTrend] = useState<WeeklyMoodTrendResponse | null>(null);
  const [workoutTrend, setWorkoutTrend] = useState<WeeklyWorkoutTrendResponse | null>(null);
  const [coffeeConsumption, setCoffeeConsumption] = useState<CoffeeConsumptionResponse | null>(null);
  const [snackImpact, setSnackImpact] = useState<SnackImpactResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const [coffee, snacks, mood, workout, coffeeCons, snackImp] = await Promise.all([
          mockApi.getTopCoffeeBrands(),
          mockApi.getPopularSnackBrands(),
          mockApi.getWeeklyMoodTrend(),
          mockApi.getWeeklyWorkoutTrend(),
          mockApi.getCoffeeConsumption(),
          mockApi.getSnackImpact(),
        ]);
        setCoffeeBrands(coffee);
        setSnackBrands(snacks);
        setMoodTrend(mood);
        setWorkoutTrend(workout);
        setCoffeeConsumption(coffeeCons);
        setSnackImpact(snackImp);
      } catch (err) {
        setError(err instanceof Error ? err.message : "데이터를 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // Transform coffee brands data
  const coffeeBarData = useMemo(() => {
    if (!coffeeBrands) return [];
    return coffeeBrands.map((item) => ({
      name: item.brand,
      value: item.popularity,
    }));
  }, [coffeeBrands]);

  const coffeeDonutData = useMemo(() => {
    if (!coffeeBrands) return [];
    return coffeeBrands.map((item) => ({
      name: item.brand,
      value: item.popularity,
    }));
  }, [coffeeBrands]);

  // Transform snack brands data
  const snackBarData = useMemo(() => {
    if (!snackBrands) return [];
    return snackBrands.map((item) => ({
      name: item.name,
      value: item.share,
    }));
  }, [snackBrands]);

  const snackDonutData = useMemo(() => {
    if (!snackBrands) return [];
    return snackBrands.map((item) => ({
      name: item.name,
      value: item.share,
    }));
  }, [snackBrands]);

  // Transform mood trend data
  const moodStackKeys = useMemo(
    () => [
      { key: "happy", name: "행복", color: COLORS[0] },
      { key: "tired", name: "피곤", color: COLORS[1] },
      { key: "stressed", name: "스트레스", color: COLORS[2] },
    ],
    []
  );

  // Transform workout trend data
  const workoutStackKeys = useMemo(
    () => [
      { key: "running", name: "러닝", color: COLORS[0] },
      { key: "cycling", name: "사이클링", color: COLORS[1] },
      { key: "stretching", name: "스트레칭", color: COLORS[2] },
    ],
    []
  );

  // Normalize workout trend data to percentages (sum to 100%)
  // Keep original values for tooltip display
  const normalizedWorkoutTrend = useMemo(() => {
    if (!workoutTrend) return [];
    return workoutTrend.map((item) => {
      const running = Number(item.running) || 0;
      const cycling = Number(item.cycling) || 0;
      const stretching = Number(item.stretching) || 0;
      const total = running + cycling + stretching;
      
      if (total === 0) {
        return {
          ...item,
          running: 0,
          cycling: 0,
          stretching: 0,
          running_original: running,
          cycling_original: cycling,
          stretching_original: stretching,
        };
      }
      
      return {
        ...item,
        running: (running / total) * 100,
        cycling: (cycling / total) * 100,
        stretching: (stretching / total) * 100,
        running_original: running,
        cycling_original: cycling,
        stretching_original: stretching,
      };
    });
  }, [workoutTrend]);

  // Transform coffee consumption data
  const coffeeConsumptionData = useMemo(() => {
    if (!coffeeConsumption) return [];
    const teams = coffeeConsumption.teams;
    const allCups = Array.from(
      new Set(teams.flatMap((t) => t.series.map((s) => s.cups)))
    ).sort((a, b) => a - b);
    
    return allCups.map((cups) => {
      const dataPoint: Record<string, string | number> = { cups: `${cups}잔` };
      teams.forEach((team) => {
        const point = team.series.find((s) => s.cups === cups);
        if (point) {
          dataPoint[`${team.team}_bugs`] = point.bugs;
          dataPoint[`${team.team}_productivity`] = point.productivity;
        }
      });
      return dataPoint;
    });
  }, [coffeeConsumption]);

  const coffeeTeams = useMemo(() => {
    if (!coffeeConsumption) return [];
    return coffeeConsumption.teams.map((team, idx) => ({
      name: team.team,
      leftKey: "bugs",
      rightKey: "productivity",
      color: COLORS[idx % COLORS.length],
    }));
  }, [coffeeConsumption]);

  // Transform snack impact data
  const snackImpactData = useMemo(() => {
    if (!snackImpact) return [];
    const departments = snackImpact.departments;
    const allSnacks = Array.from(
      new Set(departments.flatMap((d) => d.metrics.map((m) => m.snacks)))
    ).sort((a, b) => a - b);
    
    return allSnacks.map((snacks) => {
      const dataPoint: Record<string, string | number> = { snacks: `${snacks}개` };
      departments.forEach((dept) => {
        const point = dept.metrics.find((m) => m.snacks === snacks);
        if (point) {
          dataPoint[`${dept.name}_meetingsMissed`] = point.meetingsMissed;
          dataPoint[`${dept.name}_morale`] = point.morale;
        }
      });
      return dataPoint;
    });
  }, [snackImpact]);

  const snackTeams = useMemo(() => {
    if (!snackImpact) return [];
    return snackImpact.departments.map((dept, idx) => ({
      name: dept.name,
      leftKey: "meetingsMissed",
      rightKey: "morale",
      color: COLORS[idx % COLORS.length],
    }));
  }, [snackImpact]);

  if (isLoading) {
    return <ChartsLoading />;
  }

  if (error) {
    return (
      <div className="rounded-md bg-destructive/10 p-4 text-destructive">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
        <BarChart3 className="h-7 w-7 sm:h-8 sm:w-8" />
        데이터 시각화
      </h1>

      {/* Coffee Brands */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>인기 커피 브랜드 (바 차트)</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart
              data={coffeeBarData}
              dataKey="value"
              nameKey="name"
              title=""
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>인기 커피 브랜드 (도넛 차트)</CardTitle>
          </CardHeader>
          <CardContent>
            <DonutChart
              data={coffeeDonutData}
              dataKey="value"
              nameKey="name"
              title=""
            />
          </CardContent>
        </Card>
      </div>

      {/* Snack Brands */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>인기 간식 브랜드 (바 차트)</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart
              data={snackBarData}
              dataKey="value"
              nameKey="name"
              title=""
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>인기 간식 브랜드 (도넛 차트)</CardTitle>
          </CardHeader>
          <CardContent>
            <DonutChart
              data={snackDonutData}
              dataKey="value"
              nameKey="name"
              title=""
            />
          </CardContent>
        </Card>
      </div>

      {/* Mood Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>주간 무드 트렌드 (스택형 바 차트)</CardTitle>
          </CardHeader>
          <CardContent>
            <StackedBarChart
              data={moodTrend || []}
              xKey="week"
              stackKeys={moodStackKeys}
              title=""
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>주간 무드 트렌드 (스택형 면적 차트)</CardTitle>
          </CardHeader>
          <CardContent>
            <StackedAreaChart
              data={moodTrend || []}
              xKey="week"
              stackKeys={moodStackKeys}
              title=""
            />
          </CardContent>
        </Card>
      </div>

      {/* Workout Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>주간 운동 트렌드 (스택형 바 차트)</CardTitle>
          </CardHeader>
          <CardContent>
            <StackedBarChart
              data={normalizedWorkoutTrend}
              xKey="week"
              stackKeys={workoutStackKeys}
              title=""
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>주간 운동 트렌드 (스택형 면적 차트)</CardTitle>
          </CardHeader>
          <CardContent>
            <StackedAreaChart
              data={normalizedWorkoutTrend}
              xKey="week"
              stackKeys={workoutStackKeys}
              title=""
            />
          </CardContent>
        </Card>
      </div>

      {/* Coffee Consumption */}
      <Card>
        <CardHeader>
          <CardTitle>팀별 커피 소비 영향</CardTitle>
        </CardHeader>
        <CardContent>
          <MultiLineChart
            data={coffeeConsumptionData}
            xKey="cups"
            leftYAxisKey="bugs"
            rightYAxisKey="productivity"
            teams={coffeeTeams}
            title=""
            leftYAxisLabel="버그 수"
            rightYAxisLabel="생산성 점수"
          />
        </CardContent>
      </Card>

      {/* Snack Impact */}
      <Card>
        <CardHeader>
          <CardTitle>부서별 간식 영향</CardTitle>
        </CardHeader>
        <CardContent>
          <MultiLineChart
            data={snackImpactData}
            xKey="snacks"
            leftYAxisKey="meetingsMissed"
            rightYAxisKey="morale"
            teams={snackTeams}
            title=""
            leftYAxisLabel="회의불참"
            rightYAxisLabel="사기"
          />
        </CardContent>
      </Card>
    </div>
  );
}

