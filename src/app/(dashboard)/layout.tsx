"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Menu, FileText, BarChart3 } from "lucide-react";
import { useAuthStore } from "@/lib/stores/authStore";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, logout, user, hasHydrated, setHasHydrated } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setHasHydrated(true);
    }
  }, [setHasHydrated]);

  // 로딩 중에만 로딩 화면 표시 (로그인 체크 제거)
  if (!hasHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>로딩 중...</p>
      </div>
    );
  }

  const navLinks = (
    <>
      <Link
        href="/board"
        className="text-base font-medium hover:text-primary transition-colors py-2 px-3 rounded-md hover:bg-accent flex items-center gap-2"
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <FileText className="h-4 w-4" />
        게시판
      </Link>
      <Link
        href="/charts"
        className="text-base font-medium hover:text-primary transition-colors py-2 px-3 rounded-md hover:bg-accent flex items-center gap-2"
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <BarChart3 className="h-4 w-4" />
        데이터 시각화
      </Link>
    </>
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b sticky top-0 z-50 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <nav className="hidden md:flex items-center gap-6">{navLinks}</nav>

          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">메뉴 열기</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] sm:w-[320px] p-0">
              <SheetHeader className="px-6 pt-6 pb-4 border-b">
                <SheetTitle>메뉴</SheetTitle>
                <SheetDescription>페이지를 선택하세요</SheetDescription>
              </SheetHeader>
              <nav className="flex flex-col px-6 py-4 gap-2">{navLinks}</nav>
            </SheetContent>
          </Sheet>

          {/* User Info & Auth Button */}
          <div className="flex items-center gap-2 sm:gap-4">
            {isAuthenticated ? (
              <>
                <span className="hidden sm:inline-block text-sm text-muted-foreground truncate max-w-[150px]">
                  {user?.email}
                </span>
                <Button
                  variant="outline"
                  onClick={logout}
                  size="sm"
                  className="text-xs sm:text-sm"
                >
                  로그아웃
                </Button>
              </>
            ) : (
              <Button
                variant="default"
                onClick={() => router.push("/login")}
                size="sm"
                className="text-xs sm:text-sm"
              >
                로그인
              </Button>
            )}
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-4 sm:py-8">{children}</main>
    </div>
  );
}

