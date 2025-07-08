// src/lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import Papa from 'papaparse';
import type { Battle, CardStats, AnalysisResult } from  './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getCardImageName(cardName: string): string {
  let processedName = cardName.toLowerCase();
  if (processedName.startsWith('evo ')) {
    processedName = processedName.replace(/^evo\s/, '') + '-ev1';
  }
  processedName = processedName.replace(/\./g, '');
  processedName = processedName.replace(/\s+/g, '-');
  return processedName.replace(/[.\s]+/g, '-') + '.png';
}

export async function parseCsvFiles(files: File[]): Promise<Battle[]> {
    const uniqueRows = new Map<string, Battle>();
    for (const file of files) {
        const text = await file.text();
        const result = Papa.parse<Battle>(text, {
            header: true,
            skipEmptyLines: true,
            transformHeader: (header) => header.trim(),
        });
        for (const row of result.data) {
            const rowIdentifier = JSON.stringify(row);
            if (!uniqueRows.has(rowIdentifier)) {
                uniqueRows.set(rowIdentifier, row);
            }
        }
    }
    return Array.from(uniqueRows.values());
}

export const extractCardNamesFromRow = (
    battle: Battle,
    playerType: 'team' | 'opponent',
    includeEvoPrefix: boolean = true
): string[] => {
    const cardNames: string[] = [];
    for (let i = 0; i < 8; i++) {
        const nameKey = `${playerType}_0_cards_${i}_name`;
        if (battle[nameKey]) {
            let cardName = battle[nameKey];
            if (includeEvoPrefix) {
                const evoKey = `${playerType}_0_cards_${i}_evolutionLevel`;
                if (battle[evoKey]) {
                    cardName = `Evo ${cardName}`;
                }
            }
            cardNames.push(cardName);
        } else {
            break;
        }
    }
    return cardNames;
};

export function extractPlayerDecks(battles: Battle[]): string[] {
    const deckSet = new Set<string>();
    battles.forEach(battle => {
        const cards = extractCardNamesFromRow(battle, 'team');
        if (cards.length > 0) {
            // 👇 카드를 알파벳순으로 정렬하여 덱의 고유성을 보장합니다.
            const deckId = cards.sort().join(',');
            deckSet.add(deckId);
        }
    });
    return Array.from(deckSet);
}

export function analyzeOpponentCards(
    battles: Battle[],
    selectedDeckId: string,
    filterCardNames: string[] = []
): AnalysisResult {
    const battlesWithSelectedDeck = battles.filter(b => {
        const teamCards = extractCardNamesFromRow(b, 'team');
        return teamCards.sort().join(',') === selectedDeckId;
    });

    const filteredBattles = filterCardNames.length > 0
        ? battlesWithSelectedDeck.filter(b => {
            const opponentCardNames = extractCardNamesFromRow(b, 'opponent');
            return filterCardNames.every(filterCard => opponentCardNames.includes(filterCard));
        })
        : battlesWithSelectedDeck;

    const cardStatsMap = new Map<string, { wins: number; total: number }>();
    let overallWins = 0;

    filteredBattles.forEach(battle => {
        const playerCrowns = parseInt(battle['team_0_crowns'], 10) || 0;
        const opponentCrowns = parseInt(battle['opponent_0_crowns'], 10) || 0;
        if (playerCrowns === opponentCrowns) return;
        
        const isWin = playerCrowns > opponentCrowns;
        if (isWin) overallWins++;
        
        const opponentCardNames = new Set(extractCardNamesFromRow(battle, 'opponent', true));
        opponentCardNames.forEach(cardName => {
            if (filterCardNames.includes(cardName)) return;
            const stats = cardStatsMap.get(cardName) || { wins: 0, total: 0 };
            stats.total++;
            if (isWin) stats.wins++;
            cardStatsMap.set(cardName, stats);
        });
    });

    const cardStats: CardStats[] = Array.from(cardStatsMap.entries()).map(([name, data]) => ({
        cardName: name,
        winRate: data.total > 0 ? Math.round((data.wins / data.total) * 100) : 0,
        winCount: data.wins,
        totalGames: data.total,
    }));

    cardStats.sort((a, b) => {
        if (b.winRate !== a.winRate) return b.winRate - a.winRate;
        if (b.totalGames !== a.totalGames) return b.totalGames - a.totalGames;
        return a.cardName.localeCompare(b.cardName);
    });

    const overall: CardStats = {
        cardName: 'Overall',
        winRate: filteredBattles.length > 0 ? Math.round((overallWins / filteredBattles.length) * 100) : 0,
        winCount: overallWins,
        totalGames: filteredBattles.length,
    };

    return { overall, cardStats };
}