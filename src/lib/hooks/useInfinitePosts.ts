import { useState, useCallback } from "react";
import { postsApi } from "../api/posts";
import type { Post, PostListParams } from "../types/post";

interface UseInfinitePostsOptions {
  limit?: number;
  sort?: PostListParams["sort"];
  order?: PostListParams["order"];
  category?: PostListParams["category"];
  search?: string;
}

export function useInfinitePosts(options: UseInfinitePostsOptions = {}) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [nextCursor, setNextCursor] = useState<string | undefined>();
  const [prevCursor, setPrevCursor] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState(true);

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
          ...(options.category && options.category !== "ALL" && { category: options.category }),
          ...(options.search && { search: options.search }),
        };

        const response = await postsApi.list(params);

        if (cursor) {
          // Append or prepend based on direction
          if (isNext) {
            setPosts((prev) => [...prev, ...response.items]);
          } else {
            setPosts((prev) => [...response.items, ...prev]);
          }
        } else {
          // Initial load
          setPosts(response.items);
        }

        setNextCursor(response.nextCursor);
        setPrevCursor(response.prevCursor);
        setHasMore(!!response.nextCursor);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to load posts"));
        setHasMore(false);
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
    loadPosts();
  }, [loadPosts]);

  return {
    posts,
    isLoading,
    error,
    hasMore,
    loadMore,
    refresh,
  };
}

