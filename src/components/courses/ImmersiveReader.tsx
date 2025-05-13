
import React, { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Volume2, Pause, Play, Settings, MinusCircle, PlusCircle, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";
import { Slider } from "@/components/ui/slider";

interface ImmersiveReaderProps {
  title: string;
  content: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ImmersiveReader({ title, content, isOpen, onClose }: ImmersiveReaderProps) {
  // State for reader settings
  const [fontSize, setFontSize] = useState("text-2xl");  // Default larger text
  const [lineHeight, setLineHeight] = useState("leading-relaxed");
  const [plainText, setPlainText] = useState("");
  const [processedContent, setProcessedContent] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [volume, setVolume] = useState(1);
  const [autoStarted, setAutoStarted] = useState(false);
  
  // Ref for the content container to enable auto-scrolling
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Extract plain text and prepare html for highlighting
  useEffect(() => {
    if (isOpen && content) {
      // Create a temporary div to parse HTML
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = content;
      
      // Get text content without HTML tags
      const textContent = tempDiv.textContent || tempDiv.innerText || "";
      setPlainText(textContent);
      
      // Set initial processed content
      setProcessedContent(content);
    }
  }, [isOpen, content]);
  
  // Handle text highlighting when narrating
  const handleHighlight = (word: string, position: number) => {
    try {
      // Create a temp div to work with the content
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = content;
      
      // Get all text nodes
      const textNodes: Node[] = [];
      const getAllTextNodes = (node: Node) => {
        if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
          textNodes.push(node);
        } else {
          for (let i = 0; i < node.childNodes.length; i++) {
            getAllTextNodes(node.childNodes[i]);
          }
        }
      };
      getAllTextNodes(tempDiv);
      
      // Find the node containing our current position
      let charCount = 0;
      let highlightNode: Node | null = null;
      let highlightOffset = 0;
      
      for (const node of textNodes) {
        const nodeText = node.textContent || "";
        if (position >= charCount && position < charCount + nodeText.length) {
          highlightNode = node;
          highlightOffset = position - charCount;
          break;
        }
        charCount += nodeText.length;
      }
      
      if (highlightNode && highlightNode.parentNode) {
        const nodeText = highlightNode.textContent || "";
        const beforeWord = nodeText.substring(0, highlightOffset);
        const currentWord = nodeText.substring(highlightOffset, highlightOffset + word.length);
        const afterWord = nodeText.substring(highlightOffset + word.length);
        
        const beforeTextNode = document.createTextNode(beforeWord);
        const afterTextNode = document.createTextNode(afterWord);
        
        // Create highlight span with larger text and animation
        const highlightSpan = document.createElement("span");
        highlightSpan.className = "bg-primary text-white animate-highlight-pulse font-bold px-1 py-0.5 rounded text-3xl";
        highlightSpan.textContent = currentWord;
        
        // Replace the original node with our three new nodes
        const parentNode = highlightNode.parentNode;
        parentNode.replaceChild(afterTextNode, highlightNode);
        parentNode.insertBefore(highlightSpan, afterTextNode);
        parentNode.insertBefore(beforeTextNode, highlightSpan);
      }
      
      // Update the content with highlighting
      setProcessedContent(tempDiv.innerHTML);
    } catch (error) {
      console.error("Error highlighting text:", error);
    }
  };
  
  // Speech synthesis integration
  const { 
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
    setRate: updateRate,
    setPitch: updatePitch,
    setVolume: updateVolume
  } = useSpeechSynthesis({
    text: `${title}. ${plainText}`,
    rate,
    pitch,
    volume,
    elementRef: contentRef,
    onHighlight: handleHighlight
  });
  
  // Auto-start speech when dialog opens
  useEffect(() => {
    if (isOpen && supported && !autoStarted) {
      // Small delay to ensure content is ready
      const timer = setTimeout(() => {
        speak();
        setAutoStarted(true);
      }, 500);
      
      return () => clearTimeout(timer);
    }
    
    // Reset auto-started flag when closed
    if (!isOpen) {
      setAutoStarted(false);
    }
  }, [isOpen, speak, supported, autoStarted]);
  
  // Stop speech when component unmounts or dialog closes
  useEffect(() => {
    if (!isOpen && speaking) {
      stop();
    }
    
    return () => {
      if (speaking) {
        stop();
      }
    };
  }, [isOpen, speaking, stop]);
  
  const togglePlayback = () => {
    if (speaking) {
      if (paused) {
        resume();
      } else {
        pause();
      }
    } else {
      speak();
    }
  };

  const handleRateChange = (value: number[]) => {
    const newRate = value[0];
    setRate(newRate);
    updateRate(newRate);
  };

  const handlePitchChange = (value: number[]) => {
    const newPitch = value[0];
    setPitch(newPitch);
    updatePitch(newPitch);
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    updateVolume(newVolume);
  };

  const increaseFontSize = () => {
    const sizes = ["text-lg", "text-xl", "text-2xl", "text-3xl", "text-4xl"];
    const currentIndex = sizes.indexOf(fontSize);
    if (currentIndex < sizes.length - 1) {
      setFontSize(sizes[currentIndex + 1]);
    }
  };

  const decreaseFontSize = () => {
    const sizes = ["text-lg", "text-xl", "text-2xl", "text-3xl", "text-4xl"];
    const currentIndex = sizes.indexOf(fontSize);
    if (currentIndex > 0) {
      setFontSize(sizes[currentIndex - 1]);
    }
  };
  
  const increaseLineHeight = () => {
    const heights = ["leading-normal", "leading-relaxed", "leading-loose", "leading-[2]", "leading-[2.5]"];
    const currentIndex = heights.indexOf(lineHeight);
    if (currentIndex < heights.length - 1) {
      setLineHeight(heights[currentIndex + 1]);
    }
  };
  
  const decreaseLineHeight = () => {
    const heights = ["leading-normal", "leading-relaxed", "leading-loose", "leading-[2]", "leading-[2.5]"];
    const currentIndex = heights.indexOf(lineHeight);
    if (currentIndex > 0) {
      setLineHeight(heights[currentIndex - 1]);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0 bg-reader-background text-reader-text">
        {/* Header */}
        <div className="flex items-center justify-between border-b p-4 bg-white dark:bg-gray-900">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onClose}>
              <ArrowLeft size={18} />
            </Button>
            <DialogTitle className="text-lg font-semibold">Immersive Reader</DialogTitle>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={decreaseFontSize} title="Decrease font size">
              <MinusCircle size={18} />
            </Button>
            <Button variant="ghost" size="icon" onClick={increaseFontSize} title="Increase font size">
              <PlusCircle size={18} />
            </Button>
            <Button variant="ghost" size="icon" onClick={increaseLineHeight} title="Increase line spacing">
              <span className="text-xs">↕+</span>
            </Button>
            <Button variant="ghost" size="icon" onClick={decreaseLineHeight} title="Decrease line spacing">
              <span className="text-xs">↕-</span>
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setShowSettings(!showSettings)} 
              className={showSettings ? "bg-primary/10" : ""}
            >
              <Settings size={18} />
            </Button>
          </div>
        </div>
        
        {/* Settings panel */}
        {showSettings && (
          <div className="p-4 border-b bg-accent/5">
            <DialogDescription className="mb-4">Customize your reading experience</DialogDescription>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Volume2 size={16} className="text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium mb-1">Volume: {Math.round(volume * 100)}%</p>
                  <Slider 
                    value={[volume]} 
                    min={0} 
                    max={1} 
                    step={0.1} 
                    onValueChange={handleVolumeChange} 
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <span className="text-xs font-medium text-muted-foreground">🐢</span>
                <div className="flex-1">
                  <p className="text-sm font-medium mb-1">Reading Speed: {rate.toFixed(1)}x</p>
                  <Slider 
                    value={[rate]} 
                    min={0.5} 
                    max={2} 
                    step={0.1} 
                    onValueChange={handleRateChange} 
                  />
                </div>
                <span className="text-xs font-medium text-muted-foreground">🐇</span>
              </div>
              
              <div className="flex items-center gap-4">
                <span className="text-xs font-medium text-muted-foreground">↓</span>
                <div className="flex-1">
                  <p className="text-sm font-medium mb-1">Pitch: {pitch.toFixed(1)}</p>
                  <Slider 
                    value={[pitch]} 
                    min={0.5} 
                    max={2} 
                    step={0.1} 
                    onValueChange={handlePitchChange} 
                  />
                </div>
                <span className="text-xs font-medium text-muted-foreground">↑</span>
              </div>
              
              {voices.length > 0 && (
                <div className="mt-4">
                  <label className="text-sm font-medium mb-1 block">Voice</label>
                  <select 
                    className="w-full p-2 rounded border bg-background"
                    value={selectedVoice?.voiceURI}
                    onChange={(e) => {
                      const selected = voices.find(v => v.voiceURI === e.target.value);
                      if (selected) setSelectedVoice(selected);
                    }}
                  >
                    {voices.map(voice => (
                      <option key={voice.voiceURI} value={voice.voiceURI}>
                        {voice.name} ({voice.lang})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 md:p-16 bg-reader-background text-reader-text">
          <div className="max-w-2xl mx-auto space-y-8" ref={contentRef}>
            <h1 className="text-3xl font-bold text-center mb-6">{title}</h1>
            
            <div className={cn("prose prose-slate dark:prose-invert max-w-none", fontSize, lineHeight)}>
              {/* This would be the parsed content with highlighting */}
              <div dangerouslySetInnerHTML={{ __html: speaking ? processedContent : content }} />
            </div>
          </div>
        </div>
        
        {/* Reading status */}
        {speaking && (
          <div className="px-8 py-2 border-t bg-primary/5">
            <p className="text-sm italic text-center">
              {currentSentence ? `"${currentSentence}"` : "Reading..."}
            </p>
          </div>
        )}
        
        {/* Audio controls */}
        <div className="flex items-center justify-center gap-4 p-4 border-t bg-white dark:bg-gray-900">
          {supported ? (
            <>
              <Button
                variant="outline"
                size="icon"
                className={cn("rounded-full w-10 h-10", volume === 0 && "bg-red-50 border-red-200")}
                onClick={() => {
                  const newVolume = volume === 0 ? 1 : 0;
                  setVolume(newVolume);
                  updateVolume(newVolume);
                }}
              >
                {volume === 0 ? <VolumeX className="h-5 w-5 text-red-500" /> : <Volume2 className="h-5 w-5" />}
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                className="rounded-full w-14 h-14 flex items-center justify-center bg-primary/10 hover:bg-primary/20 border-primary/20"
                onClick={togglePlayback}
              >
                {speaking && !paused ? (
                  <Pause className="h-6 w-6" />
                ) : (
                  <Play className="h-6 w-6 ml-1" />
                )}
              </Button>
              
              <Button
                variant="outline"
                size="icon"
                className="rounded-full w-10 h-10"
                onClick={() => stop()}
                disabled={!speaking}
              >
                <span className="h-5 w-5 flex items-center justify-center">■</span>
              </Button>
            </>
          ) : (
            <div className="text-sm text-muted-foreground">
              Text-to-speech not supported in this browser
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
