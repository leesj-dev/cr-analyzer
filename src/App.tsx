// src/App.tsx
import { useState, useMemo } from 'react';
import type { Battle, AnalysisResult } from '@/lib/types';
import { parseCsvFiles, extractPlayerDecks, analyzeOpponentCards, extractCardNamesFromRow } from '@/lib/utils';
import { FileUploader } from '@/components/FileUploader';
import { DeckSelector } from '@/components/DeckSelector';
import { CardDataTable } from '@/components/CardDataTable';
import { FilterCombobox } from '@/components/FilterCombobox';
import { columns } from '@/components/columns';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { translateCardName } from '@/lib/translations';
import { EvoToggle } from '@/components/EvoToggle';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [battles, setBattles] = useState<Battle[]>([]);
  const [selectedDeck, setSelectedDeck] = useState<string | null>(null);
  const [filterCards, setFilterCards] = useState<string[]>([]);
  const [includeEvo, setIncludeEvo] = useState(true);

  const allOpponentCards = useMemo(() => {
    if (battles.length === 0) return [];
    const cardSet = new Set<string>();
    battles.forEach(battle => {
      const opponentCards = extractCardNamesFromRow(battle, 'opponent', includeEvo);
      opponentCards.forEach(cardName => cardSet.add(cardName));
    });
    return Array.from(cardSet).sort();
  }, [battles, includeEvo]);

  const playerDecks = useMemo(() => (
    battles.length > 0 ? extractPlayerDecks(battles) : []
  ), [battles]);

  const analysisResult: AnalysisResult | null = useMemo(() => {
    if (!selectedDeck) return null;
    return analyzeOpponentCards(battles, selectedDeck, filterCards, includeEvo);
  }, [battles, selectedDeck, filterCards, includeEvo]);

  const handleFileUpload = async (files: File[]) => {
    const parsedData = await parseCsvFiles(files);
    setBattles(parsedData);
    const decks = extractPlayerDecks(parsedData);
    if (decks.length > 0) {
      setSelectedDeck(decks[0]);
    }
    setIsLoading(false);
  };

  const resetApp = () => {
    setIsLoading(false);
    setBattles([]);
    setSelectedDeck(null);
    setFilterCards([]);
  }

  const handleToggleChange = (checked: boolean) => {
    setIncludeEvo(checked);
    setFilterCards([]);
  }

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center gap-4">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
        <p className="text-muted-foreground">데이터를 분석하고 있습니다...</p>
      </main>
    );
  }

  if (battles.length === 0) {
    return (
      <main className="flex min-h-screen items-center justify-center p-4">
        <FileUploader onUpload={handleFileUpload} setIsLoading={setIsLoading} />
      </main>
    );
  }

return (
    <div className="w-full h-full bg-slate-50 p-0">
      <div className="w-full max-w-[58rem] h-full mx-auto flex flex-col bg-background shadow-lg">
        <header className="flex items-center justify-between p-4 border-b h-14 flex-shrink-0">
            <Button variant="outline" size="icon" onClick={resetApp}>
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">뒤로가기</span>
            </Button>
            <h1 className="text-lg font-bold">Clash Royale 덱 분석기</h1>
            <div className="w-9"></div> 
        </header>
        
        <div className="flex flex-col md:flex-row flex-grow overflow-hidden">
          <DeckSelector
            deckIds={playerDecks}
            selectedDeck={selectedDeck}
            onSelectDeck={(deckId) => {
              setSelectedDeck(deckId);
              setFilterCards([]);
            }}
          />
          <main className="w-full flex-grow overflow-y-auto hide-scrollbar p-4 md:p-6">
            {analysisResult && (
              <Card className="w-full">
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-lg">
                        {filterCards.length > 0 ? `[${filterCards.map(translateCardName).join(', ')}] 포함 경기` : '전체 경기'} 결과
                      </h3>
                      <p className="text-3xl font-bold">
                        승률 {analysisResult.overall.totalGames === 0 ? "-" : `${analysisResult.overall.winRate}%`}
                      </p>
                      <p className="text-muted-foreground">
                        {analysisResult.overall.totalGames}전 {analysisResult.overall.winCount}승 {analysisResult.overall.totalGames - analysisResult.overall.winCount}패
                      </p>
                    </div>
                    <div className="sm:hidden md:block lg:hidden">
                      <EvoToggle checked={includeEvo} onCheckedChange={handleToggleChange}/>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <FilterCombobox
                      allCards={allOpponentCards}
                      selectedCards={filterCards}
                      onSelectionChange={setFilterCards}
                    />
                    <div className="hidden sm:block md:hidden lg:block lg:ml-20">
                      <EvoToggle checked={includeEvo} onCheckedChange={handleToggleChange}/>
                    </div>
                  </div>
                  <div className="w-full max-w-lg">
                    <h3 className="font-semibold text-lg mb-2">상세 통계</h3>
                    <CardDataTable columns={columns} data={analysisResult.cardStats} />
                  </div>
                </CardContent>
              </Card>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;