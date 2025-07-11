// src/components/SortableHeader.tsx
import type { Column } from "@tanstack/react-table";
import type { CardStats } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface SortableHeaderProps {
  column: Column<CardStats, unknown>;
  children: React.ReactNode;
  align?: "left" | "center" | "right";
  initialSortDirection?: "asc" | "desc";
}

export const SortableHeader = ({
  column,
  children,
  align = "center",
  initialSortDirection = "desc",
}: SortableHeaderProps) => {
  return (
    <Button
      variant="ghost"
      onClick={() => {
        const currentSort = column.getIsSorted();
        if (!currentSort) {
          column.toggleSorting(initialSortDirection === "desc");
        } else {
          column.toggleSorting(currentSort === "asc");
        }
      }}
      className={cn(
        "w-full",
        align === "left" ? "justify-start" : "justify-center",
        column.getIsSorted() && "bg-accent text-accent-foreground"
      )}
    >
      {children}
      <ArrowUpDown className="ml-0.5 sm:ml-1 h-4 w-4" />
    </Button>
  );
};
