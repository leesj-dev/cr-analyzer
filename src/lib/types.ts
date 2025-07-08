export interface Battle {
  'gameMode.name': string;
  'team.cards': string;
  'opponent.cards': string;
  crowns: number;
  'opponent.crowns': number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any; 
}

export interface Card {
  name: string;
  id: number;
  level: number;
  evolutionLevel?: number;
}

export interface CardStats {
  cardName: string;
  winRate: number;
  winCount: number;
  totalGames: number;
}

export interface AnalysisResult {
  overall: CardStats;
  cardStats: CardStats[];
}