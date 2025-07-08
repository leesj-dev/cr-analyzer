import * as React from "react"
import { Check, ChevronsUpDown, RotateCcw, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"

interface Props {
  allCards: string[];
  selectedCards: string[];
  onSelectionChange: (selected: string[]) => void;
}

export function FilterCombobox({ allCards, selectedCards, onSelectionChange }: Props) {
  const [open, setOpen] = React.useState(false)

  const handleSelect = (currentValue: string) => {
    const newSelection = selectedCards.includes(currentValue)
      ? selectedCards.filter((card) => card !== currentValue)
      : [...selectedCards, currentValue];
    onSelectionChange(newSelection);
  }
  
  const options = allCards.map(card => ({ value: card, label: card }));

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-64 justify-between"
            >
              <span className="truncate">
                {selectedCards.length > 0 ? `${selectedCards.length}개 카드 선택됨` : "상대 카드 필터 추가..."}
              </span>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-0">
            <Command>
              <CommandInput placeholder="카드 이름 검색..." />
              <CommandList>
                <CommandEmpty>결과 없음.</CommandEmpty>
                <CommandGroup>
                  {options.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onSelect={handleSelect}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedCards.includes(option.value) ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {option.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onSelectionChange([])} 
            disabled={selectedCards.length === 0}
        >
          <RotateCcw className="h-4 w-4" />
          <span className="sr-only">필터 초기화</span>
        </Button>
      </div>

      {selectedCards.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {selectedCards.map(card => (
            <Badge 
              key={card} 
              variant="secondary" 
              className="flex items-center gap-1"
            >
              <span>{card}</span>
              <div onClick={() => handleSelect(card)} className="cursor-pointer">
                <X className="h-3 w-3" />
              </div>
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}