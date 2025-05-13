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
  const [textContent, setTextContent] = useState("");
  const [wordElements, setWordElements] = useState<{[word: string]: HTMLElement[]}>({});
  
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

  // Extract plain text and prepare for TTS
  useEffect(() => {
    if (isOpen && content) {
      try {
        // Create a temporary element to parse the HTML content
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = DOMPurify.sanitize(content);
        
        // Extract text content
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
        setTextContent(fullText);
        
        console.log("Text prepared for speech, length:", fullText.length);
        
        // Create processed content for display with word spans
        processContentForHighlighting(content);
      } catch (error) {
        console.error("Error extracting text:", error);
        toast.error("Error processing text content");
      }
    }
  }, [isOpen, content, title]);

  // Process HTML content for highlighting, ensuring each word is wrapped correctly
  const processContentForHighlighting = (htmlContent: string) => {
    try {
      // Create a document from the HTML content
      const parser = new DOMParser();
      const doc = parser.parseFromString(DOMPurify.sanitize(htmlContent), 'text/html');
      
      // Word index counter for data-index attributes
      let wordIndex = 0;
      
      // Process all text nodes
      const walkNode = (node: Node) => {
        // We're only interested in text nodes with content
        if (node.nodeType === Node.TEXT_NODE && node.textContent && node.textContent.trim()) {
          // Create a document fragment to replace this text node
          const fragment = document.createDocumentFragment();
          
          // Get the text and split it preserving punctuation and spacing
          const text = node.textContent;
          // Match actual words (including punctuation) and spaces separately
          const wordRegex = /(\S+|\s+)/g;
          let match;
          
          let lastIndex = 0;
          while ((match = wordRegex.exec(text)) !== null) {
            const word = match[0];
            
            if (word.trim()) {
              // It's a word - wrap in span with data attributes
              const span = document.createElement('span');
              span.className = 'reader-word';
              span.dataset.index = wordIndex.toString();
              span.dataset.word = word;
              span.textContent = word;
              fragment.appendChild(span);
              wordIndex++;
            } else {
              // It's whitespace - keep as is
              fragment.appendChild(document.createTextNode(word));
            }
          }
          
          // Replace the original text node with our fragment
          if (node.parentNode) {
            node.parentNode.replaceChild(fragment, node);
          }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          // Skip certain elements to preserve formatting
          if (!['PRE', 'CODE'].includes((node as Element).tagName)) {
            // Process all child nodes
            Array.from(node.childNodes).forEach(walkNode);
          }
        }
      };
      
      // Process all nodes in the body
      Array.from(doc.body.childNodes).forEach(walkNode);
      
      // Set the processed HTML content
      setProcessedContent(doc.body.innerHTML);
      console.log(`Processed content for highlighting with ${wordIndex} words`);
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
    text: textContent,
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

  // Index all words by their content after the content is rendered
  useEffect(() => {
    if (contentRef.current && processedContent) {
      // Give time for the DOM to update
      setTimeout(() => {
        if (contentRef.current) {
          const spans = Array.from(contentRef.current.querySelectorAll('.reader-word'));
          const wordMap: {[word: string]: HTMLElement[]} = {};
          
          spans.forEach(span => {
            const wordText = span.textContent?.trim().toLowerCase() || "";
            if (!wordMap[wordText]) {
              wordMap[wordText] = [];
            }
            wordMap[wordText].push(span as HTMLElement);
          });
          
          setWordElements(wordMap);
          console.log(`Indexed ${spans.length} words for highlighting`);
        }
      }, 100);
    }
  }, [processedContent]);

  // Highlight the current word being spoken and scroll to it
  useEffect(() => {
    if (!speaking || !currentWordPosition || !contentRef.current) {
      // Clear all highlights when not speaking
      const allWords = contentRef.current?.querySelectorAll('.reader-word');
      allWords?.forEach(word => {
        word.classList.remove('highlight-word');
      });
      return;
    }
    
    try {
      // Clear previous highlights
      const allWords = contentRef.current.querySelectorAll('.reader-word');
      allWords.forEach(word => {
        word.classList.remove('highlight-word');
      });
      
      // Find all words with the same content (since words might repeat in the text)
      const { word: wordText } = currentWordPosition;
      const normalizedWord = wordText.toLowerCase().trim();
      
      // First try to find words by looking at their text content
      const spans = Array.from(contentRef.current.querySelectorAll(`.reader-word`));
      
      // Find the best match (exact match or closest position)
      let bestMatch: HTMLElement | null = null;
      
      for (const span of spans) {
        const spanText = span.textContent?.toLowerCase().trim() || "";
        if (spanText === normalizedWord) {
          // Found an exact match
          bestMatch = span as HTMLElement;
          break;
        }
      }
      
      if (bestMatch) {
        // Apply highlighting
        bestMatch.classList.add('highlight-word');
        
        // Scroll to the element smoothly
        bestMatch.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'nearest'
        });
        
        console.log(`Highlighted word: "${normalizedWord}"`);
      } else {
        console.warn(`No matching element found for word "${normalizedWord}"`);
      }
    } catch (error) {
      console.error("Error highlighting word:", error);
    }
  }, [currentWordPosition, speaking]);

  const togglePlayback = () => {
    try {
      if (speaking) {
        paused ? resume() : pause();
      } else {
        speak(textContent);
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
        speak(textContent); // Restart with new volume
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
        speak(textContent); // Restart with new voice
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

        {/* Content - with custom styling for word highlighting */}
        <style jsx>{`
          .highlight-word {
            background-color: rgba(var(--primary) / 0.3);
            color: hsl(var(--primary));
            font-weight: bold;
            border-radius: 0.25rem;
            padding: 0 0.25rem;
            transition: all 0.1s ease-in-out;
            font-size: 1.05em;
          }
          
          .reader-word {
            transition: all 0.1s ease-in-out;
            display: inline-block;
          }
        `}</style>

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
