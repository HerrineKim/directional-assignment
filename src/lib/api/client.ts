import axios, { AxiosInstance, AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { API_BASE_URL } from "../constants";
import { rateLimiter } from "../utils/rateLimiter";

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Request interceptor to add auth token
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

    // Response interceptor to handle errors and rate limiting
    this.client.interceptors.response.use(
      (response) => {
        // Check rate limit headers
        const remaining = response.headers["x-ratelimit-remaining"];
        const reset = response.headers["x-ratelimit-reset"];
        
        if (remaining !== undefined && parseInt(remaining) < 10) {
          console.warn(`Rate limit warning: ${remaining} requests remaining. Reset at ${new Date(parseInt(reset) * 1000).toISOString()}`);
        }
        
        return response;
      },
      async       (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          this.clearToken();
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }
        } else if (error.response?.status === 429) {
          // Rate limit exceeded
          const retryAfter = error.response.headers["retry-after"];
          const message = retryAfter
            ? `Rate limit exceeded. Please try again in ${retryAfter} seconds.`
            : "Rate limit exceeded. Please try again later.";
          
          console.error("Rate limit exceeded:", message);
          
          // Create a new error with a user-friendly message
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

  // Wrapper methods that apply rate limiting on client side
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

