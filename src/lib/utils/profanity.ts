/**
 * 비속어/금지어 필터링 유틸리티
 * 게시글 제목, 본문, 태그에서 금지된 단어를 감지하는 함수들을 제공합니다.
 */

import { PROFANITY_WORDS } from "../constants";

/**
 * 텍스트에 금지된 단어가 포함되어 있는지 확인합니다.
 * @param text - 검사할 텍스트
 * @returns 금지어가 포함되어 있으면 true, 없으면 false
 * @example
 * containsProfanity("안녕하세요") // false
 * containsProfanity("텔레그램으로 연락주세요") // true
 */
export function containsProfanity(text: string): boolean {
  const lowerText = text.toLowerCase();
  return PROFANITY_WORDS.some((word) => lowerText.includes(word.toLowerCase()));
}

