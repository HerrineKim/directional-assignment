import { apiClient } from "./client";
import type {
  Post,
  PostCreateRequest,
  PostUpdateRequest,
  PostListResponse,
  PostListParams,
} from "../types/post";

export const postsApi = {
  list: async (params?: PostListParams): Promise<PostListResponse> => {
    const response = await apiClient.instance.get<PostListResponse>("/posts", {
      params,
    });
    return response.data;
  },

  get: async (id: string): Promise<Post> => {
    const response = await apiClient.instance.get<Post>(`/posts/${id}`);
    return response.data;
  },

  create: async (data: PostCreateRequest): Promise<Post> => {
    const response = await apiClient.instance.post<Post>("/posts", data);
    return response.data;
  },

  update: async (id: string, data: PostUpdateRequest): Promise<Post> => {
    const response = await apiClient.instance.patch<Post>(
      `/posts/${id}`,
      data
    );
    return response.data;
  },

  delete: async (id: string): Promise<{ ok: boolean; deleted: number }> => {
    const response = await apiClient.instance.delete<{
      ok: boolean;
      deleted: number;
    }>(`/posts/${id}`);
    return response.data;
  },

  deleteAll: async (): Promise<{ ok: boolean; deleted: number }> => {
    const response = await apiClient.instance.delete<{
      ok: boolean;
      deleted: number;
    }>("/posts");
    return response.data;
  },
};

