
import React, { useState, useEffect, useRef } from "react";
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
import DOMPurify from "dompurify";

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
  const [highlightedContent, setHighlightedContent] = useState("");
  const contentRef = useRef<HTMLDivElement>(null);
  const fullTextRef = useRef<string>("");

  const sizes = ["text-lg", "text-xl", "text-2xl", "text-3xl"];
  const lineHeights = ["leading-normal", "leading-relaxed", "leading-loose"];

  // Extract plain text from HTML content
  useEffect(() => {
    if (isOpen && content) {
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = DOMPurify.sanitize(content);
      
      // Get the text content of the div (includes all text from all elements)
      const extractedText = tempDiv.textContent || tempDiv.innerText || "";
      
      // Clean up the text by removing extra whitespace and newlines
      const cleanedText = extractedText
        .replace(/\s+/g, ' ')  // Replace multiple spaces with a single space
        .replace(/\n+/g, ' ')  // Replace newlines with spaces
        .trim();               // Remove leading/trailing whitespace
      
      // Combine title and content with proper spacing
      const fullText = `${title}. ${cleanedText}`;
      setPlainText(fullText);
      fullTextRef.current = fullText;
      
      setHighlightedContent(DOMPurify.sanitize(content));
      
      // Debug log
      console.log("Extracted text length:", cleanedText.length);
      console.log("First 100 chars:", cleanedText.substring(0, 100));
      console.log("Last 100 chars:", cleanedText.substring(cleanedText.length - 100));
      console.log("Full text to be read:", fullText.substring(0, 200) + "...");
    }
  }, [isOpen, content, title]);

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
    volume: 1,
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

  // Track and highlight current word being spoken
  useEffect(() => {
    if (!speaking || !currentWordPosition || !fullTextRef.current) return;
    
    try {
      // Get the word being spoken
      const { start, end } = currentWordPosition;
      const word = fullTextRef.current.substring(start, end).trim();
      
      if (!word) return;
      
      // Find and highlight this word in the content
      // This is an approximation since the plain text position doesn't directly map to HTML
      const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const wordRegex = new RegExp(`(\\b${escapedWord}\\b)`, 'gi');
      
      const highlighted = DOMPurify.sanitize(content)
        .replace(wordRegex, 
                '<span class="bg-primary/30 text-primary font-bold rounded px-0.5">$1</span>');
      
      setHighlightedContent(highlighted);
      
      // Scroll to the highlighted word
      const activeElements = contentRef.current?.querySelectorAll('.bg-primary/30');
      if (activeElements && activeElements.length > 0) {
        const activeElement = activeElements[0];
        activeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } catch (error) {
      console.error("Error highlighting word:", error);
    }
  }, [currentWordPosition, speaking, content]);

  const togglePlayback = () => {
    if (speaking) {
      paused ? resume() : pause();
    } else {
      // Pass the full text to the speak function
      console.log("Starting speech with text length:", fullTextRef.current.length);
      speak(fullTextRef.current);
    }
  };

  const increaseFontSize = () => {
    const index = sizes.indexOf(fontSize);
    if (index < sizes.length - 1) {
      setFontSize(sizes[index + 1]);
    }
  };

  const decreaseFontSize = () => {
    const index = sizes.indexOf(fontSize);
    if (index > 0) {
      setFontSize(sizes[index - 1]);
    }
  };

  const toggleLineHeight = () => {
    const index = lineHeights.indexOf(lineHeight);
    const nextIndex = (index + 1) % lineHeights.length;
    setLineHeight(lineHeights[nextIndex]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col p-0 bg-background">
        {/* Add DialogTitle for accessibility */}
        <DialogTitle className="sr-only">Immersive Reader</DialogTitle>
        
        {/* Header */}
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
            <Button variant="ghost" size="icon" aria-label="Settings">
              <Settings size={18} />
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose} aria-label="Exit Reader">
              <LayoutGrid size={18} />
            </Button>
          </div>
        </div>

        {/* Content */}
        <ScrollArea className="flex-1 p-8 md:p-16 bg-muted/30">
          <div className="max-w-2xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold">{title}</h1>
            <div 
              className={cn("prose max-w-none", fontSize, lineHeight)}
              ref={contentRef}
              dangerouslySetInnerHTML={{ __html: highlightedContent }}
            />
          </div>
        </ScrollArea>

        {/* Audio Controls */}
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
      </DialogContent>
    </Dialog>
  );
}
