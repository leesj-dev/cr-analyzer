// src/components/MinGamesFilter.tsx
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface MinGamesFilterProps {
  isEnabled: boolean;
  onEnabledChange: (enabled: boolean) => void;
  value: number;
  onValueChange: (value: number) => void;
  maxValue: number;
}

export const MinGamesFilter = ({ isEnabled, onEnabledChange, value, onValueChange, maxValue }: MinGamesFilterProps) => {
  return (
    <div className="flex items-center gap-2">
      <Checkbox id="min-games-filter-checkbox" checked={isEnabled} onCheckedChange={onEnabledChange} />
      <div className={`flex items-center gap-1 transition-opacity ${!isEnabled && "opacity-50 pointer-events-none"}`}>
        <Input
          type="number"
          className="w-12 h-6 text-center px-1"
          value={value}
          onChange={(e) => onValueChange(Number(e.target.value))}
          min={1}
          max={maxValue}
        />
        <Label htmlFor="min-games-filter-checkbox" className="text-sm font-medium cursor-pointer whitespace-nowrap">
          경기 이상
        </Label>
      </div>
    </div>
  );
};
