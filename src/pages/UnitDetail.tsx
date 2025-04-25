
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { LessonCard } from "@/components/courses/LessonCard";
import { QuizCard } from "@/components/courses/QuizCard";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChevronLeft,
  Clock,
  FileText,
  BookOpen,
  Video,
  Book
} from "lucide-react";

// Dummy data for the unit lessons and quizzes
const unitLessons = [
  {
    id: "1",
    moduleId: "2",
    unitId: "3",
    title: "Introduction to Context API",
    description: "Learn about the React Context API and its use cases",
    type: "video",
    duration: "15:20",
    completed: true,
    locked: false,
    thumbnail: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=1000"
  },
  {
    id: "2",
    moduleId: "2",
    unitId: "3",
    title: "Creating a Context Provider",
    description: "Step-by-step guide to creating your first Context Provider",
    type: "video",
    duration: "12:45",
    completed: true,
    locked: false,
    thumbnail: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?q=80&w=1000"
  },
  {
    id: "3",
    moduleId: "2",
    unitId: "3",
    title: "Consuming Context with useContext",
    description: "How to use the useContext hook to access context values",
    type: "video",
    duration: "10:30",
    completed: false,
    locked: false,
    thumbnail: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=1000"
  },
  {
    id: "4",
    moduleId: "2",
    unitId: "3",
    title: "Context API Best Practices",
    description: "Learn the best practices for using Context API in your React applications",
    type: "text",
    duration: "8 min read",
    completed: false,
    locked: false
  },
  {
    id: "5",
    moduleId: "2",
    unitId: "3",
    title: "Context API vs Redux",
    description: "Comparing Context API with Redux for state management",
    type: "text",
    duration: "10 min read",
    completed: false,
    locked: true
  }
];

const unitQuizzes = [
  {
    id: "1",
    moduleId: "2",
    unitId: "3",
    title: "Context API Quiz",
    description: "Test your knowledge of React Context API",
    questionCount: 10,
    duration: "15 min",
    status: "not-started",
    passingScore: 70
  }
];

export function UnitDetail() {
  const { moduleId, unitId } = useParams();
  const [activeTab, setActiveTab] = useState("lessons");
  
  // Animation effect when component mounts
  useEffect(() => {
    // Header animation
    const header = document.querySelector(".unit-header");
    setTimeout(() => {
      header?.classList.add("animate-fade-in");
      header?.classList.remove("opacity-0");
    }, 100);
    
    // Content animation with staggered delay
    const lessonCards = document.querySelectorAll(".lesson-card");
    lessonCards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add("animate-fade-in");
        card.classList.remove("opacity-0");
      }, 200 + 100 * index);
    });
  }, []);
  
  // Calculate unit progress
  const totalItems = unitLessons.length;
  const completedItems = unitLessons.filter(lesson => lesson.completed).length;
  const unitProgress = Math.floor((completedItems / totalItems) * 100);

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader />
      
      <main className="flex-1">
        <div className="container py-6 max-w-7xl">
          <div className="flex items-center gap-2 mb-6">
            <Button variant="ghost" size="sm" asChild>
              <Link to={`/courses/module/${moduleId}`}>
                <ChevronLeft size={16} />
                Back to module
              </Link>
            </Button>
            <Badge>Context API</Badge>
          </div>
          
          <div className="unit-header opacity-0 transition-all duration-500 ease-in-out">
            <div className="flex md:flex-row flex-col gap-6 mb-8">
              <div className="md:w-2/3 w-full">
                <h1 className="text-2xl font-bold mb-2">Context API & useContext</h1>
                <p className="text-muted-foreground mb-4">
                  Managing global state with React Context and the useContext hook.
                  Learn how to create, provide, and consume context in your React applications.
                </p>
                
                <div className="flex items-center flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <FileText size={16} />
                    <span>6 Lessons</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={16} />
                    <span>1h 45m</span>
                  </div>
                </div>
                
                <div className="mt-4 mb-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Unit Progress</span>
                    <span className="font-medium">{unitProgress}%</span>
                  </div>
                  <Progress value={unitProgress} className="h-2" />
                </div>
              </div>
              
              <div className="md:w-1/3 w-full flex items-center justify-center">
                <div className="bg-accent/40 p-8 rounded-xl text-center">
                  <div className="flex justify-center mb-4">
                    <div className="bg-primary/20 p-4 rounded-full">
                      <BookOpen size={32} className="text-primary" />
                    </div>
                  </div>
                  <h3 className="font-semibold mb-1">Unit 3 of 4</h3>
                  <p className="text-sm text-muted-foreground mb-4">Module: React Hooks & State Management</p>
                  <Button className="w-full">Continue Learning</Button>
                </div>
              </div>
            </div>
          </div>
          
          <Tabs defaultValue="lessons" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="lessons">
                Lessons
              </TabsTrigger>
              <TabsTrigger value="quizzes">
                Quizzes
              </TabsTrigger>
              <TabsTrigger value="resources">
                Resources
              </TabsTrigger>
              <TabsTrigger value="discussion">
                Discussion
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="lessons" className="mt-0">
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Unit Lessons</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {unitLessons.map((lesson, index) => (
                    <div key={lesson.id} className="lesson-card opacity-0 transition-all duration-500 ease-in-out">
                      <LessonCard lesson={lesson} />
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="quizzes" className="mt-0">
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Unit Quizzes</h2>
                
                {unitQuizzes.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {unitQuizzes.map(quiz => (
                      <QuizCard key={quiz.id} quiz={quiz} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 border rounded-lg bg-accent/10">
                    <p className="text-muted-foreground">No quizzes available for this unit.</p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="resources" className="mt-0">
              <div className="prose max-w-none">
                <h2>Unit Resources</h2>
                <p>Here are additional resources to help you through this unit:</p>
                
                <div className="mt-6 space-y-4 not-prose">
                  <div className="flex items-start gap-3 p-3 border rounded-md bg-accent/20">
                    <Book className="h-5 w-5 mt-1 text-primary" />
                    <div>
                      <h3 className="text-base font-medium m-0">Context API Documentation</h3>
                      <p className="text-sm text-muted-foreground mt-1 mb-2">
                        Official React documentation for Context API
                      </p>
                      <Button size="sm" variant="outline">View Documentation</Button>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 border rounded-md bg-accent/20">
                    <Video className="h-5 w-5 mt-1 text-primary" />
                    <div>
                      <h3 className="text-base font-medium m-0">Context API Patterns</h3>
                      <p className="text-sm text-muted-foreground mt-1 mb-2">
                        Video tutorial on advanced patterns with Context API
                      </p>
                      <Button size="sm" variant="outline">Watch Video</Button>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 border rounded-md bg-accent/20">
                    <Book className="h-5 w-5 mt-1 text-primary" />
                    <div>
                      <h3 className="text-base font-medium m-0">Unit Slides</h3>
                      <p className="text-sm text-muted-foreground mt-1 mb-2">
                        Downloadable slides from all lessons
                      </p>
                      <Button size="sm" variant="outline">Download</Button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="discussion" className="mt-0">
              <div className="prose max-w-none">
                <h2>Discussion Forum</h2>
                <p>
                  Join the discussion with other students and instructors about this unit.
                  Ask questions, share your insights, or help others with their questions.
                </p>
                
                <div className="mt-6 not-prose">
                  <div className="p-6 rounded-lg border border-dashed flex flex-col items-center justify-center">
                    <p className="text-muted-foreground text-center">
                      Discussion forum will appear here when you're enrolled in the course.
                    </p>
                    <Button className="mt-4">Enroll Now</Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}

export default UnitDetail;
