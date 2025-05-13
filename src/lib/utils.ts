
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Cleans text from HTML content for text-to-speech processing
 * Removes extra whitespace, special characters, and normalizes punctuation
 */
export function cleanTextForSpeech(text: string): string {
  return text
    .replace(/\s+/g, ' ')         // Replace multiple spaces with a single space
    .replace(/[\n\r\t\f\v]+/g, ' ')  // Replace all newlines, tabs, etc with spaces
    .replace(/\u00A0/g, ' ')      // Replace non-breaking spaces
    .replace(/\u2003/g, ' ')      // Replace em spaces
    .replace(/\u2002/g, ' ')      // Replace en spaces
    .replace(/\u2000/g, ' ')      // Replace other Unicode spaces
    .replace(/\. +/g, '. ')       // Normalize spaces after periods
    .replace(/ +\./g, '.')        // Normalize spaces before periods
    .trim();                      // Remove leading/trailing whitespace
}
