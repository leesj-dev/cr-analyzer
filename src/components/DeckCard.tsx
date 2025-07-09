// src/components/DeckCard.tsx
import { getCardImageName } from '@/lib/utils';
import { RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { translateCardName } from "@/lib/translations";

interface Props {
  deckId: string;
}

export function DeckCard({ deckId }: Props) {
  const cardNames = deckId.split(',');

  return (
    <TooltipProvider delayDuration={200}>
      <div>
        <RadioGroupItem value={deckId} id={deckId} className="peer sr-only" />
        <Label
          htmlFor={deckId}
          className="relative block flex-shrink-0 w-64 rounded-lg p-2 text-start ring-1 ring-border cursor-pointer transition-all hover:ring-border peer-data-[state=checked]:ring-2 peer-data-[state=checked]:ring-neutral-500 peer-data-[state=checked]:hover:ring-neutral-500"
        >
          <div className="grid grid-cols-4 gap-1">
            {cardNames.slice(0, 8).map(name => (
              <Tooltip key={name}>
                <TooltipTrigger asChild>
                  <img
                    src={`./cards/${getCardImageName(name)}`}
                    alt={name}
                    className="w-full rounded-sm aspect-square object-contain"
                    onError={(e) => { e.currentTarget.style.border = '1px solid hsl(var(--border))' }}
                  />
                </TooltipTrigger>
                <TooltipContent><p>{translateCardName(name)}</p></TooltipContent>
              </Tooltip>
            ))}
          </div>
        </Label>
      </div>
    </TooltipProvider>
  );
}