"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useInView } from "react-intersection-observer";
import { Edit, Trash2, GripVertical } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ColumnVisibility, type ColumnConfig } from "./ColumnVisibility";
import type { Post } from "@/lib/types/post";

interface PostTableProps {
  posts: Post[];
  onEdit: (post: Post) => void;
  onDelete: (postId: string) => void;
  onLoadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
}

const STORAGE_KEY_COLUMNS = "post_table_columns";
const STORAGE_KEY_WIDTHS = "post_table_widths";

const defaultColumns: ColumnConfig[] = [
  { id: "id", label: "ID", visible: true },
  { id: "title", label: "제목", visible: true },
  { id: "body", label: "본문", visible: true },
  { id: "category", label: "카테고리", visible: true },
  { id: "tags", label: "태그", visible: true },
  { id: "createdAt", label: "생성일", visible: true },
];

const defaultWidths: Record<string, number> = {
  id: 120,
  title: 200,
  body: 300,
  category: 100,
  tags: 200,
  createdAt: 180,
};

export function PostTable({
  posts,
  onEdit,
  onDelete,
  onLoadMore,
  hasMore,
  isLoading,
}: PostTableProps) {
  const [columns, setColumns] = useState<ColumnConfig[]>(() => {
    if (typeof window === "undefined") return defaultColumns;
    const stored = localStorage.getItem(STORAGE_KEY_COLUMNS);
    return stored ? JSON.parse(stored) : defaultColumns;
  });

  const [columnWidths, setColumnWidths] = useState<Record<string, number>>(() => {
    if (typeof window === "undefined") return defaultWidths;
    const stored = localStorage.getItem(STORAGE_KEY_WIDTHS);
    return stored ? JSON.parse(stored) : defaultWidths;
  });

  const [resizingColumn, setResizingColumn] = useState<string | null>(null);
  const [resizeStartX, setResizeStartX] = useState(0);
  const [resizeStartWidth, setResizeStartWidth] = useState(0);
  const tableRef = useRef<HTMLTableElement>(null);

  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0,
    rootMargin: "100px",
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_COLUMNS, JSON.stringify(columns));
  }, [columns]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_WIDTHS, JSON.stringify(columnWidths));
  }, [columnWidths]);

  useEffect(() => {
    if (inView && hasMore && !isLoading) {
      onLoadMore();
    }
  }, [inView, hasMore, isLoading, onLoadMore]);

  const handleMouseDown = (columnId: string, e: React.MouseEvent) => {
    e.preventDefault();
    setResizingColumn(columnId);
    setResizeStartX(e.clientX);
    setResizeStartWidth(columnWidths[columnId] || defaultWidths[columnId]);
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!resizingColumn) return;
      const diff = e.clientX - resizeStartX;
      const newWidth = Math.max(50, resizeStartWidth + diff);
      setColumnWidths((prev) => ({
        ...prev,
        [resizingColumn]: newWidth,
      }));
    },
    [resizingColumn, resizeStartX, resizeStartWidth]
  );

  const handleMouseUp = useCallback(() => {
    setResizingColumn(null);
  }, []);

  useEffect(() => {
    if (resizingColumn) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [resizingColumn, handleMouseMove, handleMouseUp]);

  const visibleColumns = columns.filter((col) => col.visible);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "NOTICE":
        return "공지";
      case "QNA":
        return "질문";
      case "FREE":
        return "자유";
      default:
        return category;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <ColumnVisibility columns={columns} onColumnsChange={setColumns} />
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table ref={tableRef}>
          <TableHeader>
            <TableRow>
              {visibleColumns.map((column) => (
                <TableHead
                  key={column.id}
                  style={{
                    width: columnWidths[column.id] || defaultWidths[column.id],
                    minWidth: columnWidths[column.id] || defaultWidths[column.id],
                    position: "relative",
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span>{column.label}</span>
                    <div
                      className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-primary/50 flex items-center justify-center"
                      onMouseDown={(e) => handleMouseDown(column.id, e)}
                    >
                      <GripVertical className="h-4 w-4 opacity-50" />
                    </div>
                  </div>
                </TableHead>
              ))}
              <TableHead style={{ width: 120 }}>작업</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={visibleColumns.length + 1} className="text-center py-8">
                  게시글이 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              posts.map((post) => (
                <TableRow key={post.id}>
                  {visibleColumns.map((column) => (
                    <TableCell
                      key={column.id}
                      style={{
                        width: columnWidths[column.id] || defaultWidths[column.id],
                        minWidth: columnWidths[column.id] || defaultWidths[column.id],
                      }}
                      className="truncate"
                    >
                      {column.id === "id" && post.id}
                      {column.id === "title" && post.title}
                      {column.id === "body" && (
                        <span className="line-clamp-2" title={post.body}>
                          {post.body}
                        </span>
                      )}
                      {column.id === "category" && (
                        <Badge variant="outline">{getCategoryLabel(post.category)}</Badge>
                      )}
                      {column.id === "tags" && (
                        <div className="flex flex-wrap gap-1">
                          {post.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                      {column.id === "createdAt" && formatDate(post.createdAt)}
                    </TableCell>
                  ))}
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(post)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(post.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {isLoading && (
        <div className="text-center py-4 text-muted-foreground">로딩 중...</div>
      )}

      {hasMore && <div ref={loadMoreRef} className="h-10" />}
    </div>
  );
}

