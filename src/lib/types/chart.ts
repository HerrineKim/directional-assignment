export interface TopCoffeeBrandItem {
  brand: string;
  popularity: number;
}

export type TopCoffeeBrandsResponse = TopCoffeeBrandItem[];

export interface PopularSnackBrandItem {
  name: string;
  share: number;
}

export type PopularSnackBrandsResponse = PopularSnackBrandItem[];

export interface WeeklyMoodItem extends Record<string, string | number> {
  week: string;
  happy: number;
  tired: number;
  stressed: number;
}

export type WeeklyMoodTrendResponse = WeeklyMoodItem[];

export interface WeeklyWorkoutItem extends Record<string, string | number> {
  week: string;
  running: number;
  cycling: number;
  stretching: number;
}

export type WeeklyWorkoutTrendResponse = WeeklyWorkoutItem[];

export interface CoffeeDataPoint {
  cups: number;
  bugs: number;
  productivity: number;
}

export interface CoffeeTeam {
  team: string;
  series: CoffeeDataPoint[];
}

export interface CoffeeConsumptionResponse {
  teams: CoffeeTeam[];
}

export interface SnackImpactDataPoint {
  snacks: number;
  meetingsMissed: number;
  morale: number;
}

export interface SnackImpactDepartment {
  name: string;
  metrics: SnackImpactDataPoint[];
}

export interface SnackImpactResponse {
  departments: SnackImpactDepartment[];
}

