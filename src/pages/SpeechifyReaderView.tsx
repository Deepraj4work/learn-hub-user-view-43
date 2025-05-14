
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SpeechifyReader } from "@/components/courses/SpeechifyReader";

export function SpeechifyReaderView() {
  const location = useLocation();
  const navigate = useNavigate();
  const { content, title } = location.state || { content: '', title: '' };

  useEffect(() => {
    // If no content is provided, navigate back
    if (!content) {
      navigate(-1);
    }
    
    // Set body style to prevent scrolling
    document.body.style.overflow = 'hidden';
    
    return () => {
      // Restore body style
      document.body.style.overflow = '';
    };
  }, [content, navigate]);

  const handleClose = () => {
    navigate(-1);
  };

  return content ? (
    <SpeechifyReader
      content={content}
      title={title}
      onClose={handleClose}
    />
  ) : null;
}

export default SpeechifyReaderView;
