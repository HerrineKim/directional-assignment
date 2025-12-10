/**
 * 무한 스크롤 게시글 목록 커스텀 훅
 * 커서 기반 페이지네이션으로 게시글을 불러오고, 무한 스크롤을 지원합니다.
 * 정렬, 필터링, 검색 기능과 함께 중복 게시글 방지 로직을 포함합니다.
 */

import { useState, useCallback } from "react";
import { postsApi } from "../api/posts";
import type { Post, PostListParams } from "../types/post";

/** useInfinitePosts 훅 옵션 */
interface UseInfinitePostsOptions {
  limit?: number;
  sort?: PostListParams["sort"];
  order?: PostListParams["order"];
  category?: PostListParams["category"];
  search?: string;
}

/**
 * 무한 스크롤 게시글 목록을 관리하는 훅
 * @param options - 페이지네이션 및 필터 옵션 (limit, sort, order, category, search)
 * @returns posts (게시글 배열), isLoading, error, hasMore, loadMore (추가 로드), refresh (새로고침)
 * @example
 * const { posts, isLoading, hasMore, loadMore, refresh } = useInfinitePosts({
 *   limit: 20,
 *   sort: "createdAt",
 *   order: "desc",
 *   category: "FREE"
 * });
 */
export function useInfinitePosts(options: UseInfinitePostsOptions = {}) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [nextCursor, setNextCursor] = useState<string>();
  const [prevCursor, setPrevCursor] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  const loadPosts = useCallback(
    async (cursor?: string, isNext = true) => {
      try {
        setIsLoading(true);
        setError(null);

        const params: PostListParams = {
          limit: options.limit || 10,
          ...(cursor && (isNext ? { nextCursor: cursor } : { prevCursor: cursor })),
          ...(options.sort && { sort: options.sort }),
          ...(options.order && { order: options.order }),
          ...(options.category && { category: options.category }),
          ...(options.search && { search: options.search }),
        };

        const response = await postsApi.list(params);

        if (cursor) {
          if (isNext) {
            setPosts((prev) => {
              const existingIds = new Set(prev.map((p) => p.id));
              const newItems = response.items.filter((item) => !existingIds.has(item.id));
              return [...prev, ...newItems];
            });
          } else {
            setPosts((prev) => {
              const existingIds = new Set(prev.map((p) => p.id));
              const newItems = response.items.filter((item) => !existingIds.has(item.id));
              return [...newItems, ...prev];
            });
          }
        } else {
          const uniqueItems = response.items.filter(
            (item, index, self) => index === self.findIndex((p) => p.id === item.id)
          );
          setPosts(uniqueItems);
        }

        setNextCursor(response.nextCursor);
        setPrevCursor(response.prevCursor);
        setHasMore(!!response.nextCursor);
        setIsInitialized(true);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("게시글 로드에 실패했습니다"));
        setHasMore(false);
        setIsInitialized(true);
      } finally {
        setIsLoading(false);
      }
    },
    [options.limit, options.sort, options.order, options.category, options.search]
  );

  const loadMore = useCallback(() => {
    if (!isLoading && hasMore && nextCursor) {
      loadPosts(nextCursor, true);
    }
  }, [isLoading, hasMore, nextCursor, loadPosts]);

  const refresh = useCallback(() => {
    setPosts([]);
    setNextCursor(undefined);
    setPrevCursor(undefined);
    setHasMore(true);
    setIsInitialized(false);
    loadPosts();
  }, [loadPosts]);

  return {
    posts,
    isLoading,
    error,
    hasMore,
    isInitialized,
    loadMore,
    refresh,
  };
}

