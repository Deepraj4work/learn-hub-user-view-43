
import React, { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, Volume2, Pause, Play, Settings, BookText, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";

interface ImmersiveReaderProps {
  title: string;
  content: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ImmersiveReader({ title, content, isOpen, onClose }: ImmersiveReaderProps) {
  const [fontSize, setFontSize] = useState("text-xl");
  const [lineHeight, setLineHeight] = useState("leading-relaxed");
  const [plainText, setPlainText] = useState("");
  
  // Extract plain text from HTML content for speech synthesis
  useEffect(() => {
    if (isOpen && content) {
      // Create a temporary div to parse HTML
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = content;
      // Get text content without HTML tags
      setPlainText(tempDiv.textContent || tempDiv.innerText || "");
    }
  }, [isOpen, content]);
  
  // Speech synthesis integration
  const { speak, stop, pause, resume, speaking, paused, supported } = useSpeechSynthesis({
    text: `${title}. ${plainText}`,
    rate: 1,
    pitch: 1,
    volume: 1,
  });
  
  // Stop speech when component unmounts or dialog closes
  useEffect(() => {
    if (!isOpen && speaking) {
      stop();
    }
    return () => {
      if (speaking) {
        stop();
      }
    };
  }, [isOpen, speaking, stop]);
  
  const togglePlayback = () => {
    if (speaking) {
      if (paused) {
        resume();
      } else {
        pause();
      }
    } else {
      speak();
    }
  };

  const increaseFontSize = () => {
    const sizes = ["text-lg", "text-xl", "text-2xl", "text-3xl"];
    const currentIndex = sizes.indexOf(fontSize);
    if (currentIndex < sizes.length - 1) {
      setFontSize(sizes[currentIndex + 1]);
    }
  };

  const decreaseFontSize = () => {
    const sizes = ["text-lg", "text-xl", "text-2xl", "text-3xl"];
    const currentIndex = sizes.indexOf(fontSize);
    if (currentIndex > 0) {
      setFontSize(sizes[currentIndex - 1]);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col p-0 bg-background">
        {/* Header */}
        <div className="flex items-center justify-between border-b p-4">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onClose}>
              <ArrowLeft size={18} />
            </Button>
            <h2 className="text-lg font-semibold">Immersive Reader</h2>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={decreaseFontSize}>
              <span className="text-sm">A-</span>
            </Button>
            <Button variant="ghost" size="icon" onClick={increaseFontSize}>
              <span className="text-base font-bold">A+</span>
            </Button>
            <Button variant="ghost" size="icon">
              <Settings size={18} />
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <LayoutGrid size={18} />
            </Button>
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 md:p-16 bg-muted/30">
          <div className="max-w-2xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold">{title}</h1>
            
            <div className={cn("prose max-w-none", fontSize, lineHeight)}>
              {/* This would be the parsed content */}
              <div dangerouslySetInnerHTML={{ __html: content }} />
            </div>
          </div>
        </div>
        
        {/* Audio controls */}
        <div className="flex items-center justify-center p-4 border-t">
          {supported ? (
            <Button
              variant="outline"
              size="lg"
              className="rounded-full w-14 h-14 flex items-center justify-center"
              onClick={togglePlayback}
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
      </DialogContent>
    </Dialog>
  );
}
