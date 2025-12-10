/**
 * 게시글 API
 * 게시글 CRUD 작업을 처리하는 API 함수들을 제공합니다.
 * 목록 조회, 상세 조회, 생성, 수정, 삭제 기능을 포함합니다.
 */

import { apiClient } from "./client";
import type {
  Post,
  PostCreateRequest,
  PostUpdateRequest,
  PostListResponse,
  PostListParams,
} from "../types/post";

/** 게시글 API 객체 */
export const postsApi = {
  /**
   * 게시글 목록을 조회합니다.
   * @param params - 페이지네이션, 정렬, 필터 파라미터
   * @returns 게시글 목록과 커서 정보
   */
  list: async (params?: PostListParams): Promise<PostListResponse> => {
    const response = await apiClient.get<PostListResponse>("/posts", {
      params,
    });
    return response.data;
  },

  /**
   * 게시글 상세 정보를 조회합니다.
   * @param id - 게시글 ID
   * @returns 게시글 상세 정보
   */
  get: async (id: string): Promise<Post> => {
    const response = await apiClient.get<Post>(`/posts/${id}`);
    return response.data;
  },

  /**
   * 새 게시글을 생성합니다.
   * @param data - 게시글 생성 데이터
   * @returns 생성된 게시글
   */
  create: async (data: PostCreateRequest): Promise<Post> => {
    const response = await apiClient.post<Post>("/posts", data);
    return response.data;
  },

  /**
   * 게시글을 수정합니다.
   * @param id - 게시글 ID
   * @param data - 수정할 데이터
   * @returns 수정된 게시글
   */
  update: async (id: string, data: PostUpdateRequest): Promise<Post> => {
    const response = await apiClient.patch<Post>(`/posts/${id}`, data);
    return response.data;
  },

  /**
   * 게시글을 삭제합니다.
   * @param id - 삭제할 게시글 ID
   * @returns 삭제 결과
   */
  delete: async (id: string): Promise<{ ok: boolean; deleted: number }> => {
    const response = await apiClient.delete<{
      ok: boolean;
      deleted: number;
    }>(`/posts/${id}`);
    return response.data;
  },

  /**
   * 모든 게시글을 삭제합니다.
   * @returns 삭제 결과
   */
  deleteAll: async (): Promise<{ ok: boolean; deleted: number }> => {
    const response = await apiClient.delete<{
      ok: boolean;
      deleted: number;
    }>("/posts");
    return response.data;
  },
};

