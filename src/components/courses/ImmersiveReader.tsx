import React, { useState, useEffect, useRef, useCallback } from "react";
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
  RefreshCcw
} from "lucide-react";
import { cn, normalizeWord, debounce } from "@/lib/utils";
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
  
  // Track all word elements and their positions
  const [wordElements, setWordElements] = useState<HTMLElement[]>([]);
  const [allWordIndexes, setAllWordIndexes] = useState<{ 
    word: string; 
    normalizedWord: string; 
    index: number; 
    charIndex: number; 
    element: HTMLElement | null 
  }[]>([]);
  
  const contentRef = useRef<HTMLDivElement>(null);
  const fullTextRef = useRef<string>("");
  const lastHighlightedIndexRef = useRef<number>(-1);
  const scrollTimeoutRef = useRef<number | null>(null);
  const textVersionRef = useRef<number>(0); // Track text version to prevent stale references

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

  // Extract plain text and prepare for TTS - IMPROVED
  useEffect(() => {
    if (isOpen && content) {
      try {
        // Increment text version to avoid stale references
        textVersionRef.current++;
        const currentVersion = textVersionRef.current;
        
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
        
        // Process content for highlighting with improved word mapping
        processContentForHighlighting(content, currentVersion);
      } catch (error) {
        console.error("Error extracting text:", error);
        toast.error("Error processing text content");
      }
    }
  }, [isOpen, content, title]);

  // IMPROVED: Process HTML content for highlighting with better word mapping
  const processContentForHighlighting = (htmlContent: string, version: number) => {
    try {
      // Create a document from the HTML content
      const parser = new DOMParser();
      const doc = parser.parseFromString(DOMPurify.sanitize(htmlContent), 'text/html');
      
      // Word index counter for data-index attributes
      let wordIndex = 0;
      let globalCharIndex = 0;
      const allWords: { word: string; normalizedWord: string; index: number; charIndex: number; element: HTMLElement | null }[] = [];
      
      // Process all text nodes with accurate character position tracking
      const walkNode = (node: Node) => {
        // We're only interested in text nodes with content
        if (node.nodeType === Node.TEXT_NODE && node.textContent && node.textContent.trim()) {
          // Create a document fragment to replace this text node
          const fragment = document.createDocumentFragment();
          
          // Get the text and split it preserving punctuation
          const text = node.textContent;
          // Match words (including punctuation) and spaces separately
          const wordRegex = /(\S+|\s+)/g;
          let match;
          let localCharIndex = 0;
          
          while ((match = wordRegex.exec(text)) !== null) {
            const word = match[0];
            localCharIndex = match.index;
            
            if (word.trim()) {
              // It's a word - wrap in span with data attributes
              const span = document.createElement('span');
              span.className = 'reader-word';
              span.dataset.index = wordIndex.toString();
              
              // Store both original and normalized version of the word
              const originalWord = word;
              const normalized = normalizeWord(word);
              
              span.dataset.word = originalWord;
              span.dataset.normalizedWord = normalized;
              span.dataset.charIndex = (globalCharIndex + localCharIndex).toString();
              span.textContent = word;
              fragment.appendChild(span);
              
              // Track this word with character position for more accurate lookup
              allWords.push({ 
                word: originalWord, 
                normalizedWord: normalized,
                index: wordIndex,
                charIndex: globalCharIndex + localCharIndex,
                element: null // Will be populated after rendering
              });
              
              wordIndex++;
            } else {
              // It's whitespace - keep as is
              fragment.appendChild(document.createTextNode(word));
            }
          }
          
          // Update global character index
          globalCharIndex += text.length;
          
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
      
      // Store the word index mapping
      if (version === textVersionRef.current) { // Prevent stale updates
        setAllWordIndexes(allWords);
      }
      
      // Set the processed HTML content
      setProcessedContent(doc.body.innerHTML);
      console.log(`Processed content for highlighting with ${wordIndex} words and accurate character positions`);
    } catch (error) {
      console.error("Error processing content for highlighting:", error);
      setProcessedContent(htmlContent); // Fallback to original content
    }
  };

  // Configure speech synthesis with selected voice
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
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [stop]);

  // Stop speech when dialog closes
  useEffect(() => {
    if (!isOpen) {
      stop();
      
      // Clear all highlights when dialog closes
      if (contentRef.current) {
        const allWords = contentRef.current.querySelectorAll('.reader-word');
        allWords.forEach(word => {
          word.classList.remove('highlight-word');
        });
      }
      
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    }
  }, [isOpen, stop]);

  // Create a debounced scroll function with longer wait time for smoother experience
  const debouncedScrollIntoView = useCallback(
    debounce((element: HTMLElement) => {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest'
      });
    }, 200), // Increased to 200ms for smoother scrolling
    []
  );

  // IMPROVED: Index all word elements after the content is rendered
  useEffect(() => {
    if (contentRef.current && processedContent) {
      // Give time for the DOM to update
      setTimeout(() => {
        if (contentRef.current) {
          const spans = Array.from(
            contentRef.current.querySelectorAll('.reader-word')
          ) as HTMLElement[];
          
          // Store all word elements in order
          setWordElements(spans);
          
          // Update our word index mapping with references to actual DOM elements and char positions
          const updatedIndexes = [...allWordIndexes];
          spans.forEach((span) => {
            const index = parseInt(span.dataset.index || "-1", 10);
            const charIndex = parseInt(span.dataset.charIndex || "-1", 10);
            
            if (index >= 0 && index < updatedIndexes.length) {
              updatedIndexes[index].element = span;
              
              // Also update the character index from the DOM if available
              if (charIndex >= 0) {
                updatedIndexes[index].charIndex = charIndex;
              }
            }
          });
          
          setAllWordIndexes(updatedIndexes);
          console.log(`Indexed ${spans.length} word elements with character positions`);
        }
      }, 100);
    }
  }, [processedContent]);

  // IMPROVED: Highlight function with better word matching using character positions
  useEffect(() => {
    if (!speaking || !currentWordPosition || !contentRef.current) {
      // Clear all highlights when not speaking
      const allWords = contentRef.current?.querySelectorAll('.reader-word');
      allWords?.forEach(word => {
        word.classList.remove('highlight-word');
      });
      lastHighlightedIndexRef.current = -1;
      return;
    }
    
    try {
      // Clear previous highlights
      const allWords = contentRef.current.querySelectorAll('.reader-word');
      allWords.forEach(word => {
        word.classList.remove('highlight-word');
      });
      
      // Get the spoken word and its char position
      const { word: spokenWord, charIndex: spokenCharIndex } = currentWordPosition;
      const normalizedSpokenWord = normalizeWord(spokenWord);
      
      if (!normalizedSpokenWord) {
        console.log("Empty normalized word, skipping highlight");
        return;
      }
      
      console.log(`Finding match for: "${normalizedSpokenWord}" at char index ${spokenCharIndex}`);
      
      // IMPROVED ALGORITHM:
      // 1. First try to find a word with a matching char index or close to it
      // 2. If that fails, look for the next occurrence of the normalized word after last highlight
      
      // Step 1: Find by character index first (most accurate)
      const CHAR_INDEX_TOLERANCE = 20; // Allow some flexibility in char index matching
      let matchingWords = allWordIndexes.filter(item => 
        Math.abs(item.charIndex - spokenCharIndex) < CHAR_INDEX_TOLERANCE && 
        item.element
      );
      
      // If we found multiple words near this char index, prefer ones with matching normalized text
      if (matchingWords.length > 1) {
        const exactMatches = matchingWords.filter(item => 
          item.normalizedWord === normalizedSpokenWord
        );
        
        if (exactMatches.length > 0) {
          matchingWords = exactMatches;
        }
        
        // Sort by character index distance to find closest match
        matchingWords.sort((a, b) => 
          Math.abs(a.charIndex - spokenCharIndex) - Math.abs(b.charIndex - spokenCharIndex)
        );
      }
      
      // Step 2: If no character match, try to find by normalized word after last position
      if (matchingWords.length === 0) {
        console.log("No char index matches, falling back to word content matching");
        
        // Find all normalized word matches
        matchingWords = allWordIndexes.filter(item => 
          item.normalizedWord === normalizedSpokenWord && item.element
        );
        
        if (matchingWords.length > 0) {
          // Find next occurrence after last highlighted index
          const lastHighlightedIndex = lastHighlightedIndexRef.current;
          let nextWordToHighlight = null;
          
          for (const match of matchingWords) {
            if (match.index > lastHighlightedIndex) {
              nextWordToHighlight = match;
              break;
            }
          }
          
          // If no next occurrence, wrap around to the first match
          if (!nextWordToHighlight) {
            nextWordToHighlight = matchingWords[0];
          }
          
          matchingWords = nextWordToHighlight ? [nextWordToHighlight] : [];
        }
      }
      
      // Apply highlighting to the best match
      if (matchingWords.length > 0 && matchingWords[0].element) {
        const bestMatch = matchingWords[0];
        const elementToHighlight = bestMatch.element;
        
        // Update highlight
        elementToHighlight.classList.add('highlight-word');
        lastHighlightedIndexRef.current = bestMatch.index;
        
        // Use debounced scroll for smoother experience
        debouncedScrollIntoView(elementToHighlight);
        
        console.log(`Highlighted: "${bestMatch.word}" at index ${bestMatch.index}, char pos ${bestMatch.charIndex}`);
      } else {
        console.warn(`No suitable word match found for "${normalizedSpokenWord}" at char index ${spokenCharIndex}`);
      }
    } catch (error) {
      console.error("Error highlighting word:", error);
    }
  }, [currentWordPosition, speaking, allWordIndexes, debouncedScrollIntoView]);

  const togglePlayback = () => {
    try {
      if (speaking) {
        paused ? resume() : pause();
      } else {
        // Reset the highlight tracking when starting a new reading
        lastHighlightedIndexRef.current = -1;
        speak(textContent);
        toast.success("Reading started");
      }
    } catch (error) {
      console.error("Error toggling playback:", error);
      toast.error("Error controlling playback. Please try again.");
    }
  };
  
  // Add a restart function to handle retrying after errors
  const handleRestart = () => {
    try {
      // First stop any ongoing speech
      stop();
      
      // Clear current position
      lastHighlightedIndexRef.current = -1;
      
      // Reset all highlighting
      if (contentRef.current) {
        const allWords = contentRef.current.querySelectorAll('.reader-word');
        allWords.forEach(word => {
          word.classList.remove('highlight-word');
        });
      }
      
      // Short delay before restarting
      setTimeout(() => {
        speak(textContent);
        toast.success("Reading restarted");
      }, 300);
    } catch (error) {
      console.error("Error restarting playback:", error);
      toast.error("Could not restart reading. Please try refreshing the page.");
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
        <style>
          {`
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
          `}
        </style>

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
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={handleRestart}
                aria-label="Restart Reading"
                className="rounded-full w-10 h-10"
                title="Restart reading from the beginning"
              >
                <RefreshCcw className="h-4 w-4" />
              </Button>
              
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
            </div>
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
