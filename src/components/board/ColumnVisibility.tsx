/**
 * 컬럼 가시성 설정 컴포넌트
 * 테이블에서 표시할 컬럼을 선택할 수 있는 다이얼로그를 제공합니다.
 * 최소 1개 이상의 컬럼이 항상 표시되도록 보장합니다.
 */

"use client";

import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";

/** 컬럼 설정 타입 */
export interface ColumnConfig {
  id: string;
  label: string;
  visible: boolean;
}

interface ColumnVisibilityProps {
  columns: ColumnConfig[];
  onColumnsChange: (columns: ColumnConfig[]) => void;
}

export function ColumnVisibility({ columns, onColumnsChange }: ColumnVisibilityProps) {
  const [open, setOpen] = useState(false);
  const [localColumns, setLocalColumns] = useState(columns);

  useEffect(() => {
    setLocalColumns(columns);
  }, [columns]);

  const handleToggle = (id: string) => {
    const newColumns = localColumns.map((col) =>
      col.id === id ? { ...col, visible: !col.visible } : col
    );
    setLocalColumns(newColumns);
  };

  const handleSave = () => {
    onColumnsChange(localColumns);
    setOpen(false);
  };

  const visibleCount = localColumns.filter((col) => col.visible).length;

  return (
    <>
      <Button
        variant="default"
        onClick={() => setOpen(true)}
        className="gap-2"
      >
        {visibleCount === localColumns.length ? (
          <Eye className="h-4 w-4" />
        ) : (
          <EyeOff className="h-4 w-4" />
        )}
        컬럼 표시 설정
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>컬럼 표시 설정</DialogTitle>
            <DialogDescription>
              표시할 컬럼을 선택하세요. 최소 1개 이상의 컬럼을 표시해야 합니다.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            {localColumns.map((column) => (
              <div key={column.id} className="flex items-center space-x-2">
                <Checkbox
                  id={column.id}
                  checked={column.visible}
                  onCheckedChange={() => handleToggle(column.id)}
                  disabled={column.visible && visibleCount === 1}
                />
                <label
                  htmlFor={column.id}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {column.label}
                </label>
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              취소
            </Button>
            <Button onClick={handleSave}>저장</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

