
import { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "sonner";
import { cleanTextForSpeech } from "@/lib/utils";

interface UseSpeechSynthesisProps {
  text?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
  voice?: SpeechSynthesisVoice | null;
}

interface UseSpeechSynthesisReturn {
  speak: (text?: string) => void;
  stop: () => void;
  pause: () => void;
  resume: () => void;
  speaking: boolean;
  paused: boolean;
  supported: boolean;
  currentWordPosition: { start: number; end: number } | null;
}

export function useSpeechSynthesis({
  text,
  rate = 1,
  pitch = 1,
  volume = 1,
  voice = null,
}: UseSpeechSynthesisProps): UseSpeechSynthesisReturn {
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);
  const [supported, setSupported] = useState(false);
  const [currentWordPosition, setCurrentWordPosition] = useState<{ start: number; end: number } | null>(null);
  
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const textContentRef = useRef<string>("");
  const chunksRef = useRef<string[]>([]);
  const currentChunkIndexRef = useRef<number>(0);
  const wordBoundariesRef = useRef<{text: string, boundaries: {word: string, start: number, end: number}[]}>(
    {text: "", boundaries: []}
  );
  
  // Check if speech synthesis is supported
  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      setSupported(true);
    }
  }, []);
  
  // Store text in ref when it changes
  useEffect(() => {
    if (text) {
      textContentRef.current = text;
    }
  }, [text]);
  
  // Handle speech errors gracefully
  const handleSpeechError = useCallback(() => {
    // Cancel any ongoing speech
    try {
      window.speechSynthesis.cancel();
    } catch (e) {
      console.error("Error canceling speech synthesis:", e);
    }
    
    // Reset state
    setSpeaking(false);
    setPaused(false);
    setCurrentWordPosition(null);
    
    // Notify user
    toast.error("There was a problem with the text-to-speech feature. Please try again");
  }, []);
  
  // Prepare text and analyze word boundaries before speech
  const prepareTextAndBoundaries = useCallback((text: string) => {
    try {
      const cleanedText = cleanTextForSpeech(text);
      
      // Split text into words and track their positions
      const words = cleanedText.split(/\s+/);
      const boundaries: {word: string, start: number, end: number}[] = [];
      
      let currentPosition = 0;
      words.forEach(word => {
        if (word) {
          const start = currentPosition;
          const end = currentPosition + word.length;
          
          boundaries.push({
            word,
            start,
            end
          });
          
          // Move position (add word length + space)
          currentPosition = end + 1;
        }
      });
      
      // Store the analyzed text and boundaries
      wordBoundariesRef.current = {
        text: cleanedText,
        boundaries
      };
      
      return cleanedText;
    } catch (error) {
      console.error("Error preparing text:", error);
      return text;
    }
  }, []);
  
  // Prepare utterance with proper event handlers
  const prepareUtterance = useCallback((textToSpeak: string, chunkIndex: number) => {
    if (!supported) return null;
    
    try {
      console.log(`Creating utterance for chunk ${chunkIndex} with length: ${textToSpeak.length}`);
      
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = rate;
      utterance.pitch = pitch;
      utterance.volume = volume;
      
      // Set voice if provided
      if (voice) {
        utterance.voice = voice;
      }
      
      utterance.onstart = () => {
        setSpeaking(true);
        setPaused(false);
        console.log(`Speech started for chunk: ${chunkIndex}`);
      };
      
      utterance.onend = () => {
        console.log(`Speech ended for chunk: ${chunkIndex}, chunks length: ${chunksRef.current.length}`);
        
        try {
          // If there are more chunks to speak
          if (currentChunkIndexRef.current < chunksRef.current.length - 1) {
            currentChunkIndexRef.current++;
            
            const nextUtterance = prepareUtterance(
              chunksRef.current[currentChunkIndexRef.current],
              currentChunkIndexRef.current
            );
            
            if (nextUtterance) {
              window.speechSynthesis.speak(nextUtterance);
              utteranceRef.current = nextUtterance;
            }
          } else {
            // All chunks have been spoken
            setSpeaking(false);
            setPaused(false);
            setCurrentWordPosition(null);
            console.log("All speech ended");
          }
        } catch (error) {
          console.error("Error in onend handler:", error);
          handleSpeechError();
        }
      };
      
      utterance.onpause = () => {
        setPaused(true);
        console.log("Speech paused");
      };
      
      utterance.onresume = () => {
        setPaused(false);
        console.log("Speech resumed");
      };
      
      utterance.onerror = (event) => {
        console.error(`Speech error in chunk ${chunkIndex}:`, event);
        handleSpeechError();
      };
      
      // Use our pre-calculated word boundaries to track words
      utterance.onboundary = (event) => {
        if (event.name === 'word') {
          try {
            // Find the word at this position in our pre-calculated boundaries
            const approxWordIndex = Math.floor(event.charIndex / 5);
            const startIndex = Math.max(0, approxWordIndex - 3); // Look a few words back
            const endIndex = Math.min(wordBoundariesRef.current.boundaries.length - 1, approxWordIndex + 3); // And a few words forward
            
            // Find the closest match
            let bestMatch = null;
            let smallestDiff = Infinity;
            
            for (let i = startIndex; i <= endIndex; i++) {
              const boundary = wordBoundariesRef.current.boundaries[i];
              const diff = Math.abs(boundary.start - event.charIndex);
              
              if (diff < smallestDiff) {
                smallestDiff = diff;
                bestMatch = boundary;
              }
            }
            
            if (bestMatch) {
              setCurrentWordPosition({
                start: bestMatch.start,
                end: bestMatch.end
              });
              
              console.log(`Word boundary: "${bestMatch.word}" at ${bestMatch.start}-${bestMatch.end}`);
            }
          } catch (error) {
            console.error("Error in boundary event handler:", error);
          }
        }
      };
      
      return utterance;
    } catch (error) {
      console.error("Error preparing utterance:", error);
      handleSpeechError();
      return null;
    }
  }, [rate, pitch, volume, voice, supported, handleSpeechError]);
  
  // Split text into chunks intelligently at sentence boundaries
  const splitTextIntoChunks = useCallback((text: string): string[] => {
    try {
      const MAX_CHUNK_LENGTH = 100; // Smaller chunks for better reliability
      const cleanedText = cleanTextForSpeech(text);
      
      // Split text by sentences
      const sentenceSplitters = /([.!?])\s+/g;
      let sentences: string[] = [];
      let lastIndex = 0;
      let match;
      
      while ((match = sentenceSplitters.exec(cleanedText)) !== null) {
        sentences.push(cleanedText.substring(lastIndex, match.index + 1));
        lastIndex = match.index + match[0].length;
      }
      
      // Add the last sentence if there's text remaining
      if (lastIndex < cleanedText.length) {
        sentences.push(cleanedText.substring(lastIndex));
      }
      
      // Group sentences into chunks
      const chunks: string[] = [];
      let currentChunk = "";
      
      for (const sentence of sentences) {
        // If adding this sentence would make the chunk too long
        if (currentChunk.length + sentence.length > MAX_CHUNK_LENGTH && currentChunk.length > 0) {
          chunks.push(currentChunk);
          currentChunk = sentence;
        } else {
          currentChunk += sentence;
        }
      }
      
      // Add the last chunk if needed
      if (currentChunk.length > 0) {
        chunks.push(currentChunk);
      }
      
      console.log(`Split text into ${chunks.length} chunks`);
      return chunks;
    } catch (error) {
      console.error("Error splitting text into chunks:", error);
      return [text]; // Fallback to single chunk
    }
  }, []);
  
  // Main speak function
  const speak = useCallback((customText?: string) => {
    if (!supported) return;
    
    try {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const textToSpeak = customText || textContentRef.current;
      if (!textToSpeak) {
        console.warn("No text to speak");
        return;
      }
      
      console.log(`Speaking text (${textToSpeak.length} chars)`);
      
      // Prepare text and analyze word boundaries
      const processedText = prepareTextAndBoundaries(textToSpeak);
      
      // Split the text into manageable chunks
      chunksRef.current = splitTextIntoChunks(processedText);
      currentChunkIndexRef.current = 0;
      
      // Start speaking the first chunk
      if (chunksRef.current.length > 0) {
        const utterance = prepareUtterance(chunksRef.current[0], 0);
        if (!utterance) {
          handleSpeechError();
          return;
        }
        
        utteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
      }
      
      // Workaround for Chrome bug where speech stops after ~15 seconds
      const intervalId = setInterval(() => {
        if (!speaking) {
          clearInterval(intervalId);
          return;
        }
        
        if (paused) return;
        
        try {
          window.speechSynthesis.pause();
          window.speechSynthesis.resume();
        } catch (e) {
          console.error("Error in speech keepalive:", e);
        }
      }, 10000); // Every 10 seconds
      
      return () => clearInterval(intervalId);
    } catch (error) {
      console.error("Error starting speech:", error);
      handleSpeechError();
    }
  }, [supported, prepareUtterance, splitTextIntoChunks, speaking, paused, handleSpeechError, prepareTextAndBoundaries]);
  
  const stop = useCallback(() => {
    if (!supported) return;
    
    try {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      setPaused(false);
      setCurrentWordPosition(null);
      currentChunkIndexRef.current = 0;
    } catch (error) {
      console.error("Error stopping speech:", error);
    }
  }, [supported]);
  
  const pause = useCallback(() => {
    if (!supported) return;
    
    try {
      window.speechSynthesis.pause();
    } catch (error) {
      console.error("Error pausing speech:", error);
    }
  }, [supported]);
  
  const resume = useCallback(() => {
    if (!supported) return;
    
    try {
      window.speechSynthesis.resume();
    } catch (error) {
      console.error("Error resuming speech:", error);
    }
  }, [supported]);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (supported) {
        try {
          window.speechSynthesis.cancel();
        } catch (e) {
          console.error("Error during cleanup:", e);
        }
      }
    };
  }, [supported]);
  
  return {
    speak,
    stop,
    pause,
    resume,
    speaking,
    paused,
    supported,
    currentWordPosition
  };
}

export default useSpeechSynthesis;
