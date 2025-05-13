
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Settings, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReaderHeaderProps {
  onClose: () => void;
  decreaseFontSize: () => void;
  increaseFontSize: () => void;
  toggleLineHeight: () => void;
  showSettings: boolean;
  setShowSettings: React.Dispatch<React.SetStateAction<boolean>>;
}

export function ReaderHeader({
  onClose,
  decreaseFontSize,
  increaseFontSize,
  toggleLineHeight,
  showSettings,
  setShowSettings
}: ReaderHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b p-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close Reader">
          <ArrowLeft size={18} />
        </Button>
        <h2 className="text-lg font-semibold">Immersive Reader</h2>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={decreaseFontSize} aria-label="Decrease font size">
          <span className="text-sm">A-</span>
        </Button>
        <Button variant="ghost" size="icon" onClick={increaseFontSize} aria-label="Increase font size">
          <span className="text-base font-bold">A+</span>
        </Button>
        <Button variant="ghost" size="icon" onClick={toggleLineHeight} aria-label="Toggle line spacing">
          <span className="text-sm">↕</span>
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setShowSettings(!showSettings)}
          aria-label="Settings"
          className={cn(showSettings && "bg-muted")}
        >
          <Settings size={18} />
        </Button>
        <Button variant="ghost" size="icon" onClick={onClose} aria-label="Exit Reader">
          <LayoutGrid size={18} />
        </Button>
      </div>
    </div>
  );
}
