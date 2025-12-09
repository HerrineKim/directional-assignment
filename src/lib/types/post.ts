export type Category = "NOTICE" | "QNA" | "FREE";

export type SortField = "createdAt" | "title";
export type SortOrder = "asc" | "desc";

export interface Post {
  id: string;
  userId: string;
  title: string;
  body: string;
  category: Category;
  tags: string[];
  createdAt: string;
}

export interface PostCreateRequest {
  title: string;
  body: string;
  category: Category;
  tags: string[];
}

export interface PostUpdateRequest {
  title?: string;
  body?: string;
  category?: Category;
  tags?: string[];
}

export interface PostListResponse {
  items: Post[];
  nextCursor?: string;
  prevCursor?: string;
}

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

