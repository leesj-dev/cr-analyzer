import type { Column } from "@tanstack/react-table"
import type{ CardStats } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface SortableHeaderProps {
  column: Column<CardStats, unknown>;
  children: React.ReactNode;
}

export const SortableHeader = ({ column, children }: SortableHeaderProps) => (
  <Button
    variant="ghost"
    onClick={() => {
      const currentSort = column.getIsSorted();
      if (currentSort === 'asc') {
        column.clearSorting();
      } else if (currentSort === 'desc') {
        column.toggleSorting(false);
      } else {
        column.toggleSorting(true);
      }
    }}
    className={cn("text-right w-full justify-end", column.getIsSorted() && "bg-accent text-accent-foreground")}
  >
    {children}
    <ArrowUpDown className="ml-2 h-4 w-4" />
  </Button>
);