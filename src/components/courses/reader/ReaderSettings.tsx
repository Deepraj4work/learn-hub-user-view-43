
import React from "react";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Volume2, VolumeX } from "lucide-react";

interface ReaderSettingsProps {
  volume: number;
  onVolumeChange: (value: number) => void;
  selectedVoiceURI: string;
  availableVoices: SpeechSynthesisVoice[];
  onVoiceChange: (voiceURI: string) => void;
}

export function ReaderSettings({
  volume,
  onVolumeChange,
  selectedVoiceURI,
  availableVoices,
  onVoiceChange
}: ReaderSettingsProps) {
  return (
    <div className="border-b p-4 bg-muted/30 space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="volume-slider" className="text-sm font-medium">
            Volume
          </label>
          <span className="text-xs text-muted-foreground">
            {Math.round(volume * 100)}%
          </span>
        </div>
        <div className="flex items-center gap-2">
          <VolumeX size={16} className="text-muted-foreground" />
          <Slider
            id="volume-slider"
            defaultValue={[volume]}
            min={0}
            max={1}
            step={0.1}
            onValueChange={(values) => onVolumeChange(values[0])}
            className="flex-1"
          />
          <Volume2 size={16} />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="voice-select" className="text-sm font-medium">
          Voice
        </label>
        <Select 
          value={selectedVoiceURI}
          onValueChange={onVoiceChange}
        >
          <SelectTrigger id="voice-select" className="w-full">
            <SelectValue placeholder="Select a voice" />
          </SelectTrigger>
          <SelectContent>
            {availableVoices.map((voice) => (
              <SelectItem key={voice.voiceURI} value={voice.voiceURI}>
                {voice.name} ({voice.lang})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
