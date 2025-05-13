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
  
  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      setSupported(true);
    }
  }, []);
  
  useEffect(() => {
    if (text) {
      textContentRef.current = text;
    }
  }, [text]);
  
  const prepareUtterance = useCallback((textToSpeak: string) => {
    if (!supported) return null;
    
    // Log the text length being processed
    console.log("Creating utterance with text length:", textToSpeak.length);
    
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;
    
    utterance.onstart = () => {
      setSpeaking(true);
      setCurrentWordPosition(null);
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
  
  const speak = useCallback((customText?: string) => {
    if (!supported) return;
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const textToSpeak = customText || textContentRef.current;
    if (!textToSpeak) {
      console.warn("No text to speak");
      return;
    }
    
    // Log the text being spoken
    console.log(`Speaking text (${textToSpeak.length} chars)`);
    
    // Create a new utterance for each speak call to ensure boundary events work correctly
    const utterance = prepareUtterance(textToSpeak);
    if (!utterance) return;
    
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    
    // Some browsers have a bug where speech stops after ~15 seconds
    // This is a workaround to keep it going
    const intervalId = setInterval(() => {
      if (!speaking) {
        clearInterval(intervalId);
        return;
      }
      
      if (paused) return;
      
      // Resume speech synthesis to keep it going
      window.speechSynthesis.pause();
      window.speechSynthesis.resume();
    }, 10000);
    
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
