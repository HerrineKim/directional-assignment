"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores/authStore";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, hasHydrated, setHasHydrated } = useAuthStore();

  // Mark hydration as complete on client side
  useEffect(() => {
    if (typeof window !== "undefined") {
      setHasHydrated(true);
    }
  }, [setHasHydrated]);

  useEffect(() => {
    // Wait for hydration to complete before checking auth
    if (!hasHydrated) {
      return;
    }

    if (isAuthenticated) {
      router.push("/board");
    } else {
      router.push("/login");
    }
  }, [isAuthenticated, hasHydrated, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p>로딩 중...</p>
    </div>
  );
}
