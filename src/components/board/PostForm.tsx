"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { postSchema } from "@/lib/utils/validation";
import { POST_CATEGORIES, MAX_TAGS, MAX_TAG_LENGTH } from "@/lib/constants";
import type { Post, Category } from "@/lib/types/post";

interface PostFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: z.infer<typeof postSchema>) => Promise<void>;
  initialData?: Post | null;
}

export function PostForm({ open, onOpenChange, onSubmit, initialData }: PostFormProps) {
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      body: "",
      category: "FREE" as Category,
      tags: [] as string[],
    },
  });

  const bodyValue = watch("body");

  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title,
        body: initialData.body,
        category: initialData.category,
        tags: initialData.tags,
      });
      setTags(initialData.tags);
    } else {
      reset({
        title: "",
        body: "",
        category: "FREE",
        tags: [],
      });
      setTags([]);
    }
    setTagInput("");
  }, [initialData, open, reset]);

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim();
    if (!trimmedTag) return;

    if (tags.length >= MAX_TAGS) {
      return;
    }

    if (trimmedTag.length > MAX_TAG_LENGTH) {
      return;
    }

    if (tags.includes(trimmedTag)) {
      setTagInput("");
      return;
    }

    const newTags = [...tags, trimmedTag];
    setTags(newTags);
    setTagInput("");
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const onFormSubmit = async (data: z.infer<typeof postSchema>) => {
    try {
      setIsSubmitting(true);
      await onSubmit({ ...data, tags });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData ? "게시글 수정" : "게시글 작성"}</DialogTitle>
          <DialogDescription>
            {initialData ? "게시글을 수정합니다." : "새 게시글을 작성합니다."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              제목 <span className="text-muted-foreground">(최대 80자)</span>
            </label>
            <Input
              id="title"
              {...register("title")}
              aria-invalid={errors.title ? "true" : "false"}
              maxLength={80}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="category" className="text-sm font-medium">
              카테고리
            </label>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="카테고리를 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {POST_CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category === "NOTICE" && "공지"}
                        {category === "QNA" && "질문"}
                        {category === "FREE" && "자유"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.category && (
              <p className="text-sm text-destructive">{errors.category.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="body" className="text-sm font-medium">
              본문 <span className="text-muted-foreground">(최대 2000자)</span>
            </label>
            <textarea
              id="body"
              {...register("body")}
              className="flex min-h-[200px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
              aria-invalid={errors.body ? "true" : "false"}
              maxLength={2000}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{bodyValue?.length || 0} / 2000</span>
              {errors.body && (
                <span className="text-destructive">{errors.body.message}</span>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="tags" className="text-sm font-medium">
              태그 <span className="text-muted-foreground">(최대 5개, 각 24자 이내)</span>
            </label>
            <div className="flex gap-2">
              <Input
                id="tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="태그를 입력하고 Enter를 누르세요"
                maxLength={MAX_TAG_LENGTH}
                disabled={tags.length >= MAX_TAGS}
              />
              <Button type="button" onClick={handleAddTag} disabled={tags.length >= MAX_TAGS}>
                추가
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <div
                    key={tag}
                    className="flex items-center gap-1 px-2 py-1 bg-secondary rounded-md text-sm"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            {tags.length >= MAX_TAGS && (
              <p className="text-sm text-muted-foreground">
                태그는 최대 {MAX_TAGS}개까지 추가할 수 있습니다.
              </p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              취소
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "저장 중..." : initialData ? "수정" : "작성"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

