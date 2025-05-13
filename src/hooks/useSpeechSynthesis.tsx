import { useState, useEffect, useRef, useCallback } from "react";

interface UseSpeechSynthesisProps {
  text?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
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
  
  // Prepare utterance with proper event handlers
  const prepareUtterance = useCallback((textToSpeak: string) => {
    if (!supported) return null;
    
    console.log("Creating utterance with text length:", textToSpeak.length);
    
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;
    
    utterance.onstart = () => {
      setSpeaking(true);
      setPaused(false);
      console.log("Speech started for chunk:", currentChunkIndexRef.current);
    };
    
    utterance.onend = () => {
      // If there are more chunks to speak
      if (currentChunkIndexRef.current < chunksRef.current.length - 1) {
        currentChunkIndexRef.current++;
        const nextUtterance = prepareUtterance(chunksRef.current[currentChunkIndexRef.current]);
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
      console.error("Speech error:", event);
      setSpeaking(false);
      setPaused(false);
    };
    
    // Track word boundaries for highlighting
    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        // Calculate absolute position in the full text
        const chunkStartIndex = calculateChunkStartIndex(currentChunkIndexRef.current);
        
        setCurrentWordPosition({
          start: chunkStartIndex + event.charIndex,
          end: chunkStartIndex + event.charIndex + event.charLength
        });
        
        console.log(`Word boundary: ${chunkStartIndex + event.charIndex}-${chunkStartIndex + event.charIndex + event.charLength}`);
      }
    };
    
    return utterance;
  }, [rate, pitch, volume, supported]);
  
  // Calculate the starting position of a chunk in the full text
  const calculateChunkStartIndex = useCallback((chunkIndex: number): number => {
    let startIndex = 0;
    for (let i = 0; i < chunkIndex; i++) {
      startIndex += chunksRef.current[i].length;
    }
    return startIndex;
  }, []);
  
  // Split text into chunks at sentence boundaries
  const splitTextIntoChunks = useCallback((text: string): string[] => {
    const MAX_CHUNK_LENGTH = 500; // Shorter chunks for better reliability
    
    // Split into sentences, trying to break at natural boundaries
    const sentenceRegex = /[.!?]\s+/;
    const sentences = text.split(sentenceRegex);
    
    const chunks: string[] = [];
    let currentChunk = "";
    
    for (let i = 0; i < sentences.length; i++) {
      let sentence = sentences[i];
      
      // Add back the punctuation and space that was lost in the split
      if (i < sentences.length - 1) {
        const punctuationMatch = text.match(new RegExp(`${sentence.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([.!?]\\s+)`));
        if (punctuationMatch && punctuationMatch[1]) {
          sentence += punctuationMatch[1];
        }
      }
      
      // If adding this sentence would exceed the max length, start a new chunk
      if (currentChunk.length + sentence.length > MAX_CHUNK_LENGTH && currentChunk.length > 0) {
        chunks.push(currentChunk);
        currentChunk = sentence;
      } else {
        currentChunk += sentence;
      }
    }
    
    // Add the last chunk if it has content
    if (currentChunk.length > 0) {
      chunks.push(currentChunk);
    }
    
    console.log(`Split text into ${chunks.length} chunks`);
    return chunks;
  }, []);
  
  // Main speak function
  const speak = useCallback((customText?: string) => {
    if (!supported) return;
    
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
      const utterance = prepareUtterance(chunksRef.current[0]);
      if (!utterance) return;
      
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
  }, [supported, prepareUtterance, splitTextIntoChunks, speaking, paused]);
  
  const stop = useCallback(() => {
    if (!supported) return;
    
    window.speechSynthesis.cancel();
    setSpeaking(false);
    setPaused(false);
    setCurrentWordPosition(null);
    currentChunkIndexRef.current = 0;
  }, [supported]);
  
  const pause = useCallback(() => {
    if (!supported) return;
    
    window.speechSynthesis.pause();
  }, [supported]);
  
  const resume = useCallback(() => {
    if (!supported) return;
    
    window.speechSynthesis.resume();
  }, [supported]);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (supported) {
        window.speechSynthesis.cancel();
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
