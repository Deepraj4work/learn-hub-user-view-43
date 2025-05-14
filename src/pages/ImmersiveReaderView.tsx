import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  ArrowLeft,
  Pause,
  Play,
  RefreshCcw,
  Volume2,
  VolumeX
} from "lucide-react";
import { cn, normalizeWord } from "@/lib/utils";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";
import DOMPurify from "dompurify";
import { toast } from "sonner";

export function ImmersiveReaderView() {
  const location = useLocation();
  const navigate = useNavigate();
  const { title, content, returnPath } = location.state || {};
  
  const [volume, setVolume] = useState(1);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState("");
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [textContent, setTextContent] = useState("");
  const [rate, setRate] = useState(0.8); // Lower default reading speed
  const [processedContent, setProcessedContent] = useState("");
  const [plainText, setPlainText] = useState("");
  
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
  const textVersionRef = useRef<number>(0);
  
  // Check if we have the necessary data
  useEffect(() => {
    if (!title || !content) {
      toast.error("Missing content for immersive reader");
      handleGoBack();
    }
  }, [title, content]);
  
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
    if (content) {
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
        
        // Process content for highlighting
        processContentForHighlighting(content, currentVersion);
      } catch (error) {
        console.error("Error extracting text:", error);
        toast.error("Error processing text content");
      }
    }
  }, [content, title]);

  // Improved content processing for more reliable highlighting
  const processContentForHighlighting = (htmlContent: string, version: number) => {
    try {
      // Create a document from the HTML content
      const parser = new DOMParser();
      const doc = parser.parseFromString(DOMPurify.sanitize(htmlContent), 'text/html');
      
      // Word index counter for data-index attributes
      let wordIndex = 0;
      let globalCharIndex = 0;
      const allWords: { word: string; normalizedWord: string; index: number; charIndex: number; element: HTMLElement | null }[] = [];
      
      // Recursive function to process all text nodes with accurate character position tracking
      const processNode = (node: Node) => {
        if (node.nodeType === Node.TEXT_NODE && node.textContent && node.textContent.trim()) {
          const fragment = document.createDocumentFragment();
          const text = node.textContent;
          
          // Split text into words and spaces, preserving punctuation
          const tokenRegex = /(\S+|\s+)/g;
          let match;
          let lastIndex = 0;
          
          while ((match = tokenRegex.exec(text)) !== null) {
            const token = match[0];
            const startIndex = match.index;
            
            // If token is not just whitespace, create a word span
            if (token.trim()) {
              const span = document.createElement('span');
              span.className = 'reader-word';
              span.dataset.index = wordIndex.toString();
              
              const originalWord = token;
              const normalized = normalizeWord(token);
              
              span.dataset.word = originalWord;
              span.dataset.normalizedWord = normalized;
              span.dataset.charIndex = (globalCharIndex + startIndex).toString();
              span.textContent = token;
              fragment.appendChild(span);
              
              // Track this word with character position
              allWords.push({ 
                word: originalWord, 
                normalizedWord: normalized,
                index: wordIndex,
                charIndex: globalCharIndex + startIndex,
                element: null
              });
              
              wordIndex++;
            } else {
              // It's whitespace - keep as is, but add extra spacing
              // Add double spaces for better word separation
              fragment.appendChild(document.createTextNode(token + ' '));
            }
            
            lastIndex = match.index + token.length;
          }
          
          // Update global character index
          globalCharIndex += text.length;
          
          // Replace the original text node with our fragment
          if (node.parentNode) {
            node.parentNode.replaceChild(fragment, node);
          }
        } else if (node.nodeType === Node.ELEMENT_NODE && 
                  !['SCRIPT', 'STYLE', 'PRE', 'CODE'].includes((node as Element).tagName)) {
          // Process all child nodes recursively
          Array.from(node.childNodes).forEach(processNode);
        }
      };
      
      // Process all nodes in the body
      Array.from(doc.body.childNodes).forEach(processNode);
      
      // Store the word index mapping
      if (version === textVersionRef.current) { // Prevent stale updates
        setAllWordIndexes(allWords);
      }
      
      // Set the processed HTML content
      setProcessedContent(doc.body.innerHTML);
      console.log(`Processed content for highlighting with ${wordIndex} indexed words`);
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
    rate,
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

  // Index all word elements after the content is rendered
  useEffect(() => {
    if (contentRef.current && processedContent) {
      // Wait for DOM to update
      setTimeout(() => {
        if (contentRef.current) {
          const spans = Array.from(
            contentRef.current.querySelectorAll('.reader-word')
          ) as HTMLElement[];
          
          // Store word elements and update indexes with DOM references
          setWordElements(spans);
          
          const updatedIndexes = [...allWordIndexes];
          spans.forEach((span) => {
            const index = parseInt(span.dataset.index || "-1", 10);
            const charIndex = parseInt(span.dataset.charIndex || "-1", 10);
            
            if (index >= 0 && index < updatedIndexes.length) {
              updatedIndexes[index].element = span;
              
              if (charIndex >= 0) {
                updatedIndexes[index].charIndex = charIndex;
              }
            }
          });
          
          setAllWordIndexes(updatedIndexes);
        }
      }, 200);
    }
  }, [processedContent, allWordIndexes]);

  // Enhanced highlighting with auto-scrolling
  useEffect(() => {
    if (!speaking || !currentWordPosition || !contentRef.current) {
      if (contentRef.current) {
        const allWords = contentRef.current.querySelectorAll('.reader-word');
        allWords.forEach(word => {
          word.classList.remove('highlight-word');
        });
        lastHighlightedIndexRef.current = -1;
      }
      return;
    }
    
    try {
      if (contentRef.current) {
        const allWords = contentRef.current.querySelectorAll('.highlight-word');
        allWords.forEach(word => {
          word.classList.remove('highlight-word');
        });
      }
      
      const { word: spokenWord, charIndex: spokenCharIndex } = currentWordPosition;
      const normalizedSpokenWord = normalizeWord(spokenWord);
      
      if (!normalizedSpokenWord) {
        return;
      }
      
      // Three-stage matching strategy with larger character index tolerance
      const CHAR_INDEX_TOLERANCE = 40;
      
      // Stage 1: Find by character index proximity
      let matchingWords = allWordIndexes.filter(item => 
        Math.abs(item.charIndex - spokenCharIndex) < CHAR_INDEX_TOLERANCE && 
        item.element
      );
      
      // If multiple matches by char index, prefer word content match
      if (matchingWords.length > 1) {
        const exactMatches = matchingWords.filter(item => 
          item.normalizedWord === normalizedSpokenWord ||
          item.normalizedWord.includes(normalizedSpokenWord) ||
          normalizedSpokenWord.includes(item.normalizedWord)
        );
        
        if (exactMatches.length > 0) {
          matchingWords = exactMatches;
        }
        
        matchingWords.sort((a, b) => 
          Math.abs(a.charIndex - spokenCharIndex) - Math.abs(b.charIndex - spokenCharIndex)
        );
      }
      
      // Stage 2: If no character match, find by word after last position
      if (matchingWords.length === 0) {
        const wordMatches = allWordIndexes.filter(item => 
          (item.normalizedWord === normalizedSpokenWord ||
           item.normalizedWord.includes(normalizedSpokenWord) ||
           normalizedSpokenWord.includes(item.normalizedWord)) && 
          item.element && 
          item.index > lastHighlightedIndexRef.current
        );
        
        if (wordMatches.length > 0) {
          matchingWords = [wordMatches[0]];
        }
      }
      
      // Stage 3: Fall back to any matching word if still no match
      if (matchingWords.length === 0) {
        const anyWordMatches = allWordIndexes.filter(item => 
          (item.normalizedWord === normalizedSpokenWord ||
           item.normalizedWord.includes(normalizedSpokenWord) ||
           normalizedSpokenWord.includes(item.normalizedWord)) && 
          item.element
        );
        
        if (anyWordMatches.length > 0) {
          matchingWords = [anyWordMatches[0]];
        }
      }
      
      // Apply highlight and scroll to the best match
      if (matchingWords.length > 0 && matchingWords[0].element) {
        const bestMatch = matchingWords[0];
        const elementToHighlight = bestMatch.element;
        
        elementToHighlight.classList.add('highlight-word');
        lastHighlightedIndexRef.current = bestMatch.index;
        
        // Enhanced scrolling - make sure it's centered
        elementToHighlight.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'center'
        });
      }
    } catch (error) {
      console.error("Error highlighting word:", error);
    }
  }, [currentWordPosition, speaking, allWordIndexes]);

  const togglePlayback = () => {
    try {
      if (speaking) {
        paused ? resume() : pause();
      } else {
        lastHighlightedIndexRef.current = -1;
        speak(textContent);
      }
    } catch (error) {
      console.error("Error toggling playback:", error);
      toast.error("Error controlling playback. Please try again.");
    }
  };
  
  const handleRestart = () => {
    try {
      stop();
      lastHighlightedIndexRef.current = -1;
      
      if (contentRef.current) {
        const allWords = contentRef.current.querySelectorAll('.reader-word');
        allWords.forEach(word => {
          word.classList.remove('highlight-word');
        });
      }
      
      setTimeout(() => {
        speak(textContent);
      }, 300);
    } catch (error) {
      console.error("Error restarting playback:", error);
      toast.error("Could not restart reading. Please try again.");
    }
  };

  const handleVolumeChange = (value: number[]) => {
    try {
      const newVolume = value[0];
      setVolume(newVolume);
      if (speaking) {
        stop();
        setTimeout(() => speak(textContent), 100);
      }
    } catch (error) {
      console.error("Error changing volume:", error);
    }
  };

  const handleRateChange = (value: number[]) => {
    try {
      const newRate = value[0];
      setRate(newRate);
      if (speaking) {
        stop();
        setTimeout(() => speak(textContent), 100);
      }
    } catch (error) {
      console.error("Error changing rate:", error);
    }
  };
  
  const handleGoBack = () => {
    stop();
    navigate(returnPath || -1);
  };

  if (!title || !content) {
    return <div className="p-8 text-center">Loading content...</div>;
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header with back button and controls */}
      <header className="border-b p-4 bg-background/95 backdrop-blur-sm fixed top-0 left-0 right-0 z-20">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleGoBack} 
            aria-label="Go back"
            className="flex items-center gap-2"
          >
            <ArrowLeft size={18} />
            <span>Exit Reader</span>
          </Button>
          
          <div className="flex items-center gap-4">
            {/* Speed Controls */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Speed</span>
              <div className="w-32">
                <Slider
                  value={[rate]}
                  min={0.5}
                  max={2}
                  step={0.1}
                  onValueChange={handleRateChange}
                />
              </div>
              <span className="text-sm font-medium">{rate.toFixed(1)}x</span>
            </div>

            {/* Volume Controls */}  
            <div className="flex items-center gap-2">
              {volume === 0 ? (
                <VolumeX size={16} className="text-muted-foreground" />
              ) : (
                <Volume2 size={16} />
              )}
              <div className="w-24">
                <Slider
                  value={[volume]}
                  min={0}
                  max={1}
                  step={0.1}
                  onValueChange={handleVolumeChange}
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content with extra large text */}
      <main className="flex-1 pt-16 pb-20 overflow-hidden bg-background">
        <div className="h-full flex items-center justify-center overflow-hidden">
          <style>
            {`
            .highlight-word {
              background-color: rgba(var(--primary) / 0.3);
              color: hsl(var(--primary));
              font-weight: bold;
              border-radius: 0.25rem;
              padding: 0 0.25rem;
              transition: all 0.2s ease-out;
              transform: scale(1.1);
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            
            .reader-word {
              transition: all 0.2s ease-out;
              display: inline-block;
              margin: 0.25rem 0.5rem;
              padding: 0.25rem;
              border-radius: 0.25rem;
              font-size: 3rem;
              line-height: 1.5;
            }

            .reader-content-container {
              display: flex;
              justify-content: center;
              align-items: center;
              max-width: 100%;
              max-height: 100%;
              overflow: hidden;
            }
            
            .reader-content {
              overflow-y: auto;
              overflow-x: hidden;
              text-align: center;
              padding: 2rem;
              max-width: 100%;
              height: 100%;
              scroll-behavior: smooth;
            }

            .reader-content p, .reader-content h1, .reader-content h2, .reader-content h3 {
              margin-bottom: 3rem;
              display: flex;
              flex-wrap: wrap;
              justify-content: center;
            }
            `}
          </style>
          <div className="reader-content-container w-full h-full">
            <div 
              ref={contentRef}
              className="reader-content text-4xl font-medium"
              dangerouslySetInnerHTML={{ __html: processedContent }}
            />
          </div>
        </div>
      </main>

      {/* Audio Controls */}
      <footer className="fixed bottom-0 left-0 right-0 p-4 border-t bg-background/95 backdrop-blur-sm z-20">
        <div className="flex items-center justify-center gap-4 max-w-7xl mx-auto">
          {supported ? (
            <>
              <Button
                variant="outline"
                size="icon"
                onClick={handleRestart}
                aria-label="Restart Reading"
                className="rounded-full w-12 h-12"
              >
                <RefreshCcw className="h-5 w-5" />
              </Button>
              
              <Button
                variant="default"
                size="lg"
                className="rounded-full w-16 h-16 flex items-center justify-center"
                onClick={togglePlayback}
                aria-label={speaking && !paused ? "Pause Reading" : "Start Reading"}
              >
                {speaking && !paused ? (
                  <Pause className="h-8 w-8" />
                ) : (
                  <Play className="h-8 w-8 ml-1" />
                )}
              </Button>
            </>
          ) : (
            <div className="text-sm text-muted-foreground">
              Text-to-speech not supported in this browser
            </div>
          )}
        </div>
      </footer>
    </div>
  );
}

export default ImmersiveReaderView;
