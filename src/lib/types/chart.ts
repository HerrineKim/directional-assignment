// Top Coffee Brands
export interface TopCoffeeBrandItem {
  brand: string;
  popularity: number;
}

export type TopCoffeeBrandsResponse = TopCoffeeBrandItem[];

// Popular Snack Brands
export interface PopularSnackBrandItem {
  name: string;
  share: number;
}

export type PopularSnackBrandsResponse = PopularSnackBrandItem[];

// Weekly Mood Trend
export interface WeeklyMoodItem {
  week: string;
  happy: number;
  tired: number;
  stressed: number;
}

export type WeeklyMoodTrendResponse = WeeklyMoodItem[];

// Weekly Workout Trend
export interface WeeklyWorkoutItem {
  week: string;
  running: number;
  cycling: number;
  stretching: number;
}

export type WeeklyWorkoutTrendResponse = WeeklyWorkoutItem[];

// Coffee Consumption
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

// Snack Impact
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

