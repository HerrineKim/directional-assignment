"use client";

import { useState, useEffect } from "react";
import { Search, X, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { POST_CATEGORIES, SORT_FIELDS, SORT_ORDERS } from "@/lib/constants";
import type { Category, SortField, SortOrder } from "@/lib/types/post";

interface PostFiltersProps {
  search: string;
  category: Category | "ALL";
  sort: SortField;
  order: SortOrder;
  onSearchChange: (search: string) => void;
  onCategoryChange: (category: Category | "ALL") => void;
  onSortChange: (sort: SortField) => void;
  onOrderChange: (order: SortOrder) => void;
  onClear: () => void;
}

export function PostFilters({
  search,
  category,
  sort,
  order,
  onSearchChange,
  onCategoryChange,
  onSortChange,
  onOrderChange,
  onClear,
}: PostFiltersProps) {
  const [localSearch, setLocalSearch] = useState(search);

  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchChange(localSearch);
  };

  const hasActiveFilters = category !== "ALL" || sort !== "createdAt" || order !== "desc";
  const hasSearchResult = search !== "";

  return (
    <div className="space-y-4">
      {/* 검색 */}
      <div>
        <label className="text-sm font-medium mb-2 block">검색</label>
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="제목 또는 본문 검색..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="pl-9 pr-9"
            />
            {localSearch && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                onClick={() => setLocalSearch("")}
                title="입력 지우기"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button type="submit" className="flex-1 sm:flex-none">검색</Button>
            {hasSearchResult && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setLocalSearch("");
                  onSearchChange("");
                }}
                title="검색 결과 지우기"
              >
                <RotateCcw className="h-4 w-4" />
                검색 초기화
              </Button>
            )}
          </div>
        </form>
      </div>

      {/* 필터 */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-end">
        {/* 카테고리 필터 */}
        <div>
          <label className="text-sm font-medium mb-2 block">카테고리</label>
          <Select value={category} onValueChange={(value) => onCategoryChange(value as Category | "ALL")}>
            <SelectTrigger className="w-full sm:w-[140px]">
              <SelectValue placeholder="카테고리" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">전체</SelectItem>
              {POST_CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat === "NOTICE" && "공지"}
                  {cat === "QNA" && "질문"}
                  {cat === "FREE" && "자유"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 정렬 필터 그룹 */}
        <div>
          <label className="text-sm font-medium mb-2 block">정렬</label>
          <div className="flex gap-2">
            <Select value={sort} onValueChange={(value) => onSortChange(value as SortField)}>
              <SelectTrigger className="w-full sm:w-[140px]">
                <SelectValue placeholder="정렬 기준" />
              </SelectTrigger>
              <SelectContent>
                {SORT_FIELDS.map((field) => (
                  <SelectItem key={field} value={field}>
                    {field === "createdAt" ? "생성일" : "제목"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={order} onValueChange={(value) => onOrderChange(value as SortOrder)}>
              <SelectTrigger className="w-full sm:w-[120px]">
                <SelectValue placeholder="정렬 방향" />
              </SelectTrigger>
              <SelectContent>
                {SORT_ORDERS.map((ord) => (
                  <SelectItem key={ord} value={ord}>
                    {ord === "asc" ? "오름차순" : "내림차순"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* 초기화 버튼 */}
        {hasActiveFilters && (
          <Button variant="outline" onClick={onClear} className="w-full sm:w-auto">
            <RotateCcw className="h-4 w-4" />
            필터 초기화
          </Button>
        )}
      </div>
    </div>
  );
}

