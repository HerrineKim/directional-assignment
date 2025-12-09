import { apiClient } from "./client";
import type {
  TopCoffeeBrandsResponse,
  PopularSnackBrandsResponse,
  WeeklyMoodTrendResponse,
  WeeklyWorkoutTrendResponse,
  CoffeeConsumptionResponse,
  SnackImpactResponse,
} from "../types/chart";

export const mockApi = {
  getTopCoffeeBrands: async (): Promise<TopCoffeeBrandsResponse> => {
    const response = await apiClient.get<TopCoffeeBrandsResponse>(
      "/mock/top-coffee-brands"
    );
    return response.data;
  },

  getPopularSnackBrands: async (): Promise<PopularSnackBrandsResponse> => {
    const response = await apiClient.get<PopularSnackBrandsResponse>(
      "/mock/popular-snack-brands"
    );
    return response.data;
  },

  getWeeklyMoodTrend: async (): Promise<WeeklyMoodTrendResponse> => {
    const response = await apiClient.get<WeeklyMoodTrendResponse>(
      "/mock/weekly-mood-trend"
    );
    return response.data;
  },

  getWeeklyWorkoutTrend: async (): Promise<WeeklyWorkoutTrendResponse> => {
    const response = await apiClient.get<WeeklyWorkoutTrendResponse>(
      "/mock/weekly-workout-trend"
    );
    return response.data;
  },

  getCoffeeConsumption: async (): Promise<CoffeeConsumptionResponse> => {
    const response = await apiClient.get<CoffeeConsumptionResponse>(
      "/mock/coffee-consumption"
    );
    return response.data;
  },

  getSnackImpact: async (): Promise<SnackImpactResponse> => {
    const response = await apiClient.get<SnackImpactResponse>(
      "/mock/snack-impact"
    );
    return response.data;
  },
};

