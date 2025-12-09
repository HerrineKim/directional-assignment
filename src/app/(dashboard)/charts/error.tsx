"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function ChartsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Charts page error:", error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <CardTitle className="text-destructive">데이터 시각화 오류</CardTitle>
          </div>
          <CardDescription>차트 페이지에서 문제가 발생했습니다.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">{error.message}</p>
          <div className="flex gap-2">
            <Button onClick={reset}>다시 시도</Button>
            <Button variant="outline" onClick={() => window.location.reload()}>
              페이지 새로고침
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

