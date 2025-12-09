import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>로그인</CardTitle>
          <CardDescription>이메일과 비밀번호를 입력해주세요</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="h-4 w-20 animate-pulse rounded bg-muted" />
            <div className="h-9 w-full animate-pulse rounded-md bg-muted" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-20 animate-pulse rounded bg-muted" />
            <div className="h-9 w-full animate-pulse rounded-md bg-muted" />
          </div>
          <div className="h-9 w-full animate-pulse rounded-md bg-muted" />
        </CardContent>
      </Card>
    </div>
  );
}

