"use client";

import { useState, useEffect } from "react";
import { Pencil, FileText } from "lucide-react";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { Button } from "@/components/ui/button";
import { PostForm } from "@/components/board/PostForm";
import { PostFilters } from "@/components/board/PostFilters";
import { PostTable } from "@/components/board/PostTable";
import { useInfinitePosts } from "@/lib/hooks/useInfinitePosts";
import { postsApi } from "@/lib/api/posts";
import type { Post, Category, SortField, SortOrder, PostCreateRequest, PostUpdateRequest } from "@/lib/types/post";
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sort, order, category, debouncedSearch]);

  const handleCreate = async (data: PostFormData) => {
    await postsApi.create(data as PostCreateRequest);
    setIsFormOpen(false);
    refresh();
  };

  const handleUpdate = async (data: PostFormData) => {
    if (!editingPost) return;
    await postsApi.update(editingPost.id, data as PostUpdateRequest);
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
    setCategory("ALL");
    setSort("createdAt");
    setOrder("desc");
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
          <FileText className="h-7 w-7 sm:h-8 sm:w-8" />
          게시판
        </h1>
        <Button
          onClick={() => {
            setEditingPost(null);
            setIsFormOpen(true);
          }}
          className="w-full sm:w-auto"
        >
          <Pencil className="h-4 w-4" />
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

