
import React, { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  ArrowLeft,
  Pause,
  Play,
  Settings,
  LayoutGrid,
  Volume2,
  VolumeX,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";
import DOMPurify from "dompurify";
import { toast } from "@/components/ui/use-toast";

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
  
  const contentRef = useRef<HTMLDivElement>(null);
  const fullTextRef = useRef<string>("");

  const sizes = ["text-lg", "text-xl", "text-2xl", "text-3xl"];
  const lineHeights = ["leading-normal", "leading-relaxed", "leading-loose"];

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

  // Extract plain text from HTML content
  useEffect(() => {
    if (isOpen && content) {
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = DOMPurify.sanitize(content);
      
      // Get the text content of the div (includes all text from all elements)
      const extractedText = tempDiv.textContent || tempDiv.innerText || "";
      
      // Thoroughly clean up the text by removing problematic characters and normalizing whitespace
      const cleanedText = extractedText
        .replace(/\s+/g, ' ')  // Replace multiple spaces with a single space
        .replace(/\n+/g, ' ')  // Replace newlines with spaces
        .replace(/\t+/g, ' ')  // Replace tabs with spaces
        .replace(/\r+/g, ' ')  // Replace carriage returns with spaces
        .replace(/\f+/g, ' ')  // Replace form feeds with spaces
        .replace(/\v+/g, ' ')  // Replace vertical tabs with spaces
        .replace(/\u00A0/g, ' ')  // Replace non-breaking spaces with regular spaces
        .replace(/\u2003/g, ' ')  // Replace em spaces with regular spaces
        .trim();               // Remove leading/trailing whitespace
      
      // Combine title and content with proper spacing
      const fullText = `${title}. ${cleanedText}`;
      setPlainText(fullText);
      fullTextRef.current = fullText;
      
      // Process content for word-by-word highlighting
      processContentForHighlighting(content);
      
      // Debug log
      console.log("Extracted text length:", cleanedText.length);
      console.log("First 100 chars:", cleanedText.substring(0, 100));
      console.log("Last 100 chars:", cleanedText.substring(cleanedText.length - 100));
      console.log("Full text to be read:", fullText.substring(0, 200) + "...");
    }
  }, [isOpen, content, title]);

  // Process HTML content to wrap words in spans for highlighting
  const processContentForHighlighting = (htmlContent: string) => {
    try {
      // Create a DOM parser to manipulate HTML
      const parser = new DOMParser();
      const doc = parser.parseFromString(DOMPurify.sanitize(htmlContent), 'text/html');
      
      // Process all text nodes to wrap words in spans
      const processTextNodes = (node: Node) => {
        if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
          // Split text by spaces and create spans for each word
          const fragment = document.createDocumentFragment();
          const words = node.textContent.split(/(\s+)/);
          
          words.forEach((word, index) => {
            if (word.trim()) {
              // Create span for word
              const span = document.createElement('span');
              span.textContent = word;
              span.className = 'reader-word';
              fragment.appendChild(span);
            } else if (word) {
              // Preserve whitespace
              fragment.appendChild(document.createTextNode(word));
            }
          });
          
          // Replace text node with fragment containing spans
          node.parentNode?.replaceChild(fragment, node);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          // Skip pre and code elements (preserve formatting)
          if (
            (node as Element).tagName !== 'PRE' && 
            (node as Element).tagName !== 'CODE'
          ) {
            Array.from(node.childNodes).forEach(processTextNodes);
          }
        }
      };
      
      // Process the document body
      Array.from(doc.body.childNodes).forEach(processTextNodes);
      
      // Get the processed HTML
      const processedHTML = doc.body.innerHTML;
      setProcessedContent(processedHTML);
    } catch (error) {
      console.error("Error processing content for highlighting:", error);
      setProcessedContent(htmlContent); // Fallback to original content
    }
  };

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

  // Track and highlight current word being spoken
  useEffect(() => {
    if (!speaking || !currentWordPosition || !fullTextRef.current) return;
    
    try {
      // Get the word being spoken
      const { start, end } = currentWordPosition;
      const word = fullTextRef.current.substring(start, end).trim();
      
      if (!word) return;
      
      // Find all word spans in the document
      const wordElements = contentRef.current?.querySelectorAll('.reader-word');
      
      // Remove previous highlights
      wordElements?.forEach(el => {
        el.classList.remove('bg-primary/30', 'text-primary', 'font-bold');
      });
      
      // Try to find the current word in spans
      let foundElement: Element | null = null;
      
      wordElements?.forEach(el => {
        if (el.textContent?.includes(word)) {
          el.classList.add('bg-primary/30', 'text-primary', 'font-bold', 'rounded', 'px-0.5');
          foundElement = el;
        }
      });
      
      // Scroll to the highlighted element
      if (foundElement) {
        foundElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }
    } catch (error) {
      console.error("Error highlighting word:", error);
    }
  }, [currentWordPosition, speaking]);

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

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
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

        {/* Settings Panel */}
        {showSettings && (
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
                  onValueChange={handleVolumeChange}
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
                onValueChange={handleVoiceChange}
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
        )}

        {/* Content */}
        <ScrollArea className="flex-1 p-8 md:p-16 bg-muted/30">
          <div className="max-w-2xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold">{title}</h1>
            <div 
              className={cn("prose max-w-none", fontSize, lineHeight)}
              ref={contentRef}
              dangerouslySetInnerHTML={{ __html: processedContent }}
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
