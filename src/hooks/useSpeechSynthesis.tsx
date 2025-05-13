import { useState, useEffect, useRef } from "react";

interface UseSpeechSynthesisProps {
  text: string;
  rate?: number;
  pitch?: number;
  volume?: number;
  elementRef?: React.RefObject<HTMLElement>;
  onHighlight?: (text: string, index: number) => void;
}

interface UseSpeechSynthesisReturn {
  speak: () => void;
  stop: () => void;
  pause: () => void;
  resume: () => void;
  speaking: boolean;
  paused: boolean;
  supported: boolean;
  currentWord: string;
  currentSentence: string;
}

export function useSpeechSynthesis({
  text,
  rate = 1,
  pitch = 1,
  volume = 1,
  elementRef,
  onHighlight,
}: UseSpeechSynthesisProps): UseSpeechSynthesisReturn {
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);
  const [supported, setSupported] = useState(false);
  const [currentWord, setCurrentWord] = useState("");
  const [currentSentence, setCurrentSentence] = useState("");
  
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  
  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      setSupported(true);
    }
  }, []);
  
  useEffect(() => {
    if (!supported) return;
    
    // Clean up any previous utterance
    if (utteranceRef.current) {
      utteranceRef.current.onboundary = null;
      utteranceRef.current.onend = null;
      utteranceRef.current.onstart = null;
      utteranceRef.current.onpause = null;
      utteranceRef.current.onresume = null;
    }
    
    utteranceRef.current = new SpeechSynthesisUtterance(text);
    utteranceRef.current.rate = rate;
    utteranceRef.current.pitch = pitch;
    utteranceRef.current.volume = volume;
    
    utteranceRef.current.onstart = () => setSpeaking(true);
    
    utteranceRef.current.onend = () => {
      setSpeaking(false);
      setCurrentWord("");
      setCurrentSentence("");
    };
    
    utteranceRef.current.onpause = () => setPaused(true);
    utteranceRef.current.onresume = () => setPaused(false);
    
    // Handle word boundary events for highlighting text
    utteranceRef.current.onboundary = (event) => {
      if (event.name === 'word') {
        const wordPosition = event.charIndex;
        const wordLength = event.charLength || 1;
        const word = text.substring(wordPosition, wordPosition + wordLength);
        setCurrentWord(word);
        
        // Extract the current sentence (approximate by finding boundaries)
        let sentenceStart = text.lastIndexOf('. ', wordPosition) + 2;
        if (sentenceStart < 2) sentenceStart = 0;
        
        let sentenceEnd = text.indexOf('. ', wordPosition);
        if (sentenceEnd === -1) sentenceEnd = text.length;
        else sentenceEnd += 1;
        
        const sentence = text.substring(sentenceStart, sentenceEnd);
        setCurrentSentence(sentence);
        
        // Call onHighlight callback if provided
        if (onHighlight) {
          onHighlight(word, wordPosition);
        }
        
        // Auto-scroll if element reference is provided
        if (elementRef?.current) {
          // Create a temporary element to find the word's position
          const tempElement = document.createElement('div');
          tempElement.innerHTML = text.substring(0, wordPosition);
          tempElement.style.visibility = 'hidden';
          tempElement.style.position = 'absolute';
          tempElement.style.fontSize = window.getComputedStyle(elementRef.current).fontSize;
          tempElement.style.fontFamily = window.getComputedStyle(elementRef.current).fontFamily;
          tempElement.style.whiteSpace = 'pre-wrap';
          tempElement.style.wordBreak = 'break-word';
          tempElement.style.width = elementRef.current.clientWidth + 'px';
          
          document.body.appendChild(tempElement);
          const wordTop = tempElement.clientHeight;
          document.body.removeChild(tempElement);
          
          // Scroll the element to keep the current word in view
          const scrollOffset = wordTop - elementRef.current.clientHeight / 2;
          if (scrollOffset > 0) {
            elementRef.current.scrollTop = scrollOffset;
          }
        }
      }
    };
    
    return () => {
      window.speechSynthesis.cancel();
    };
  }, [text, rate, pitch, volume, supported, elementRef, onHighlight]);
  
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
    setCurrentWord("");
    setCurrentSentence("");
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
    currentWord,
    currentSentence,
  };
}

export default useSpeechSynthesis;
