
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
    
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;
    
    utterance.onstart = () => {
      setSpeaking(true);
      setCurrentWordPosition(null);
    };
    
    utterance.onend = () => {
      setSpeaking(false);
      setCurrentWordPosition(null);
    };
    
    utterance.onpause = () => setPaused(true);
    utterance.onresume = () => setPaused(false);
    
    // Track word boundaries for highlighting
    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        setCurrentWordPosition({
          start: event.charIndex,
          end: event.charIndex + event.charLength
        });
      }
    };
    
    return utterance;
  }, [rate, pitch, volume, supported]);
  
  const speak = useCallback((customText?: string) => {
    if (!supported) return;
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const textToSpeak = customText || textContentRef.current;
    if (!textToSpeak) return;
    
    // Create a new utterance for each speak call to ensure boundary events work correctly
    const utterance = prepareUtterance(textToSpeak);
    if (!utterance) return;
    
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [supported, prepareUtterance]);
  
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
