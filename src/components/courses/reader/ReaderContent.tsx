
import React, { useState, useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import DOMPurify from "dompurify";

interface ReaderContentProps {
  title: string;
  content: string;
  fontSize: string;
  lineHeight: string;
  contentRef: React.RefObject<HTMLDivElement>;
  setPlainText: (text: string) => void;
  setProcessedContent: (content: string) => void;
  fullTextRef: React.MutableRefObject<string>;
  currentWordPosition: { start: number; end: number } | null;
  speaking: boolean;
}

export function ReaderContent({
  title,
  content,
  fontSize,
  lineHeight,
  contentRef,
  setPlainText,
  setProcessedContent,
  fullTextRef,
  currentWordPosition,
  speaking
}: ReaderContentProps) {
  const [wordElements, setWordElements] = useState<HTMLElement[]>([]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  // Extract plain text from HTML content and process for word highlighting
  useEffect(() => {
    if (content) {
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = DOMPurify.sanitize(content);
      
      // Get the text content of the div (includes all text from all elements)
      const extractedText = tempDiv.textContent || tempDiv.innerText || "";
      
      // Thoroughly clean up the text by removing problematic characters and normalizing whitespace
      const cleanedText = extractedText
        .replace(/\s+/g, ' ')  // Replace multiple spaces with a single space
        .replace(/\n+/g, ' ')  // Replace newlines with spaces
        .replace(/\t+/g, ' ')  // Replace tabs with spaces
        .replace(/\r+/g, ' ')  // Replace carriage returns with spaces
        .replace(/\f+/g, ' ')  // Replace form feeds with spaces
        .replace(/\v+/g, ' ')  // Replace vertical tabs with spaces
        .replace(/\u00A0/g, ' ')  // Replace non-breaking spaces with regular spaces
        .replace(/\u2003/g, ' ')  // Replace em spaces with regular spaces
        .trim();               // Remove leading/trailing whitespace
      
      // Combine title and content with proper spacing
      const fullText = `${title}. ${cleanedText}`;
      setPlainText(fullText);
      fullTextRef.current = fullText;
      
      // Process content for word-by-word highlighting
      processContentForHighlighting(content);
    }
  }, [content, title, setPlainText, fullTextRef]);

  // Process HTML content to wrap words in spans with unique IDs for highlighting
  const processContentForHighlighting = (htmlContent: string) => {
    try {
      // Create a DOM parser to manipulate HTML
      const parser = new DOMParser();
      const doc = parser.parseFromString(DOMPurify.sanitize(htmlContent), 'text/html');
      
      // We'll use this to track the global word index across all text nodes
      let globalWordIndex = 0;
      
      // Process all text nodes to wrap words in spans with unique IDs
      const processTextNodes = (node: Node) => {
        if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
          // Split text by spaces and create spans for each word
          const fragment = document.createDocumentFragment();
          const words = node.textContent.split(/(\s+)/);
          
          words.forEach((word, index) => {
            if (word.trim()) {
              // Create span for word with unique ID
              const span = document.createElement('span');
              span.textContent = word;
              span.className = 'reader-word transition-all duration-150';
              span.id = `reader-word-${globalWordIndex}`;
              globalWordIndex++;
              fragment.appendChild(span);
            } else if (word) {
              // Preserve whitespace
              fragment.appendChild(document.createTextNode(word));
            }
          });
          
          // Replace text node with fragment containing spans
          node.parentNode?.replaceChild(fragment, node);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          // Skip pre and code elements (preserve formatting)
          if (
            (node as Element).tagName !== 'PRE' && 
            (node as Element).tagName !== 'CODE'
          ) {
            Array.from(node.childNodes).forEach(processTextNodes);
          }
        }
      };
      
      // Process the document body
      Array.from(doc.body.childNodes).forEach(processTextNodes);
      
      // Get the processed HTML
      const processedHTML = doc.body.innerHTML;
      setProcessedContent(processedHTML);
      
      console.log(`Created ${globalWordIndex} word spans for highlighting`);
    } catch (error) {
      console.error("Error processing content for highlighting:", error);
      setProcessedContent(htmlContent); // Fallback to original content
    }
  };

  // Collect all word elements after content is processed
  useEffect(() => {
    if (contentRef.current) {
      // Allow time for the DOM to update with the processed content
      setTimeout(() => {
        const elements = Array.from(contentRef.current?.querySelectorAll('.reader-word') || []);
        setWordElements(elements as HTMLElement[]);
      }, 100);
    }
  }, [contentRef]);

  // Track and highlight current word being spoken
  useEffect(() => {
    if (!speaking || !currentWordPosition) return;
    
    try {
      // Get the word being spoken position
      const { start, end } = currentWordPosition;
      
      // Calculate which element should be highlighted based on position
      let wordIndex = 0;
      let currentPosition = 0;
      const words = fullTextRef.current.split(/\s+/);
      
      // Find the index of the current word based on its position in the full text
      for (let i = 0; i < words.length; i++) {
        const wordLength = words[i].length;
        
        // Check if current position falls within this word's range
        if (start >= currentPosition && start < currentPosition + wordLength + 1) {
          wordIndex = i;
          break;
        }
        
        // Move position counter forward (add 1 for the space)
        currentPosition += wordLength + 1;
      }
      
      // Remove previous highlights from all word elements
      const allWordElements = contentRef.current?.querySelectorAll('.reader-word');
      allWordElements?.forEach(el => {
        el.classList.remove('bg-primary/30', 'text-primary', 'font-bold', 'rounded', 'px-0.5', 'scale-125');
      });
      
      // Find the element with the corresponding ID and highlight it
      const elementId = `reader-word-${wordIndex}`;
      const elementToHighlight = document.getElementById(elementId);
      
      if (elementToHighlight) {
        // Highlight the current word with scaling
        elementToHighlight.classList.add('bg-primary/30', 'text-primary', 'font-bold', 'rounded', 'px-0.5', 'scale-125');
        
        // Ensure the ScrollArea component is accessible through refs
        if (scrollAreaRef.current) {
          // Find the scroll container - the actual scrollable element
          const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
          
          if (scrollContainer) {
            // Calculate the element position relative to the scroll container
            const elementRect = elementToHighlight.getBoundingClientRect();
            const containerRect = scrollContainer.getBoundingClientRect();
            
            // Calculate how far to scroll to center the element
            const relativeTop = elementRect.top - containerRect.top;
            const scrollTarget = relativeTop + scrollContainer.scrollTop - (containerRect.height / 2) + (elementRect.height / 2);
            
            // Perform the smooth scroll
            scrollContainer.scrollTo({
              top: scrollTarget,
              behavior: 'smooth'
            });
          } else {
            // Fallback to using scrollIntoView if we can't find the container
            elementToHighlight.scrollIntoView({
              behavior: 'smooth',
              block: 'center'
            });
          }
        }
      }
    } catch (error) {
      console.error("Error highlighting word:", error);
    }
  }, [currentWordPosition, speaking, fullTextRef]);

  return (
    <ScrollArea className="flex-1 p-8 md:p-16 bg-muted/30" ref={scrollAreaRef}>
      <div className="max-w-2xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold">{title}</h1>
        <div 
          className={cn("prose max-w-none", fontSize, lineHeight)}
          ref={contentRef}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </ScrollArea>
  );
}
