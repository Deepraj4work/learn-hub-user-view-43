
import React, { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, Volume2, Pause, Play, Settings, BookText, LayoutGrid, MinusCircle, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";

interface ImmersiveReaderProps {
  title: string;
  content: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ImmersiveReader({ title, content, isOpen, onClose }: ImmersiveReaderProps) {
  const [fontSize, setFontSize] = useState("text-xl");
  const [lineHeight, setLineHeight] = useState("leading-relaxed");
  const [plainText, setPlainText] = useState("");
  const [htmlContent, setHtmlContent] = useState("");
  const [highlightedContent, setHighlightedContent] = useState<string>(content);
  
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
      
      // Set initial HTML content
      setHtmlContent(content);
      setHighlightedContent(content);
    }
  }, [isOpen, content]);
  
  // Handle text highlighting when narrating
  const handleHighlight = (word: string, position: number) => {
    if (!plainText) return;
    
    try {
      // This is a simplified approach; a more robust solution would use DOM manipulation
      // for complex HTML, but this works for basic highlighting
      const beforeWord = plainText.substring(0, position);
      const afterWord = plainText.substring(position + word.length);
      
      // Create a temporary div to parse the content
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = content;
      
      // Find all text nodes
      const textNodes: Node[] = [];
      const findTextNodes = (node: Node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          textNodes.push(node);
        } else {
          for (let i = 0; i < node.childNodes.length; i++) {
            findTextNodes(node.childNodes[i]);
          }
        }
      };
      
      findTextNodes(tempDiv);
      
      // Try to highlight the word in the appropriate text node
      let totalLength = 0;
      let processed = false;
      
      for (const textNode of textNodes) {
        const nodeText = textNode.textContent || "";
        if (position >= totalLength && position < totalLength + nodeText.length && !processed) {
          const relativePos = position - totalLength;
          const span = document.createElement("span");
          span.className = "bg-primary/20 text-foreground font-bold px-0.5 rounded";
          
          const textBefore = nodeText.substring(0, relativePos);
          const highlightedWord = nodeText.substring(relativePos, relativePos + word.length);
          const textAfter = nodeText.substring(relativePos + word.length);
          
          const beforeNode = document.createTextNode(textBefore);
          const wordNode = document.createTextNode(highlightedWord);
          const afterNode = document.createTextNode(textAfter);
          
          span.appendChild(wordNode);
          
          const parentNode = textNode.parentNode;
          if (parentNode) {
            parentNode.replaceChild(afterNode, textNode);
            parentNode.insertBefore(span, afterNode);
            parentNode.insertBefore(beforeNode, span);
            processed = true;
          }
          
          break;
        }
        
        totalLength += nodeText.length;
      }
      
      setHighlightedContent(tempDiv.innerHTML);
      
    } catch (error) {
      console.error("Error highlighting text:", error);
    }
  };
  
  // Speech synthesis integration
  const { speak, stop, pause, resume, speaking, paused, supported, currentWord, currentSentence } = useSpeechSynthesis({
    text: `${title}. ${plainText}`,
    rate: 1,
    pitch: 1,
    volume: 1,
    elementRef: contentRef,
    onHighlight: handleHighlight
  });
  
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
            <h2 className="text-lg font-semibold">Immersive Reader</h2>
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
            <Button variant="ghost" size="icon" onClick={onClose}>
              <LayoutGrid size={18} />
            </Button>
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 md:p-16 bg-reader-background text-reader-text">
          <div className="max-w-2xl mx-auto space-y-8" ref={contentRef}>
            <h1 className="text-3xl font-bold">{title}</h1>
            
            <div className={cn("prose prose-slate dark:prose-invert max-w-none", fontSize, lineHeight)}>
              {/* This would be the parsed content with highlighting */}
              <div dangerouslySetInnerHTML={{ __html: speaking ? highlightedContent : content }} />
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
        <div className="flex items-center justify-center p-4 border-t bg-white dark:bg-gray-900">
          {supported ? (
            <Button
              variant="outline"
              size="lg"
              className="rounded-full w-14 h-14 flex items-center justify-center"
              onClick={togglePlayback}
            >
              {speaking && !paused ? (
                <Pause className="h-6 w-6" />
              ) : (
                <Play className="h-6 w-6 ml-1" />
              )}
            </Button>
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
