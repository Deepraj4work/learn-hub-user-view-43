
import { useState, useEffect, useRef } from "react";

interface UseSpeechSynthesisProps {
  text: string;
  rate?: number;
  pitch?: number;
  volume?: number;
}

interface UseSpeechSynthesisReturn {
  speak: () => void;
  stop: () => void;
  pause: () => void;
  resume: () => void;
  speaking: boolean;
  paused: boolean;
  supported: boolean;
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
  
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  
  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      setSupported(true);
    }
  }, []);
  
  useEffect(() => {
    if (!supported) return;
    
    utteranceRef.current = new SpeechSynthesisUtterance(text);
    utteranceRef.current.rate = rate;
    utteranceRef.current.pitch = pitch;
    utteranceRef.current.volume = volume;
    
    utteranceRef.current.onstart = () => setSpeaking(true);
    utteranceRef.current.onend = () => setSpeaking(false);
    utteranceRef.current.onpause = () => setPaused(true);
    utteranceRef.current.onresume = () => setPaused(false);
    
    return () => {
      window.speechSynthesis.cancel();
    };
  }, [text, rate, pitch, volume, supported]);
  
  const speak = () => {
    if (!supported || !utteranceRef.current) return;
    
    // Cancel any previous speech
    window.speechSynthesis.cancel();
    
    // Speak the new text
    window.speechSynthesis.speak(utteranceRef.current);
  };
  
  const stop = () => {
    if (!supported) return;
    
    window.speechSynthesis.cancel();
    setSpeaking(false);
    setPaused(false);
  };
  
  const pause = () => {
    if (!supported) return;
    
    window.speechSynthesis.pause();
  };
  
  const resume = () => {
    if (!supported) return;
    
    window.speechSynthesis.resume();
  };
  
  return {
    speak,
    stop,
    pause,
    resume,
    speaking,
    paused,
    supported,
  };
}

export default useSpeechSynthesis;
