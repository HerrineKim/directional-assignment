/**
 * 차트 Mock API
 * 대시보드 차트에 사용되는 Mock 데이터를 가져오는 API 함수들을 제공합니다.
 * 커피 브랜드, 간식 브랜드, 주간 무드/운동 트렌드, 커피 소비량, 간식 영향도 등의 데이터를 조회합니다.
 */

import { apiClient } from "./client";
import type {
  TopCoffeeBrandsResponse,
  PopularSnackBrandsResponse,
  WeeklyMoodTrendResponse,
  WeeklyWorkoutTrendResponse,
  CoffeeConsumptionResponse,
  SnackImpactResponse,
} from "../types/chart";

/** Mock API 객체 */
export const mockApi = {
  /** 인기 커피 브랜드 목록 조회 */
  getTopCoffeeBrands: async (): Promise<TopCoffeeBrandsResponse> => {
    const response = await apiClient.get<TopCoffeeBrandsResponse>(
      "/mock/top-coffee-brands"
    );
    return response.data;
  },

  /** 인기 간식 브랜드 목록 조회 */
  getPopularSnackBrands: async (): Promise<PopularSnackBrandsResponse> => {
    const response = await apiClient.get<PopularSnackBrandsResponse>(
      "/mock/popular-snack-brands"
    );
    return response.data;
  },

  /** 주간 무드 트렌드 조회 */
  getWeeklyMoodTrend: async (): Promise<WeeklyMoodTrendResponse> => {
    const response = await apiClient.get<WeeklyMoodTrendResponse>(
      "/mock/weekly-mood-trend"
    );
    return response.data;
  },

  /** 주간 운동 트렌드 조회 */
  getWeeklyWorkoutTrend: async (): Promise<WeeklyWorkoutTrendResponse> => {
    const response = await apiClient.get<WeeklyWorkoutTrendResponse>(
      "/mock/weekly-workout-trend"
    );
    return response.data;
  },

  /** 팀별 커피 소비량 조회 */
  getCoffeeConsumption: async (): Promise<CoffeeConsumptionResponse> => {
    const response = await apiClient.get<CoffeeConsumptionResponse>(
      "/mock/coffee-consumption"
    );
    return response.data;
  },

  /** 부서별 간식 영향도 조회 */
  getSnackImpact: async (): Promise<SnackImpactResponse> => {
    const response = await apiClient.get<SnackImpactResponse>(
      "/mock/snack-impact"
    );
    return response.data;
  },
};

