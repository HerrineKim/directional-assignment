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

