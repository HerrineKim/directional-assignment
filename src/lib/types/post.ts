/**
 * 게시글 관련 타입 정의
 * 게시글 엔티티, 요청/응답 DTO, 필터링 파라미터 등의 타입을 정의합니다.
 */

/** 게시글 카테고리 타입 */
export type Category = "NOTICE" | "QNA" | "FREE";

/** 정렬 필드 타입 */
export type SortField = "createdAt" | "title";

/** 정렬 방향 타입 */
export type SortOrder = "asc" | "desc";

/** 게시글 엔티티 */
export interface Post {
  id: string;
  userId: string;
  title: string;
  body: string;
  category: Category;
  tags: string[];
  createdAt: string;
}

/** 게시글 생성 요청 DTO */
export interface PostCreateRequest {
  title: string;
  body: string;
  category: Category;
  tags: string[];
}

/** 게시글 수정 요청 DTO */
export interface PostUpdateRequest {
  title?: string;
  body?: string;
  category?: Category;
  tags?: string[];
}

/** 게시글 목록 응답 DTO (커서 기반 페이지네이션) */
export interface PostListResponse {
  items: Post[];
  nextCursor?: string;
  prevCursor?: string;
}

/** 게시글 목록 조회 파라미터 */
export interface PostListParams {
  limit?: number;
  prevCursor?: string;
  nextCursor?: string;
  sort?: SortField;
  order?: SortOrder;
  category?: Category;
  from?: string;
  to?: string;
  search?: string;
}

