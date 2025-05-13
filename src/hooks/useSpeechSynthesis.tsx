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
  voices: SpeechSynthesisVoice[];
  selectedVoice: SpeechSynthesisVoice | null;
  setSelectedVoice: (voice: SpeechSynthesisVoice) => void;
  setRate: (rate: number) => void;
  setPitch: (pitch: number) => void;
  setVolume: (volume: number) => void;
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
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [currentRate, setRate] = useState(rate);
  const [currentPitch, setPitch] = useState(pitch);
  const [currentVolume, setVolume] = useState(volume);
  
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  
  // Check if speech synthesis is supported
  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      setSupported(true);
      
      // Get available voices
      const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        if (availableVoices.length > 0) {
          setVoices(availableVoices);
          
          // Set default voice (preferably English)
          const englishVoice = availableVoices.find(voice => 
            voice.lang.includes('en-') && voice.localService
          );
          if (englishVoice && !selectedVoice) {
            setSelectedVoice(englishVoice);
          } else if (!selectedVoice && availableVoices.length) {
            setSelectedVoice(availableVoices[0]);
          }
        }
      };
      
      // Chrome loads voices asynchronously
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
      
      loadVoices();
    }
    
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);
  
  // Setup utterance whenever text or voice settings change
  useEffect(() => {
    if (!supported) return;
    
    // Fix for chrome issue where synthesis stops after ~15 seconds
    let synthInterval: number | null = null;
    
    const setupUtterance = () => {
      // Clean up any previous utterance
      if (utteranceRef.current) {
        utteranceRef.current.onboundary = null;
        utteranceRef.current.onend = null;
        utteranceRef.current.onstart = null;
        utteranceRef.current.onpause = null;
        utteranceRef.current.onresume = null;
      }
      
      utteranceRef.current = new SpeechSynthesisUtterance(text);
      utteranceRef.current.rate = currentRate;
      utteranceRef.current.pitch = currentPitch;
      utteranceRef.current.volume = currentVolume;
      
      // Set the selected voice if available
      if (selectedVoice) {
        utteranceRef.current.voice = selectedVoice;
      }
      
      utteranceRef.current.onstart = () => {
        setSpeaking(true);
        
        // Chrome bug fix - speech stops after about 15 seconds
        if (synthInterval) clearInterval(synthInterval);
        synthInterval = window.setInterval(() => {
          if (!window.speechSynthesis.speaking) {
            clearInterval(synthInterval as number);
            synthInterval = null;
            return;
          }
          
          // Force restart of synthesis if paused
          window.speechSynthesis.pause();
          window.speechSynthesis.resume();
        }, 14000);
      };
      
      utteranceRef.current.onend = () => {
        if (synthInterval) {
          clearInterval(synthInterval);
          synthInterval = null;
        }
        setSpeaking(false);
        setPaused(false);
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
            // Find the position of the current word
            const paragraphs = elementRef.current.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, span');
            
            // Traverse all paragraph-like elements to find where our word is
            for (const paragraph of paragraphs) {
              const content = paragraph.textContent || '';
              if (content.includes(word)) {
                const wordIndex = content.indexOf(word);
                if (wordIndex >= 0) {
                  // Get paragraph position
                  const paragraphTop = paragraph.offsetTop;
                  const paragraphHeight = paragraph.offsetHeight;
                  const containerHeight = elementRef.current.clientHeight;
                  
                  // Calculate scroll position to keep the word near the middle
                  const scrollPosition = paragraphTop - (containerHeight / 3);
                  if (scrollPosition > 0) {
                    elementRef.current.scrollTop = scrollPosition;
                  }
                  break;
                }
              }
            }
          }
        }
      };
    };
    
    setupUtterance();
    
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (synthInterval) {
        clearInterval(synthInterval);
      }
    };
  }, [text, currentRate, currentPitch, currentVolume, selectedVoice, supported, elementRef, onHighlight]);
  
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
    voices,
    selectedVoice,
    setSelectedVoice,
    setRate,
    setPitch,
    setVolume
  };
}

export default useSpeechSynthesis;
