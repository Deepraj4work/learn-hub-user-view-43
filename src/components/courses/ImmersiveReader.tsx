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
import { toast } from "sonner";

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
  const [words, setWords] = useState<string[]>([]);
  
  const contentRef = useRef<HTMLDivElement>(null);
  const fullTextRef = useRef<string>("");

  const sizes = ["text-lg", "text-xl", "text-2xl", "text-3xl"];
  const lineHeights = ["leading-normal", "leading-relaxed", "leading-loose"];

  // Get available voices for speech synthesis
  useEffect(() => {
    const getVoices = () => {
      try {
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
      } catch (error) {
        console.error("Error getting voices:", error);
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
      try {
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = DOMPurify.sanitize(content);
        
        // Get plain text from the HTML
        const extractedText = tempDiv.textContent || tempDiv.innerText || "";
        
        // Clean the text for better TTS processing
        const cleanedText = extractedText
          .replace(/\s+/g, ' ')
          .replace(/[\n\r\t\f\v]+/g, ' ')
          .trim();
        
        // Combine title and content with proper spacing
        const fullText = `${title}. ${cleanedText}`;
        setPlainText(fullText);
        fullTextRef.current = fullText;
        
        // Split text into words for highlighting
        setWords(fullText.split(/\s+/));
        
        // Process content for word-by-word highlighting
        processContentForHighlighting(content);
        
        console.log("Text prepared for speech, length:", fullText.length);
      } catch (error) {
        console.error("Error extracting text:", error);
        toast.error("Error processing text content");
      }
    }
  }, [isOpen, content, title]);

  // Process HTML content for highlighting
  const processContentForHighlighting = (htmlContent: string) => {
    try {
      // Create processed content with spans around words for highlighting
      const parser = new DOMParser();
      const doc = parser.parseFromString(DOMPurify.sanitize(htmlContent), 'text/html');
      
      // Process all text nodes
      const processNode = (node: Node) => {
        if (node.nodeType === Node.TEXT_NODE && node.textContent) {
          const text = node.textContent;
          if (text.trim()) {
            // Create a fragment to replace this text node
            const fragment = document.createDocumentFragment();
            
            // Split by word boundaries and create spans
            const parts = text.split(/(\s+)/);
            parts.forEach((part) => {
              if (part.trim()) {
                // It's a word - wrap in span
                const span = document.createElement('span');
                span.className = 'reader-word';
                span.textContent = part;
                fragment.appendChild(span);
              } else {
                // It's whitespace - keep as is
                fragment.appendChild(document.createTextNode(part));
              }
            });
            
            // Replace the text node with our fragment
            if (node.parentNode) {
              node.parentNode.replaceChild(fragment, node);
            }
          }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          // Skip pre and code elements to preserve formatting
          if (
            (node as Element).tagName !== 'PRE' && 
            (node as Element).tagName !== 'CODE'
          ) {
            // Process all child nodes
            Array.from(node.childNodes).forEach(processNode);
          }
        }
      };
      
      // Process all nodes in the body
      Array.from(doc.body.childNodes).forEach(processNode);
      
      // Set the processed HTML content
      setProcessedContent(doc.body.innerHTML);
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
    text: fullTextRef.current,
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

  // Highlight the current word being spoken
  useEffect(() => {
    if (!speaking || !currentWordPosition) {
      // Clear all highlights when not speaking
      const allWords = contentRef.current?.querySelectorAll('.reader-word');
      allWords?.forEach(word => {
        word.classList.remove('bg-primary/30', 'text-primary', 'font-bold', 'rounded', 'px-0.5');
      });
      return;
    }
    
    try {
      // Find which word is being spoken based on position
      const { start } = currentWordPosition;
      
      // Get the word at this position in our full text
      let charCount = 0;
      let targetWordIndex = -1;
      
      for (let i = 0; i < words.length; i++) {
        const wordLength = words[i].length;
        
        // Is this our target word?
        if (start >= charCount && start < charCount + wordLength + 1) {
          targetWordIndex = i;
          break;
        }
        
        // Move to next word position (add 1 for space)
        charCount += wordLength + 1;
      }
      
      // We found the word index, now highlight the corresponding element
      if (targetWordIndex >= 0) {
        // Clear previous highlights
        const allWords = contentRef.current?.querySelectorAll('.reader-word');
        allWords?.forEach(word => {
          word.classList.remove('bg-primary/30', 'text-primary', 'font-bold', 'rounded', 'px-0.5');
        });
        
        // Find and highlight the word at this index
        const wordElements = contentRef.current?.querySelectorAll('.reader-word');
        if (wordElements && targetWordIndex < wordElements.length) {
          const targetElement = wordElements[targetWordIndex];
          targetElement.classList.add('bg-primary/30', 'text-primary', 'font-bold', 'rounded', 'px-0.5');
          
          // Scroll to the element if needed
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'nearest'
          });
        }
      }
    } catch (error) {
      console.error("Error highlighting word:", error);
    }
  }, [currentWordPosition, speaking, words]);

  const togglePlayback = () => {
    try {
      if (speaking) {
        paused ? resume() : pause();
      } else {
        speak(fullTextRef.current);
        toast.success("Reading started");
      }
    } catch (error) {
      console.error("Error toggling playback:", error);
      toast.error("Error controlling playback");
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
    try {
      const newVolume = value[0];
      setVolume(newVolume);
      if (speaking) {
        // Update volume on the fly
        stop();
        speak(fullTextRef.current); // Restart with new volume
      }
    } catch (error) {
      console.error("Error changing volume:", error);
    }
  };

  const handleVoiceChange = (voiceURI: string) => {
    try {
      setSelectedVoiceURI(voiceURI);
      if (speaking) {
        // Update voice on the fly
        stop();
        speak(fullTextRef.current); // Restart with new voice
      }
    } catch (error) {
      console.error("Error changing voice:", error);
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
