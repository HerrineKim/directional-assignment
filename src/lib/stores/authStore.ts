import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AxiosError } from "axios";
import { apiClient } from "../api/client";
import { authApi } from "../api/auth";
import type { LoginRequest, LoginResponse } from "../api/auth";

interface AuthState {
  token: string | null;
  user: LoginResponse["user"] | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  hasHydrated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  setHasHydrated: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      hasHydrated: false,
      setHasHydrated: (value: boolean) => {
        set({ hasHydrated: value });
      },
      login: async (credentials: LoginRequest) => {
        try {
          set({ isLoading: true, error: null });
          const response = await authApi.login(credentials);
          apiClient.setToken(response.token);
          set({
            token: response.token,
            user: response.user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (err: unknown) {
          let errorMessage = "로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.";
          
          if (err instanceof AxiosError) {
            if (err.response?.status === 401) {
              errorMessage = "이메일 또는 비밀번호가 올바르지 않습니다.";
            } else if (err.response?.data?.message) {
              errorMessage = err.response.data.message;
            } else if (err.message) {
              errorMessage = err.message;
            }
          } else if (err instanceof Error) {
            errorMessage = err.message;
          }
          
          set({
            isLoading: false,
            error: errorMessage,
          });
          throw err;
        }
      },
      logout: () => {
        apiClient.clearAuth();
        set({
          token: null,
          user: null,
          isAuthenticated: false,
          error: null,
        });
      },
      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.token) {
          apiClient.setToken(state.token);
        }
      },
    }
  )
);

