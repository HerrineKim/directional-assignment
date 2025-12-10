/**
 * Next.js 미들웨어 - 서버 측 Rate Limiting
 * 모든 요청에 대해 IP 기반 Rate Limiting을 적용합니다.
 *
 * 주요 기능:
 * - 60초당 최대 60개 요청 제한
 * - 정적 리소스 제외 (이미지, 스크립트 등)
 * - Rate Limit 헤더 자동 설정
 * - 429 Too Many Requests 응답 처리
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/** Rate Limit 기록 저장소 (IP별 요청 횟수 및 리셋 시간) */
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

/** Rate Limit 윈도우 (60초) */
const RATE_LIMIT_WINDOW = 60 * 1000;

/** 윈도우당 최대 요청 수 */
const MAX_REQUESTS_PER_WINDOW = 60;

/**
 * 클라이언트 식별자를 생성합니다.
 * IP 주소와 User-Agent를 조합하여 고유 식별자를 만듭니다.
 */
function getClientIdentifier(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const cfConnectingIp = request.headers.get("cf-connecting-ip");
  const ip = forwardedFor?.split(",")[0]?.trim() || realIp || cfConnectingIp || "unknown";
  
  const userAgent = request.headers.get("user-agent") || "";
  
  return `${ip}-${userAgent.slice(0, 50)}`;
}

/**
 * Rate Limit 체크 함수
 * 식별자별 요청 횟수를 확인하고 제한 여부를 반환합니다.
 */
function checkRateLimit(identifier: string): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const record = rateLimitStore.get(identifier);

  if (!record || now > record.resetTime) {
    const newRecord = {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    };
    rateLimitStore.set(identifier, newRecord);
    
    if (rateLimitStore.size > 10000) {
      for (const [key, value] of rateLimitStore.entries()) {
        if (now > value.resetTime) {
          rateLimitStore.delete(key);
        }
      }
    }

    return {
      allowed: true,
      remaining: MAX_REQUESTS_PER_WINDOW - 1,
      resetTime: newRecord.resetTime,
    };
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: record.resetTime,
    };
  }

  record.count++;
  rateLimitStore.set(identifier, record);

  return {
    allowed: true,
    remaining: MAX_REQUESTS_PER_WINDOW - record.count,
    resetTime: record.resetTime,
  };
}

/**
 * Next.js 미들웨어 함수
 * 모든 요청에 대해 Rate Limiting을 적용합니다.
 */
export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.startsWith("/favicon") ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|gif|webp)$/)
  ) {
    return NextResponse.next();
  }

  const identifier = getClientIdentifier(request);
  const rateLimit = checkRateLimit(identifier);

  const response = NextResponse.next();

  response.headers.set("X-RateLimit-Limit", String(MAX_REQUESTS_PER_WINDOW));
  response.headers.set("X-RateLimit-Remaining", String(rateLimit.remaining));
  response.headers.set("X-RateLimit-Reset", String(Math.ceil(rateLimit.resetTime / 1000)));

  if (!rateLimit.allowed) {
    const retryAfter = Math.ceil((rateLimit.resetTime - Date.now()) / 1000);
    response.headers.set("Retry-After", String(retryAfter));
    
    return new NextResponse(
      JSON.stringify({
        error: "Too Many Requests",
        message: "Rate limit exceeded. Please try again later.",
        retryAfter,
      }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          ...Object.fromEntries(response.headers.entries()),
        },
      }
    );
  }

  return response;
}
