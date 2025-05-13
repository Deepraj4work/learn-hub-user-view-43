import { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "@/components/ui/use-toast";

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
  
  // Clean text before speech processing
  const cleanTextForSpeech = useCallback((text: string): string => {
    // Enhanced text cleaning with multiple strategies for problematic whitespace
    return text
      .replace(/\s+/g, ' ')         // Replace multiple spaces with a single space
      .replace(/[\n\r\t\f\v]+/g, ' ')  // Replace all newlines, tabs, etc with spaces
      .replace(/\u00A0/g, ' ')      // Replace non-breaking spaces
      .replace(/\u2003/g, ' ')      // Replace em spaces
      .replace(/\u2002/g, ' ')      // Replace en spaces
      .replace(/\u2000/g, ' ')      // Replace other Unicode spaces
      .replace(/\. +/g, '. ')       // Normalize spaces after periods
      .replace(/ +\./g, '.')        // Normalize spaces before periods
      .trim();                      // Remove leading/trailing whitespace
  }, []);
  
  // Prepare utterance with proper event handlers
  const prepareUtterance = useCallback((textToSpeak: string, chunkIndex: number, totalOffset: number) => {
    if (!supported) return null;
    
    try {
      console.log(`Creating utterance for chunk ${chunkIndex} with length: ${textToSpeak.length}`);
      const cleanedText = cleanTextForSpeech(textToSpeak);
      
      const utterance = new SpeechSynthesisUtterance(cleanedText);
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
            
            // Calculate offset for the next chunk
            let nextOffset = totalOffset;
            for (let i = 0; i < currentChunkIndexRef.current; i++) {
              nextOffset += chunksRef.current[i].length;
            }
            
            const nextUtterance = prepareUtterance(
              chunksRef.current[currentChunkIndexRef.current],
              currentChunkIndexRef.current,
              nextOffset
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
      
      // Track word boundaries for highlighting, accounting for chunk offsets
      utterance.onboundary = (event) => {
        try {
          if (event.name === 'word') {
            // Add the offset of previous chunks to get the correct position in the full text
            setCurrentWordPosition({
              start: totalOffset + event.charIndex,
              end: totalOffset + event.charIndex + event.charLength
            });
            
            console.log(`Word boundary in chunk ${chunkIndex}: ${totalOffset + event.charIndex}-${totalOffset + event.charIndex + event.charLength}`);
          }
        } catch (error) {
          console.error("Error in boundary event handler:", error);
        }
      };
      
      return utterance;
    } catch (error) {
      console.error("Error preparing utterance:", error);
      handleSpeechError();
      return null;
    }
  }, [rate, pitch, volume, voice, supported, cleanTextForSpeech]);
  
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
    toast({
      title: "Speech Synthesis Error",
      description: "There was a problem with the text-to-speech feature. Please try again.",
      variant: "destructive",
    });
  }, []);
  
  // Split text into chunks intelligently (at sentence or phrase boundaries where possible)
  const splitTextIntoChunks = useCallback((text: string): string[] => {
    try {
      const MAX_CHUNK_LENGTH = 150; // Smaller chunks for better reliability
      const cleanedText = cleanTextForSpeech(text);
      
      // First, split by sentences to avoid cutting in the middle of sentences
      const sentenceSplitters = /([.!?])\s+/g;
      let sentences: string[] = [];
      let lastIndex = 0;
      let match;
      
      // Extract sentences with their punctuation
      while ((match = sentenceSplitters.exec(cleanedText)) !== null) {
        sentences.push(cleanedText.substring(lastIndex, match.index + 1));
        lastIndex = match.index + match[0].length;
      }
      
      // Add the last sentence if there's text remaining
      if (lastIndex < cleanedText.length) {
        sentences.push(cleanedText.substring(lastIndex));
      }
      
      // Now group sentences into chunks of reasonable size
      const chunks: string[] = [];
      let currentChunk = "";
      
      for (const sentence of sentences) {
        // If adding this sentence would make the chunk too long
        if (currentChunk.length + sentence.length > MAX_CHUNK_LENGTH && currentChunk.length > 0) {
          // If the sentence itself is very long, split it further at commas or other natural breaks
          if (sentence.length > MAX_CHUNK_LENGTH) {
            chunks.push(currentChunk);
            
            // First try to split at commas, semicolons or other natural pauses
            const phraseSplitters = /([,;:])\s+/g;
            let phrases: string[] = [];
            let lastPhraseIndex = 0;
            let phraseMatch;
            
            while ((phraseMatch = phraseSplitters.exec(sentence)) !== null) {
              phrases.push(sentence.substring(lastPhraseIndex, phraseMatch.index + 1));
              lastPhraseIndex = phraseMatch.index + phraseMatch[0].length;
            }
            
            // Add the last phrase
            if (lastPhraseIndex < sentence.length) {
              phrases.push(sentence.substring(lastPhraseIndex));
            }
            
            // Group phrases into chunks
            currentChunk = "";
            for (const phrase of phrases) {
              if (currentChunk.length + phrase.length > MAX_CHUNK_LENGTH && currentChunk.length > 0) {
                chunks.push(currentChunk);
                currentChunk = phrase;
              } else {
                currentChunk += phrase;
              }
            }
            
            // If the phrases are still too long, fall back to splitting by words
            if (currentChunk.length > MAX_CHUNK_LENGTH) {
              const words = currentChunk.split(/\s+/);
              currentChunk = "";
              
              for (const word of words) {
                if (currentChunk.length + word.length + 1 > MAX_CHUNK_LENGTH && currentChunk.length > 0) {
                  chunks.push(currentChunk);
                  currentChunk = word + " ";
                } else {
                  currentChunk += word + " ";
                }
              }
            }
          } else {
            // Otherwise, start a new chunk with this sentence
            chunks.push(currentChunk);
            currentChunk = sentence;
          }
        } else {
          currentChunk += sentence;
        }
      }
      
      // Add the last chunk if needed
      if (currentChunk.length > 0) {
        chunks.push(currentChunk);
      }
      
      console.log(`Split text into ${chunks.length} chunks`);
      chunks.forEach((chunk, i) => {
        console.log(`Chunk ${i} (${chunk.length} chars): ${chunk.substring(0, 30)}...`);
      });
      
      return chunks;
    } catch (error) {
      console.error("Error splitting text into chunks:", error);
      return [text]; // Fallback to single chunk
    }
  }, [cleanTextForSpeech]);
  
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
      
      console.log(`Speaking full text (${textToSpeak.length} chars)`);
      
      // Split the text into manageable chunks
      chunksRef.current = splitTextIntoChunks(textToSpeak);
      currentChunkIndexRef.current = 0;
      
      // Start speaking the first chunk
      if (chunksRef.current.length > 0) {
        const utterance = prepareUtterance(chunksRef.current[0], 0, 0);
        if (!utterance) {
          handleSpeechError();
          return;
        }
        
        utteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
      }
      
      // Some browsers have a bug where speech stops after ~15 seconds
      // This is a workaround to keep it going
      const intervalId = setInterval(() => {
        if (!speaking) {
          clearInterval(intervalId);
          return;
        }
        
        if (paused) return;
        
        // Keep speech synthesis active by pausing and resuming
        try {
          window.speechSynthesis.pause();
          window.speechSynthesis.resume();
        } catch (e) {
          console.error("Error in speech keepalive:", e);
        }
      }, 5000); // Every 5 seconds
      
      return () => clearInterval(intervalId);
    } catch (error) {
      console.error("Error starting speech:", error);
      handleSpeechError();
    }
  }, [supported, prepareUtterance, splitTextIntoChunks, speaking, paused, handleSpeechError]);
  
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
