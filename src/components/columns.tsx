// src/components/columns.tsx
"use client"

import type { ColumnDef } from "@tanstack/react-table"
import type { CardStats } from "@/lib/types"
import { getCardImageName } from "@/lib/utils"
import { SortableHeader } from "@/components/SortableHeader"

export const columns: ColumnDef<CardStats>[] = [
  {
    accessorKey: "cardName",
    header: "카드",
    cell: ({ row }) => {
      const cardName = row.original.cardName;
      return (
        <div className="flex items-center gap-3">
          <img
            src={`/cards/${getCardImageName(cardName)}`}
            alt={cardName}
            className="w-8 h-auto"
            onError={(e) => { e.currentTarget.style.display = 'none' }}
          />
          <span className="font-medium">{cardName}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "winRate",
    header: ({ column }) => <SortableHeader column={column}>승률</SortableHeader>,
    cell: ({ row }) => <div className="text-right font-mono pr-4">{row.original.winRate}%</div>,
  },
  {
    accessorKey: "winCount",
    header: ({ column }) => <SortableHeader column={column}>승리</SortableHeader>,
    cell: ({ row }) => <div className="text-right font-mono pr-4">{row.original.winCount}</div>,
  },
  {
    accessorKey: "totalGames",
    header: ({ column }) => <SortableHeader column={column}>총 경기</SortableHeader>,
    cell: ({ row }) => <div className="text-right font-mono pr-4">{row.original.totalGames}</div>,
  },
]