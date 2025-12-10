/**
 * 공통 유틸리티 함수
 * Tailwind CSS 클래스 병합 등 프로젝트 전반에서 사용되는 유틸리티를 제공합니다.
 */

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Tailwind CSS 클래스들을 병합합니다.
 * clsx로 조건부 클래스를 처리하고, tailwind-merge로 충돌하는 클래스를 해결합니다.
 * @param inputs - 병합할 클래스 값들 (문자열, 객체, 배열 등)
 * @returns 병합된 클래스 문자열
 * @example
 * cn("px-2 py-1", "px-4") // "py-1 px-4"
 * cn("text-red-500", isActive && "text-blue-500") // 조건부 클래스
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
