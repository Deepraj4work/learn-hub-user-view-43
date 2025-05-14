
// Type definitions for Speechify SDK
interface SpeechifyPlayer {
  play: () => void;
  pause: () => void;
  setVolume: (volume: number) => void;
  setRate: (rate: number) => void;
  setPosition: (position: number) => void;
}

interface SpeechifyTextHighlightInfo {
  text: string;
  range: {
    start: number;
    end: number;
  };
}

interface SpeechifyInitOptions {
  text: string;
  beforePause?: () => void;
  beforePlay?: () => void;
  onTextHighlighted?: (info: SpeechifyTextHighlightInfo) => void;
}

interface Speechify {
  init: (options: SpeechifyInitOptions) => void;
  player: SpeechifyPlayer;
}

// Add Speechify to the window object
declare global {
  interface Window {
    speechify?: Speechify;
  }
}

export {};
