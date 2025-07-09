// src/components/columns.tsx
"use client"

import type { ColumnDef, Row } from "@tanstack/react-table"
import type { CardStats } from "@/lib/types"
import { getCardImageName } from "@/lib/utils"
import { SortableHeader } from "@/components/SortableHeader"

const createSortingFn = (key: keyof Pick<CardStats, 'winRate' | 'winCount' | 'totalGames'>) => {
  return (rowA: Row<CardStats>, rowB: Row<CardStats>): number => {
    const valueA = rowA.original[key];
    const valueB = rowB.original[key];
    // 1차 정렬 기준(숫자)이 같으면, 2차 정렬(한글 이름)을 실행
    if (valueA === valueB) {
      return rowB.original.translatedCardName.localeCompare(rowA.original.translatedCardName, 'ko');
    }
    // 1차 정렬
    return valueA > valueB ? 1 : -1;
  };
};

export const columns: ColumnDef<CardStats>[] = [
  {
    accessorKey: "cardName",
    header: ({ column }) => (
      <SortableHeader column={column} align="left" initialSortDirection="asc">
        카드
      </SortableHeader>
    ),
    sortingFn: (rowA, rowB) => {
      return rowA.original.translatedCardName.localeCompare(rowB.original.translatedCardName, 'ko');
    },
    cell: ({ row }) => {
      const { cardName, translatedCardName } = row.original;
      return (
        <div className="flex items-center gap-3">
          <img
            src={`./cards/${getCardImageName(cardName)}`}
            alt={cardName}
            className="w-8 h-auto"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
          />
          <span className="font-medium">{translatedCardName}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "winRate",
    header: ({ column }) => <SortableHeader column={column}>승률</SortableHeader>,
    sortingFn: createSortingFn('winRate'),
    cell: ({ row }) => <div className="text-center font-mono">{row.original.winRate}%</div>,
    size: 50,
  },
  {
    accessorKey: "winCount",
    header: ({ column }) => <SortableHeader column={column}>승리</SortableHeader>,
    sortingFn: createSortingFn('winCount'),
    cell: ({ row }) => <div className="text-center font-mono">{row.original.winCount}</div>,
    size: 50,
  },
  {
    accessorKey: "totalGames",
    header: ({ column }) => <SortableHeader column={column}>경기</SortableHeader>,
    sortingFn: createSortingFn('totalGames'),
    cell: ({ row }) => <div className="text-center font-mono">{row.original.totalGames}</div>,
    size: 50,
  },
]