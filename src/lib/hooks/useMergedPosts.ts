/**
 * 실제 게시글과 Mock 게시글을 병합하여 제공하는 훅
 * 본인 게시글과 Mock 게시글을 섞어서 표시하며,
 * 소유권 정보를 포함하여 수정/삭제 권한을 구분합니다.
 */

import { useState, useCallback, useEffect, useMemo } from "react";
import { postsApi } from "../api/posts";
import { useAuthStore } from "../stores/authStore";
import type { Post, PostListParams, PostWithOwnership } from "../types/post";

/** useMergedPosts 훅 옵션 */
interface UseMergedPostsOptions {
  limit?: number;
  sort?: PostListParams["sort"];
  order?: PostListParams["order"];
  category?: PostListParams["category"];
  search?: string;
  showOnlyMine?: boolean;
  mockPostsCount?: number;
}

/**
 * 실제 게시글과 Mock 게시글을 병합하여 무한 스크롤을 제공하는 훅
 * @param options - 페이지네이션 및 필터 옵션
 * @returns 병합된 게시글 배열, 로딩 상태, 에러, 더보기 함수 등
 */
export function useMergedPosts(options: UseMergedPostsOptions = {}) {
  const [allPosts, setAllPosts] = useState<PostWithOwnership[]>([]);
  const [displayedPosts, setDisplayedPosts] = useState<PostWithOwnership[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const { user, isAuthenticated } = useAuthStore();
  const itemsPerPage = options.limit || 20;

  // 모든 게시글 로드 (실제 + Mock)
  const loadAllPosts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // 병렬로 두 API 호출
      const promises: [Promise<Post[]>, Promise<Post[]>] = [
        // 사용자 게시글 (인증된 경우에만)
        isAuthenticated
          ? postsApi.list({ limit: 100 }).then((res) => res.items)
          : Promise.resolve([]),
        // Mock 게시글
        postsApi.getMockPosts(options.mockPostsCount || 300).then((res) => res.items),
      ];

      const [userPosts, mockPosts] = await Promise.all(promises);

      // 병합 및 소유권 정보 추가
      const merged: PostWithOwnership[] = [
        ...userPosts.map((post) => ({
          ...post,
          isMine: true,
        })),
        ...mockPosts.map((post) => ({
          ...post,
          isMine: false,
        })),
      ];

      // 필터링 적용
      let filtered = merged;

      // 내 글만 보기 필터
      if (options.showOnlyMine) {
        filtered = filtered.filter((post) => post.isMine);
      }

      // 카테고리 필터
      if (options.category) {
        filtered = filtered.filter((post) => post.category === options.category);
      }

      // 검색 필터
      if (options.search) {
        const searchLower = options.search.toLowerCase();
        const searchTerms = searchLower.split(/\s+/).filter(Boolean);
        filtered = filtered.filter((post) =>
          searchTerms.every(
            (term) =>
              post.title.toLowerCase().includes(term) ||
              post.body.toLowerCase().includes(term)
          )
        );
      }

      // 정렬 적용
      const sortField = options.sort || "createdAt";
      const sortOrder = options.order || "desc";

      filtered.sort((a, b) => {
        let aValue: string | number;
        let bValue: string | number;

        if (sortField === "createdAt") {
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
        } else {
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
        }

        if (sortOrder === "asc") {
          return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
        } else {
          return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
        }
      });

      setAllPosts(filtered);
      setCurrentIndex(0);

      // 초기 표시 데이터 설정
      setDisplayedPosts(filtered.slice(0, itemsPerPage));
      setIsInitialLoad(false);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("게시글 로드에 실패했습니다"));
    } finally {
      setIsLoading(false);
    }
  }, [
    options.category,
    options.search,
    options.sort,
    options.order,
    options.showOnlyMine,
    options.mockPostsCount,
    itemsPerPage,
    isAuthenticated,
  ]);

  // 더 많은 게시글 로드 (클라이언트 사이드 페이지네이션)
  const loadMore = useCallback(async () => {
    const nextIndex = currentIndex + itemsPerPage;
    if (nextIndex < allPosts.length) {
      setIsLoading(true);

      // 자연스러운 로딩 경험을 위한 짧은 지연
      await new Promise((resolve) => setTimeout(resolve, 300));

      setDisplayedPosts((prev) => [...prev, ...allPosts.slice(nextIndex, nextIndex + itemsPerPage)]);
      setCurrentIndex(nextIndex);
      setIsLoading(false);
    }
  }, [currentIndex, itemsPerPage, allPosts]);

  // 더 볼 게시글이 있는지
  const hasMore = useMemo(() => {
    return currentIndex + itemsPerPage < allPosts.length;
  }, [currentIndex, itemsPerPage, allPosts.length]);

  // 새로고침
  const refresh = useCallback(() => {
    setAllPosts([]);
    setDisplayedPosts([]);
    setCurrentIndex(0);
    setIsInitialLoad(true);
    loadAllPosts();
  }, [loadAllPosts]);

  // 옵션 변경 시 자동 새로고침
  useEffect(() => {
    loadAllPosts();
  }, [loadAllPosts]);

  return {
    posts: displayedPosts,
    isLoading: isLoading && isInitialLoad,
    error,
    hasMore,
    loadMore,
    refresh,
    totalCount: allPosts.length,
    myPostsCount: allPosts.filter((p) => p.isMine).length,
  };
}
