
import React from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { BookOpen } from "lucide-react";

interface ImmersiveReaderProps {
  title: string;
  content: string;
  isOpen: boolean;
  onClose: () => void;
  currentPath: string;
}

export function ImmersiveReader({
  title,
  content,
  isOpen,
  onClose,
  currentPath,
}: ImmersiveReaderProps) {
  const navigate = useNavigate();

  const handleLaunchFullReader = () => {
    // Close the dialog
    onClose();
    
    // Navigate to the full-page immersive reader with the content
    navigate('/immersive-reader', {
      state: {
        title,
        content,
        returnPath: currentPath
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md p-6">
        <DialogTitle>Immersive Reader</DialogTitle>
        
        <div className="mt-4 space-y-4">
          <p className="text-center">
            Experience our new full-page immersive reader with:
          </p>
          
          <ul className="space-y-2 pl-5">
            <li className="flex items-start gap-2">
              <span>✓</span>
              <span>Extra large text display</span>
            </li>
            <li className="flex items-start gap-2">
              <span>✓</span>
              <span>Improved word highlighting and focusing</span>
            </li>
            <li className="flex items-start gap-2">
              <span>✓</span>
              <span>Adjustable reading speed</span>
            </li>
            <li className="flex items-start gap-2">
              <span>✓</span>
              <span>Better synchronization between text and speech</span>
            </li>
          </ul>
          
          <div className="flex justify-center pt-4">
            <Button 
              size="lg" 
              className="flex items-center gap-2"
              onClick={handleLaunchFullReader}
            >
              <BookOpen size={18} />
              Launch Full Reader
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
