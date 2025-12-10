/**
 * API 클라이언트
 * Axios 기반의 HTTP 클라이언트로, 인증 토큰 관리와 Rate Limiting을 처리합니다.
 *
 * 주요 기능:
 * - 자동 토큰 주입 (Authorization 헤더)
 * - 401 응답 시 자동 로그아웃 및 리다이렉트
 * - 429 응답 시 Rate Limit 에러 처리
 * - 클라이언트 측 Rate Limiting (rateLimiter 연동)
 */

import axios, { AxiosInstance, AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { API_BASE_URL } from "../constants";
import { rateLimiter } from "../utils/rateLimiter";

/**
 * API 클라이언트 클래스
 * 싱글톤 패턴으로 사용됩니다.
 */
class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.client.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    this.client.interceptors.response.use(
      (response) => {
        const remaining = response.headers["x-ratelimit-remaining"];
        const reset = response.headers["x-ratelimit-reset"];
        
        if (remaining !== undefined && parseInt(remaining) < 10) {
          console.warn(`Rate limit warning: ${remaining} requests remaining. Reset at ${new Date(parseInt(reset) * 1000).toISOString()}`);
        }
        
        return response;
      },
      async       (error: AxiosError) => {
        if (error.response?.status === 401) {
          this.clearToken();
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }
        } else if (error.response?.status === 429) {
          const retryAfter = error.response.headers["retry-after"];
          const message = retryAfter
            ? `Rate limit exceeded. Please try again in ${retryAfter} seconds.`
            : "Rate limit exceeded. Please try again later.";
          
          console.error("Rate limit exceeded:", message);
          
          const rateLimitError = new Error(message) as Error & { status?: number; retryAfter?: string };
          rateLimitError.status = 429;
          rateLimitError.retryAfter = retryAfter;
          return Promise.reject(rateLimitError);
        }
        return Promise.reject(error);
      }
    );
  }

  private getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("auth_token");
  }

  private clearToken(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem("auth_token");
  }

  public setToken(token: string): void {
    if (typeof window === "undefined") return;
    localStorage.setItem("auth_token", token);
  }

  public clearAuth(): void {
    this.clearToken();
  }

  public get instance(): AxiosInstance {
    return this.client;
  }

  public async request<T = unknown>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    if (typeof window !== "undefined") {
      return rateLimiter.execute(() => this.client.request<T>(config));
    }
    return this.client.request<T>(config);
  }

  public async get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    if (typeof window !== "undefined") {
      return rateLimiter.execute(() => this.client.get<T>(url, config));
    }
    return this.client.get<T>(url, config);
  }

  public async post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    if (typeof window !== "undefined") {
      return rateLimiter.execute(() => this.client.post<T>(url, data, config));
    }
    return this.client.post<T>(url, data, config);
  }

  public async patch<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    if (typeof window !== "undefined") {
      return rateLimiter.execute(() => this.client.patch<T>(url, data, config));
    }
    return this.client.patch<T>(url, data, config);
  }

  public async delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    if (typeof window !== "undefined") {
      return rateLimiter.execute(() => this.client.delete<T>(url, config));
    }
    return this.client.delete<T>(url, config);
  }
}

export const apiClient = new ApiClient();

