
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ArrowLeft,
  Pause,
  Play,
  Settings,
  LayoutGrid,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";
import { toast } from "@/components/ui/use-toast";
import { ReaderHeader } from "./reader/ReaderHeader";
import { ReaderSettings } from "./reader/ReaderSettings";
import { ReaderContent } from "./reader/ReaderContent";
import { ReaderControls } from "./reader/ReaderControls";

interface ImmersiveReaderProps {
  title: string;
  content: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ImmersiveReader({
  title,
  content,
  isOpen,
  onClose,
}: ImmersiveReaderProps) {
  const [fontSize, setFontSize] = useState("text-xl");
  const [lineHeight, setLineHeight] = useState("leading-relaxed");
  const [plainText, setPlainText] = useState("");
  const [processedContent, setProcessedContent] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [volume, setVolume] = useState(1);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState("");
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [wordElements, setWordElements] = useState<HTMLElement[]>([]);
  
  const contentRef = React.useRef<HTMLDivElement>(null);
  const fullTextRef = React.useRef<string>("");

  // Get available voices for speech synthesis
  useEffect(() => {
    const getVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        setAvailableVoices(voices);
        // Set default voice (prefer English)
        const defaultVoice = voices.find(voice => 
          voice.lang.startsWith('en-')
        ) || voices[0];
        
        if (defaultVoice && !selectedVoiceURI) {
          setSelectedVoiceURI(defaultVoice.voiceURI);
        }
      }
    };

    // Get voices immediately in case they're already loaded
    getVoices();
    
    // Add event listener for when voices change
    window.speechSynthesis.onvoiceschanged = getVoices;
    
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [selectedVoiceURI]);

  // Configure speech synthesis
  const selectedVoice = availableVoices.find(voice => voice.voiceURI === selectedVoiceURI);
  
  const {
    speak,
    stop,
    pause,
    resume,
    speaking,
    paused,
    supported,
    currentWordPosition
  } = useSpeechSynthesis({
    rate: 1,
    pitch: 1,
    volume,
    voice: selectedVoice,
  });

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  // Stop speech when dialog closes
  useEffect(() => {
    if (!isOpen) {
      stop();
    }
  }, [isOpen, stop]);

  const togglePlayback = () => {
    if (speaking) {
      paused ? resume() : pause();
    } else {
      // Ensure we're passing the full text to the speak function
      if (fullTextRef.current) {
        console.log("Starting speech with complete text, length:", fullTextRef.current.length);
        // Pass the entire text string to the speak function
        speak(fullTextRef.current);
        toast({
          title: "Reading started",
          description: "The content is now being read aloud",
        });
      } else {
        console.error("No text available to speak");
        toast({
          title: "Error",
          description: "No text available to read",
          variant: "destructive",
        });
      }
    }
  };

  const increaseFontSize = () => {
    const sizes = ["text-lg", "text-xl", "text-2xl", "text-3xl"];
    const index = sizes.indexOf(fontSize);
    if (index < sizes.length - 1) {
      setFontSize(sizes[index + 1]);
    }
  };

  const decreaseFontSize = () => {
    const sizes = ["text-lg", "text-xl", "text-2xl", "text-3xl"];
    const index = sizes.indexOf(fontSize);
    if (index > 0) {
      setFontSize(sizes[index - 1]);
    }
  };

  const toggleLineHeight = () => {
    const lineHeights = ["leading-normal", "leading-relaxed", "leading-loose"];
    const index = lineHeights.indexOf(lineHeight);
    const nextIndex = (index + 1) % lineHeights.length;
    setLineHeight(lineHeights[nextIndex]);
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (speaking) {
      // Update volume on the fly
      stop();
      speak(fullTextRef.current); // Restart with new volume
    }
  };

  const handleVoiceChange = (voiceURI: string) => {
    setSelectedVoiceURI(voiceURI);
    if (speaking) {
      // Update voice on the fly
      stop();
      speak(fullTextRef.current); // Restart with new voice
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col p-0 bg-background">
        {/* Add DialogTitle for accessibility */}
        <DialogTitle className="sr-only">Immersive Reader</DialogTitle>
        
        {/* Header */}
        <ReaderHeader 
          onClose={onClose}
          decreaseFontSize={decreaseFontSize}
          increaseFontSize={increaseFontSize}
          toggleLineHeight={toggleLineHeight}
          showSettings={showSettings}
          setShowSettings={setShowSettings}
        />

        {/* Settings Panel */}
        {showSettings && (
          <ReaderSettings
            volume={volume}
            onVolumeChange={handleVolumeChange}
            selectedVoiceURI={selectedVoiceURI}
            availableVoices={availableVoices}
            onVoiceChange={handleVoiceChange}
          />
        )}

        {/* Content */}
        <ReaderContent
          title={title}
          content={content}
          fontSize={fontSize}
          lineHeight={lineHeight}
          contentRef={contentRef}
          setPlainText={setPlainText}
          setProcessedContent={setProcessedContent}
          fullTextRef={fullTextRef}
          currentWordPosition={currentWordPosition}
          speaking={speaking}
        />

        {/* Audio Controls */}
        <ReaderControls
          supported={supported}
          speaking={speaking}
          paused={paused}
          togglePlayback={togglePlayback}
        />
      </DialogContent>
    </Dialog>
  );
}
