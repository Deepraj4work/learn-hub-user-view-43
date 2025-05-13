
import React from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";

interface ReaderControlsProps {
  supported: boolean;
  speaking: boolean;
  paused: boolean;
  togglePlayback: () => void;
}

export function ReaderControls({
  supported,
  speaking,
  paused,
  togglePlayback
}: ReaderControlsProps) {
  return (
    <div className="flex items-center justify-center p-4 border-t">
      {supported ? (
        <Button
          variant="outline"
          size="lg"
          className="rounded-full w-14 h-14 flex items-center justify-center"
          onClick={togglePlayback}
          aria-label={speaking && !paused ? "Pause Reading" : "Start Reading"}
        >
          {speaking && !paused ? (
            <Pause className="h-6 w-6" />
          ) : (
            <Play className="h-6 w-6 ml-1" />
          )}
        </Button>
      ) : (
        <div className="text-sm text-muted-foreground">
          Text-to-speech not supported in this browser
        </div>
      )}
    </div>
  );
}
