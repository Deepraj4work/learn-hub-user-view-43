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
  
  // Clean text before speech processing
  const cleanTextForSpeech = useCallback((text: string): string => {
    // Remove extra whitespace and normalize
    return text
      .replace(/\s+/g, ' ')  // Replace multiple spaces with a single space
      .replace(/\n+/g, ' ')  // Replace newlines with spaces
      .trim();               // Remove leading/trailing whitespace
  }, []);
  
  // Prepare utterance with proper event handlers
  const prepareUtterance = useCallback((textToSpeak: string) => {
    if (!supported) return null;
    
    console.log("Creating utterance with text length:", textToSpeak.length);
    const cleanedText = cleanTextForSpeech(textToSpeak);
    
    const utterance = new SpeechSynthesisUtterance(cleanedText);
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
  }, [rate, pitch, volume, supported, cleanTextForSpeech]);
  
  // Calculate the starting position of a chunk in the full text
  const calculateChunkStartIndex = useCallback((chunkIndex: number): number => {
    let startIndex = 0;
    for (let i = 0; i < chunkIndex; i++) {
      startIndex += chunksRef.current[i].length;
    }
    return startIndex;
  }, []);
  
  // Split text into chunks intelligently (at sentence boundaries where possible)
  const splitTextIntoChunks = useCallback((text: string): string[] => {
    const MAX_CHUNK_LENGTH = 200; // Shorter chunks for better reliability
    const cleanedText = cleanTextForSpeech(text);
    
    // First, split by sentences to avoid cutting in the middle
    const sentenceEndings = /([.!?])\s+/g;
    let sentences: string[] = [];
    let lastIndex = 0;
    let match;
    
    // Extract sentences with their punctuation
    while ((match = sentenceEndings.exec(cleanedText)) !== null) {
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
        // If the sentence itself is very long, split it at word boundaries
        if (sentence.length > MAX_CHUNK_LENGTH) {
          chunks.push(currentChunk);
          
          const words = sentence.split(/\s+/);
          currentChunk = "";
          
          for (const word of words) {
            if (currentChunk.length + word.length + 1 > MAX_CHUNK_LENGTH && currentChunk.length > 0) {
              chunks.push(currentChunk);
              currentChunk = word + " ";
            } else {
              currentChunk += word + " ";
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
  }, [cleanTextForSpeech]);
  
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
      
      // Log the first few chunks for debugging
      console.log("First chunk:", chunksRef.current[0].substring(0, 50) + "...");
      if (chunksRef.current.length > 1) {
        console.log("Second chunk:", chunksRef.current[1].substring(0, 50) + "...");
      }
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
