/**
 * 차트 데이터 관련 타입 정의
 * 대시보드 차트에서 사용되는 API 응답 타입들을 정의합니다.
 * 커피 소비량, 간식 브랜드, 주간 무드/운동 트렌드 등의 데이터 구조를 포함합니다.
 */

/** 커피 브랜드 인기도 아이템 */
export interface TopCoffeeBrandItem {
  brand: string;
  popularity: number;
}

/** 인기 커피 브랜드 목록 응답 */
export type TopCoffeeBrandsResponse = TopCoffeeBrandItem[];

/** 인기 간식 브랜드 아이템 */
export interface PopularSnackBrandItem {
  name: string;
  share: number;
}

/** 인기 간식 브랜드 목록 응답 */
export type PopularSnackBrandsResponse = PopularSnackBrandItem[];

/** 주간 무드 트렌드 아이템 */
export interface WeeklyMoodItem extends Record<string, string | number> {
  week: string;
  happy: number;
  tired: number;
  stressed: number;
}

/** 주간 무드 트렌드 응답 */
export type WeeklyMoodTrendResponse = WeeklyMoodItem[];

/** 주간 운동 트렌드 아이템 */
export interface WeeklyWorkoutItem extends Record<string, string | number> {
  week: string;
  running: number;
  cycling: number;
  stretching: number;
}

/** 주간 운동 트렌드 응답 */
export type WeeklyWorkoutTrendResponse = WeeklyWorkoutItem[];

/** 커피 소비 데이터 포인트 (커피잔 수, 버그 수, 생산성) */
export interface CoffeeDataPoint {
  cups: number;
  bugs: number;
  productivity: number;
}

/** 팀별 커피 소비 데이터 */
export interface CoffeeTeam {
  team: string;
  series: CoffeeDataPoint[];
}

/** 커피 소비량 응답 */
export interface CoffeeConsumptionResponse {
  teams: CoffeeTeam[];
}

/** 간식 영향도 데이터 포인트 */
export interface SnackImpactDataPoint {
  snacks: number;
  meetingsMissed: number;
  morale: number;
}

/** 부서별 간식 영향도 데이터 */
export interface SnackImpactDepartment {
  name: string;
  metrics: SnackImpactDataPoint[];
}

/** 간식 영향도 응답 */
export interface SnackImpactResponse {
  departments: SnackImpactDepartment[];
}

