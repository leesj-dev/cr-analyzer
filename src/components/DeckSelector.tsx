import { RadioGroup } from "@/components/ui/radio-group" // RadioGroup 임포트
import { DeckCard } from '@/components/DeckCard';

interface Props {
  deckIds: string[];
  selectedDeck: string | null;
  onSelectDeck: (deckId: string) => void;
}

export function DeckSelector({ deckIds, selectedDeck, onSelectDeck }: Props) {
  return (
    <div className="w-full md:w-[320px] md:border-r px-4 pt-4 md:p-6 flex-shrink-0">
        <h2 className="text-xl font-semibold px-0.5 md:px-2 mb-2 md:mb-4">내 덱 목록 ({deckIds.length})</h2>
        <RadioGroup
            value={selectedDeck || ''}
            onValueChange={onSelectDeck}
            className="flex md:flex-col gap-4 p-0.5 md:p-2 overflow-x-scroll hide-scrollbar"
        >
            {deckIds.map(deckId => (
            <DeckCard
                key={deckId}
                deckId={deckId}
            />
            ))}
        </RadioGroup>
    </div>
  );
}