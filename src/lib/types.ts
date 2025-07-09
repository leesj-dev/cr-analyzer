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
  cardName: string; // 이미지, 고유 ID용 영문 이름
  translatedCardName: string; // 정렬, 표시에 사용할 한글 이름
  winRate: number;
  winCount: number;
  totalGames: number;
}

export interface AnalysisResult {
  overall: CardStats;
  cardStats: CardStats[];
}