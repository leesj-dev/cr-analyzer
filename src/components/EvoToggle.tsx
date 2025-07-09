import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface EvoToggleProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export const EvoToggle = ({ checked, onCheckedChange }: EvoToggleProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="evo-toggle"
        checked={checked}
        onCheckedChange={onCheckedChange}
      />
      <Label htmlFor="evo-toggle">진화카드 분리</Label>
    </div>
  );
};