/**
 * 인증 상태 관리 커스텀 훅
 * 사용자 인증 상태를 확인하고, 필요시 로그인 페이지로 리다이렉트합니다.
 * localStorage와 Zustand 스토어 간의 토큰 동기화를 처리합니다.
 */

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../stores/authStore";
import { apiClient } from "../api/client";

/**
 * 인증 상태를 관리하는 커스텀 훅
 * @param redirectToLogin - true인 경우 미인증 상태에서 로그인 페이지로 리다이렉트
 * @returns isAuthenticated (인증 여부), logout (로그아웃 함수)
 * @example
 * const { isAuthenticated, logout } = useAuth(true); // 보호된 페이지에서 사용
 */
export function useAuth(redirectToLogin = false) {
  const router = useRouter();
  const { isAuthenticated, token, logout, setHasHydrated } = useAuthStore();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setHasHydrated(true);
    }
  }, [setHasHydrated]);

  useEffect(() => {
    if (token && typeof window !== "undefined") {
      const storedToken = localStorage.getItem("auth_token");
      if (storedToken && storedToken !== token) {
        apiClient.setToken(storedToken);
      } else if (!storedToken) {
        apiClient.setToken(token);
      }
    }

    if (redirectToLogin && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, redirectToLogin, router, token]);

  return {
    isAuthenticated,
    logout,
  };
}

