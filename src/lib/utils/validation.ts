/**
 * 폼 유효성 검사 스키마
 * Zod를 사용한 게시글 폼 데이터 유효성 검사 스키마를 정의합니다.
 * 제목, 본문, 카테고리, 태그에 대한 길이 제한 및 금지어 검사를 포함합니다.
 */

import { z } from "zod";
import {
  MAX_TITLE_LENGTH,
  MAX_BODY_LENGTH,
  MAX_TAGS,
  MAX_TAG_LENGTH,
  POST_CATEGORIES,
} from "../constants";
import { containsProfanity } from "./profanity";
import type { Category } from "../types/post";

/**
 * 게시글 폼 유효성 검사 스키마
 * - title: 1~80자, 금지어 불포함
 * - body: 1~2000자, 금지어 불포함
 * - category: NOTICE, QNA, FREE 중 하나
 * - tags: 최대 5개, 각 24자 이하, 금지어 불포함
 */
export const postSchema = z.object({
  title: z
    .string()
    .min(1, "제목을 입력해주세요")
    .max(MAX_TITLE_LENGTH, `제목은 ${MAX_TITLE_LENGTH}자 이하여야 합니다`)
    .refine(
      (val) => !containsProfanity(val),
      "제목에 금지된 단어가 포함되어 있습니다"
    ),
  body: z
    .string()
    .min(1, "본문을 입력해주세요")
    .max(MAX_BODY_LENGTH, `본문은 ${MAX_BODY_LENGTH}자 이하여야 합니다`)
    .refine(
      (val) => !containsProfanity(val),
      "본문에 금지된 단어가 포함되어 있습니다"
    ),
  category: z.enum([...POST_CATEGORIES] as [Category, ...Category[]], {
    message: "카테고리를 선택해주세요",
  }),
  tags: z
    .array(z.string().max(MAX_TAG_LENGTH, `태그는 ${MAX_TAG_LENGTH}자 이하여야 합니다`))
    .max(MAX_TAGS, `태그는 최대 ${MAX_TAGS}개까지 입력 가능합니다`)
    .refine(
      (tags) => !tags.some((tag) => containsProfanity(tag)),
      "태그에 금지된 단어가 포함되어 있습니다"
    )
    .default([]),
});

export type PostFormData = z.infer<typeof postSchema>;

