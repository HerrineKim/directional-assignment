/**
 * 인증 API
 * 로그인 요청을 처리하는 API 함수들을 제공합니다.
 */

import { apiClient } from "./client";

/** 로그인 요청 DTO */
export interface LoginRequest {
  email: string;
  password: string;
}

/** 로그인 응답 DTO */
export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
  };
}

/** 인증 API 객체 */
export const authApi = {
  /**
   * 이메일과 비밀번호로 로그인합니다.
   * @param credentials - 로그인 정보 (email, password)
   * @returns 토큰과 사용자 정보
   */
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>(
      "/auth/login",
      credentials
    );
    return response.data;
  },
};

