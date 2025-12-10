"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores/authStore";

export default function Home() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const setHasHydrated = useAuthStore((state) => state.setHasHydrated);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setHasHydrated(true);
    }
  }, [setHasHydrated]);

  useEffect(() => {
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
