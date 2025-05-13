
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronLeft, 
  ChevronRight, 
  BookOpen,
  Clock,
  Bookmark,
  BookmarkPlus,
  Download,
  Share2
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { LessonData } from "@/components/courses/LessonCard";
import { ImmersiveReader } from "@/components/courses/ImmersiveReader";
import { toast } from "sonner";

// Dummy lesson data
const lessonData: LessonData = {
  id: "2",
  moduleId: "2",
  unitId: "3",
  title: "Creating a Context",
  description: "Learn how to create a context and provide it to your component tree.",
  type: "video",
  duration: "18:45",
  completed: true,
  locked: false,
  thumbnail: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=1000"
};

// Sample lesson content HTML
const lessonContent = `
  <h2>Creating a Context in React</h2>
  
  <p>
    React's Context API provides a way to share values like themes, user data, or any other application state between components without having to explicitly pass props through every level of the component tree. This lesson will teach you how to create a context and provide it to your component tree.
  </p>
  
  <h3>Step 1: Create a Context</h3>
  <p>
    The first step is to create a context using the <code>createContext</code> function. This function takes an optional default value and returns a Context object.
  </p>
  
  <pre><code>
import React, { createContext } from 'react';

// Create a context with a default value
const ThemeContext = createContext('light');

export default ThemeContext;
  </code></pre>
  
  <h3>Step 2: Create a Provider Component</h3>
  <p>
    Next, you'll want to create a provider component that uses the Context.Provider to pass the value down the component tree.
  </p>
  
  <pre><code>
import React, { useState } from 'react';
import ThemeContext from './ThemeContext';

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  // The value prop is what will be available to any consuming component
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
  </code></pre>
  
  <h3>Step 3: Wrap Your Application</h3>
  <p>
    To make the context available to all components in your application, wrap your app with the Provider.
  </p>
  
  <pre><code>
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import ThemeProvider from './ThemeProvider';

ReactDOM.render(
  <ThemeProvider>
    <App />
  </ThemeProvider>,
  document.getElementById('root')
);
  </code></pre>
  
  <h3>Key Points to Remember</h3>
  <ul>
    <li>The <code>createContext</code> function creates a context object</li>
    <li>The Context object comes with a Provider React component</li>
    <li>The Provider component accepts a <code>value</code> prop that will be passed to consuming components</li>
    <li>All components that need access to the context must be descendants of the Provider</li>
    <li>When the Provider's value changes, all descendant consumers will re-render</li>
  </ul>
  
  <h3>Summary</h3>
  <p>
    In this lesson, you've learned how to create a context and provide it to your component tree. In the next lesson, we'll explore how to consume this context in your components.
  </p>
`;

export function LessonView() {
  const { moduleId, unitId, lessonId } = useParams();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isImmersiveReaderOpen, setIsImmersiveReaderOpen] = useState(false);
  
  // Animation effect when component mounts
  useEffect(() => {
    const lessonContent = document.querySelector(".lesson-content");
    setTimeout(() => {
      lessonContent?.classList.add("animate-fade-in");
      lessonContent?.classList.remove("opacity-0");
    }, 100);
  }, []);

  const handleOpenImmersiveReader = () => {
    setIsImmersiveReaderOpen(true);
    toast.success("Immersive Reader activated");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader />
      
      <main className="flex-1 bg-muted/30">
        <div className="container py-6 max-w-5xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link to={`/courses/module/${moduleId}/unit/${unitId}`}>
                  <ChevronLeft size={16} />
                  Back to unit
                </Link>
              </Button>
              <Badge>Context API</Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleOpenImmersiveReader}
                className="flex items-center gap-1"
              >
                <BookOpen size={16} className="mr-1" />
                Immersive Reader
              </Button>

              <Button variant="outline" size="sm" onClick={() => setIsBookmarked(!isBookmarked)}>
                {isBookmarked ? (
                  <>
                    <Bookmark size={16} className="mr-2" />
                    Bookmarked
                  </>
                ) : (
                  <>
                    <BookmarkPlus size={16} className="mr-2" />
                    Bookmark
                  </>
                )}
              </Button>
              
              <Button variant="outline" size="sm">
                <Download size={16} className="mr-2" />
                Download
              </Button>
              
              <Button variant="outline" size="sm">
                <Share2 size={16} className="mr-2" />
                Share
              </Button>
            </div>
          </div>
          
          <div className="lesson-content opacity-0 transition-all duration-500 ease-in-out">
            {/* Video content */}
            {lessonData.type === "video" && (
              <Card className="mb-6 overflow-hidden">
                <div className="aspect-video bg-black flex items-center justify-center">
                  <div className="text-center p-4">
                    <BookOpen size={48} className="mx-auto mb-4 text-primary" />
                    <p className="text-white">Video player would be displayed here</p>
                  </div>
                </div>
              </Card>
            )}
            
            {/* Lesson metadata */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-2">{lessonData.title}</h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock size={16} />
                  <span>{lessonData.duration}</span>
                </div>
              </div>
            </div>
            
            {/* Lesson content */}
            <Card>
              <CardContent className="p-6">
                <div className="prose max-w-none">
                  {/* In a real app, this would be the parsed content from your CMS or API */}
                  <div dangerouslySetInnerHTML={{ __html: lessonContent }} />
                </div>
              </CardContent>
            </Card>
            
            {/* Navigation buttons */}
            <div className="flex justify-between mt-6">
              <Button variant="outline" size="lg" asChild>
                <Link to="#prev-lesson">
                  <ChevronLeft size={16} className="mr-2" />
                  Previous Lesson
                </Link>
              </Button>
              
              <Button size="lg" asChild>
                <Link to="#next-lesson">
                  Next Lesson
                  <ChevronRight size={16} className="ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Immersive Reader Component */}
      <ImmersiveReader
        title={lessonData.title}
        content={lessonContent}
        isOpen={isImmersiveReaderOpen}
        onClose={() => setIsImmersiveReaderOpen(false)}
      />
    </div>
  );
}

export default LessonView;
