
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { LessonCard, LessonData } from "@/components/courses/LessonCard";
import { QuizCard, QuizData } from "@/components/courses/QuizCard";
import { AssignmentCard, AssignmentData } from "@/components/courses/AssignmentCard";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, BookOpen, Clock, FileText, Video } from "lucide-react";

// Dummy data for lessons
const unitLessons: LessonData[] = [
  {
    id: "1",
    moduleId: "2",
    unitId: "3",
    title: "Introduction to Context API",
    description: "Learn the problems Context API solves and how it differs from prop drilling.",
    type: "video",
    duration: "14:30",
    completed: true,
    locked: false,
    thumbnail: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?q=80&w=1000"
  },
  {
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
  },
  {
    id: "3",
    moduleId: "2",
    unitId: "3",
    title: "Consuming Context",
    description: "Learn different ways to consume context in your components.",
    type: "video",
    duration: "16:20",
    completed: false,
    locked: false,
    thumbnail: "https://images.unsplash.com/photo-1552308995-2baac1ad5490?q=80&w=1000"
  },
  {
    id: "4",
    moduleId: "2",
    unitId: "3",
    title: "useContext Hook",
    description: "Learn how the useContext hook makes it easier to consume context.",
    type: "text",
    duration: "10 min read",
    completed: false,
    locked: false
  },
  {
    id: "5",
    moduleId: "2",
    unitId: "3",
    title: "Context with Reducers",
    description: "Combine context with useReducer for more complex state management.",
    type: "presentation",
    duration: "15 min",
    completed: false,
    locked: false
  },
  {
    id: "6",
    moduleId: "2",
    unitId: "3",
    title: "Best Practices and Pitfalls",
    description: "Learn about common mistakes and best practices when using Context API.",
    type: "pdf",
    duration: "12 min read",
    completed: false,
    locked: false
  }
];

// Dummy data for quizzes
const unitQuizzes: QuizData[] = [
  {
    id: "1",
    moduleId: "2",
    unitId: "3",
    title: "Context API Quiz",
    description: "Test your understanding of Context API concepts and usage patterns.",
    questionCount: 10,
    duration: "20 min",
    status: "not-started",
    dueDate: "2025-05-15",
    passingScore: 70
  }
];

// Dummy data for assignments
const unitAssignments: AssignmentData[] = [
  {
    id: "1",
    moduleId: "2",
    unitId: "3",
    title: "Build a Theme Switcher",
    description: "Create a theme switcher application using Context API and useContext hook.",
    dueDate: "2025-05-20",
    status: "not-started",
    estimatedTime: "2 hours",
    maxScore: 100,
    fileCount: 3
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
    const contentCards = document.querySelectorAll(".content-card");
    contentCards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add("animate-fade-in");
        card.classList.remove("opacity-0");
      }, 200 + 100 * index);
    });
  }, [activeTab]);
  
  // Calculate unit progress
  const completedLessons = unitLessons.filter(lesson => lesson.completed).length;
  const totalLessons = unitLessons.length;
  const unitProgress = Math.floor((completedLessons / totalLessons) * 100);

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
          
          <div className="unit-header opacity-0 transition-all duration-500 ease-in-out mb-8">
            <h1 className="text-3xl font-bold mb-2">Context API & useContext</h1>
            <p className="text-muted-foreground mb-4">
              Managing global state with React Context and the useContext hook.
            </p>
            
            <div className="flex items-center flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground mb-4">
              <div className="flex items-center gap-1">
                <Video size={16} />
                <span>3 Videos</span>
              </div>
              <div className="flex items-center gap-1">
                <FileText size={16} />
                <span>3 Reading Materials</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={16} />
                <span>1h 45m</span>
              </div>
            </div>
            
            <div className="mt-4 mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">Unit Progress</span>
                <span className="font-medium">{unitProgress}%</span>
              </div>
              <Progress value={unitProgress} className="h-2" />
            </div>
            
            <div className="mt-6 flex flex-wrap gap-3">
              <Button>Continue Learning</Button>
              <Button variant="outline">Download Materials</Button>
            </div>
          </div>
          
          <Tabs 
            defaultValue="lessons" 
            className="w-full"
            onValueChange={(value) => setActiveTab(value)}
          >
            <TabsList className="mb-6">
              <TabsTrigger value="lessons">
                Lessons ({totalLessons})
              </TabsTrigger>
              <TabsTrigger value="quizzes">
                Quizzes ({unitQuizzes.length})
              </TabsTrigger>
              <TabsTrigger value="assignments">
                Assignments ({unitAssignments.length})
              </TabsTrigger>
              <TabsTrigger value="resources">
                Resources
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="lessons" className="mt-0">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {unitLessons.map((lesson) => (
                    <div key={lesson.id} className="content-card opacity-0 transition-all duration-500 ease-in-out">
                      <LessonCard lesson={lesson} />
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="quizzes" className="mt-0">
              <div className="space-y-6">
                {unitQuizzes.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {unitQuizzes.map((quiz) => (
                      <div key={quiz.id} className="content-card opacity-0 transition-all duration-500 ease-in-out">
                        <QuizCard quiz={quiz} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 rounded-lg border border-dashed flex flex-col items-center justify-center">
                    <p className="text-muted-foreground">No quizzes available for this unit.</p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="assignments" className="mt-0">
              <div className="space-y-6">
                {unitAssignments.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {unitAssignments.map((assignment) => (
                      <div key={assignment.id} className="content-card opacity-0 transition-all duration-500 ease-in-out">
                        <AssignmentCard assignment={assignment} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 rounded-lg border border-dashed flex flex-col items-center justify-center">
                    <p className="text-muted-foreground">No assignments available for this unit.</p>
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
                    <BookText className="h-5 w-5 mt-1 text-primary" />
                    <div>
                      <h3 className="text-base font-medium m-0">Context API Documentation</h3>
                      <p className="text-sm text-muted-foreground mt-1 mb-2">
                        Official React documentation for Context API
                      </p>
                      <Button size="sm" variant="outline">View Documentation</Button>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 border rounded-md bg-accent/20">
                    <BookText className="h-5 w-5 mt-1 text-primary" />
                    <div>
                      <h3 className="text-base font-medium m-0">Code Examples</h3>
                      <p className="text-sm text-muted-foreground mt-1 mb-2">
                        GitHub repository with all code examples from this unit
                      </p>
                      <Button size="sm" variant="outline">View Code</Button>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 border rounded-md bg-accent/20">
                    <BookText className="h-5 w-5 mt-1 text-primary" />
                    <div>
                      <h3 className="text-base font-medium m-0">Practice Exercises</h3>
                      <p className="text-sm text-muted-foreground mt-1 mb-2">
                        Additional exercises to practice Context API concepts
                      </p>
                      <Button size="sm" variant="outline">Download</Button>
                    </div>
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
