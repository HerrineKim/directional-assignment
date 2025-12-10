/**
 * 디바운스 커스텀 훅
 * 입력값의 변경을 지연시켜 불필요한 연산이나 API 호출을 줄입니다.
 * 주로 검색 입력 필드에서 타이핑 중 과도한 API 호출을 방지하는 데 사용됩니다.
 */

import { useState, useEffect } from "react";

/**
 * 값의 변경을 지연시키는 디바운스 훅
 * @param value - 디바운스할 값
 * @param delay - 지연 시간 (ms)
 * @returns 지연된 값 (delay 시간 동안 변경이 없으면 최신 값 반환)
 * @example
 * const [search, setSearch] = useState("");
 * const debouncedSearch = useDebounce(search, 500);
 * debouncedSearch는 타이핑 멈춘 후 500ms 후에 업데이트됨
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

