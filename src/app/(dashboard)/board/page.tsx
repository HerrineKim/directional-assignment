"use client";

import { useState, useEffect } from "react";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { Button } from "@/components/ui/button";
import { PostForm } from "@/components/board/PostForm";
import { PostFilters } from "@/components/board/PostFilters";
import { PostTable } from "@/components/board/PostTable";
import { useInfinitePosts } from "@/lib/hooks/useInfinitePosts";
import { postsApi } from "@/lib/api/posts";
import type { Post, Category, SortField, SortOrder } from "@/lib/types/post";
import type { PostFormData } from "@/lib/utils/validation";

export default function BoardPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<Category | "ALL">("ALL");
  const [sort, setSort] = useState<SortField>("createdAt");
  const [order, setOrder] = useState<SortOrder>("desc");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  const debouncedSearch = useDebounce(search, 500);

  const { posts, isLoading, error, hasMore, loadMore, refresh } = useInfinitePosts({
    limit: 20,
    sort,
    order,
    category: category !== "ALL" ? category : undefined,
    search: debouncedSearch,
  });

  useEffect(() => {
    refresh();
  }, [sort, order, category, debouncedSearch]);

  const handleCreate = async (data: PostFormData) => {
    await postsApi.create(data);
    setIsFormOpen(false);
    refresh();
  };

  const handleUpdate = async (data: PostFormData) => {
    if (!editingPost) return;
    await postsApi.update(editingPost.id, data);
    setIsFormOpen(false);
    setEditingPost(null);
    refresh();
  };

  const handleEdit = (post: Post) => {
    setEditingPost(post);
    setIsFormOpen(true);
  };

  const handleDelete = async (postId: string) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      await postsApi.delete(postId);
      refresh();
    }
  };

  const handleFormSubmit = async (data: PostFormData) => {
    if (editingPost) {
      await handleUpdate(data);
    } else {
      await handleCreate(data);
    }
  };

  const handleClearFilters = () => {
    setSearch("");
    setCategory("ALL");
    setSort("createdAt");
    setOrder("desc");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">게시판</h1>
        <Button onClick={() => {
          setEditingPost(null);
          setIsFormOpen(true);
        }}>
          게시글 작성
        </Button>
      </div>

      <PostFilters
        search={search}
        category={category}
        sort={sort}
        order={order}
        onSearchChange={setSearch}
        onCategoryChange={setCategory}
        onSortChange={setSort}
        onOrderChange={setOrder}
        onClear={handleClearFilters}
      />

      {error && (
        <div className="rounded-md bg-destructive/10 p-4 text-destructive">
          {error.message}
        </div>
      )}

      <PostTable
        posts={posts}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onLoadMore={loadMore}
        hasMore={hasMore}
        isLoading={isLoading}
      />

      <PostForm
        open={isFormOpen}
        onOpenChange={(open) => {
          setIsFormOpen(open);
          if (!open) {
            setEditingPost(null);
          }
        }}
        onSubmit={handleFormSubmit}
        initialData={editingPost}
      />
    </div>
  );
}

