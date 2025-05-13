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
    
    // Split text into smaller chunks if it's too long (over 500 characters)
    // This helps prevent speech synthesis cutoff in some browsers
    const MAX_LENGTH = 1000;
    if (textToSpeak.length > MAX_LENGTH) {
      console.log(`Text is ${textToSpeak.length} chars, splitting into chunks`);
      // We'll handle this in the speak function with multiple utterances
    }
    
    console.log("Creating utterance with text length:", textToSpeak.length);
    
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;
    
    utterance.onstart = () => {
      setSpeaking(true);
      console.log("Speech started");
    };
    
    utterance.onend = () => {
      setSpeaking(false);
      setCurrentWordPosition(null);
      console.log("Speech ended");
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
        setCurrentWordPosition({
          start: event.charIndex,
          end: event.charIndex + event.charLength
        });
        console.log(`Word boundary: ${event.charIndex}-${event.charIndex + event.charLength}`);
      }
    };
    
    return utterance;
  }, [rate, pitch, volume, supported]);
  
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
    
    // Log the full text being spoken
    console.log(`Speaking text (${textToSpeak.length} chars)`);
    
    // Break text into smaller chunks if it's longer than 1000 characters
    // This helps with Chrome's 32kb utterance limit and prevents cutoffs
    const MAX_CHUNK_LENGTH = 1000;
    
    if (textToSpeak.length <= MAX_CHUNK_LENGTH) {
      // For shorter text, just use a single utterance
      const utterance = prepareUtterance(textToSpeak);
      if (!utterance) return;
      
      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    } else {
      // For longer text, we need to split it into chunks at sentence boundaries
      console.log(`Text too long (${textToSpeak.length}), breaking into chunks`);
      
      // Find sentence boundaries (period followed by space or end of text)
      let chunks = [];
      let startIndex = 0;
      let currentLength = 0;
      let currentChunk = "";
      
      // Split into sentences
      const sentences = textToSpeak.split(/(?<=\.)\s+/);
      
      // Group sentences into chunks of reasonable size
      for (let i = 0; i < sentences.length; i++) {
        const sentence = sentences[i];
        if (currentLength + sentence.length <= MAX_CHUNK_LENGTH) {
          currentChunk += (currentChunk ? " " : "") + sentence;
          currentLength += sentence.length + 1; // +1 for the space
        } else {
          // Current chunk is full, start a new one
          if (currentChunk) {
            chunks.push(currentChunk);
          }
          currentChunk = sentence;
          currentLength = sentence.length;
        }
      }
      
      // Add the last chunk if it exists
      if (currentChunk) {
        chunks.push(currentChunk);
      }
      
      console.log(`Split into ${chunks.length} chunks`);
      
      // Speak only the first chunk for now
      if (chunks.length > 0) {
        const utterance = prepareUtterance(chunks[0]);
        if (!utterance) return;
        
        // Queue up the next chunks when each chunk finishes
        let currentChunkIndex = 0;
        
        utterance.onend = function() {
          currentChunkIndex++;
          if (currentChunkIndex < chunks.length) {
            const nextUtterance = prepareUtterance(chunks[currentChunkIndex]);
            if (nextUtterance) {
              // Carry forward the onend handler for chaining
              nextUtterance.onend = utterance.onend;
              window.speechSynthesis.speak(nextUtterance);
              utteranceRef.current = nextUtterance;
            }
          } else {
            // All chunks finished
            setSpeaking(false);
            setCurrentWordPosition(null);
            console.log("Speech ended (all chunks)");
          }
        };
        
        utteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
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
    }, 9000); // Every 9 seconds
    
    return () => clearInterval(intervalId);
  }, [supported, prepareUtterance, speaking, paused]);
  
  const stop = useCallback(() => {
    if (!supported) return;
    
    window.speechSynthesis.cancel();
    setSpeaking(false);
    setPaused(false);
    setCurrentWordPosition(null);
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
