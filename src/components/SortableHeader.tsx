// src/components/SortableHeader.tsx
import type { Column } from "@tanstack/react-table"
import type { CardStats } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface SortableHeaderProps {
  column: Column<CardStats, unknown>;
  children: React.ReactNode;
  align?: "left" | "center" | "right";
  initialSortDirection?: "asc" | "desc";
}

export const SortableHeader = ({
  column,
  children,
  align = 'center',
  initialSortDirection = 'desc'
}: SortableHeaderProps) => {

  return (
    <Button
      variant="ghost"
      onClick={() => {
         const currentSort = column.getIsSorted();
        // 만약 정렬이 없으면(false), 초기 정렬 방향으로 설정
        if (!currentSort) {
          column.toggleSorting(initialSortDirection === 'desc');
        } 
        // 정렬이 있다면, 현재 상태의 반대로 전환
        else {
          column.toggleSorting(currentSort === 'asc');
        }
      }}
      className={cn(
        "w-full",
        align === 'left' ? 'justify-start ml-2' : 'justify-center',
        column.getIsSorted() && "bg-accent text-accent-foreground"
      )}
    >
      {children}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  )
};