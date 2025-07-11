// src/lib/types.ts
export interface Battle {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface CardStats {
  cardName: string;
  translatedCardName: string;
  winRate: number;
  winCount: number;
  totalGames: number;
}

export interface AnalysisResult {
  overall: CardStats;
  cardStats: CardStats[];
}
