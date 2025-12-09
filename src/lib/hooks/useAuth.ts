import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../stores/authStore";
import { apiClient } from "../api/client";

export function useAuth(redirectToLogin = false) {
  const router = useRouter();
  const { isAuthenticated, token, logout } = useAuthStore();

  useEffect(() => {
    // Sync token from localStorage to apiClient
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

