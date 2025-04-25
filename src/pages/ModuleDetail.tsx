
import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { UnitCard, UnitData } from "@/components/courses/UnitCard";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, Clock, BookText, BookOpen } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Dummy data for units
const moduleUnits: UnitData[] = [
  {
    id: "1",
    moduleId: "2",
    title: "React Hooks Overview",
    description: "Introduction to React Hooks and their advantages over class components.",
    progress: 100,
    lessonCount: 5,
    quizCount: 1,
    assignmentCount: 0,
    duration: "1h 15m",
    videoCount: 3,
    textCount: 2
  },
  {
    id: "2",
    moduleId: "2",
    title: "useState and useEffect",
    description: "Learn the two most commonly used hooks for state and side effects.",
    progress: 100,
    lessonCount: 4,
    quizCount: 1,
    assignmentCount: 1,
    duration: "1h 30m",
    videoCount: 2,
    textCount: 2
  },
  {
    id: "3",
    moduleId: "2",
    title: "Context API & useContext",
    description: "Managing global state with React Context and the useContext hook.",
    progress: 60,
    lessonCount: 6,
    quizCount: 1,
    assignmentCount: 1,
    duration: "1h 45m",
    videoCount: 3,
    textCount: 3
  },
  {
    id: "4",
    moduleId: "2",
    title: "Advanced Hooks & Custom Hooks",
    description: "Explore useReducer, useMemo, useCallback, and build custom hooks.",
    progress: 0,
    lessonCount: 7,
    quizCount: 0,
    assignmentCount: 0,
    duration: "2h",
    videoCount: 4,
    textCount: 3
  }
];

export function ModuleDetail() {
  const { moduleId } = useParams();
  
  // Animation effect when component mounts
  useEffect(() => {
    // Header animation
    const header = document.querySelector(".module-header");
    setTimeout(() => {
      header?.classList.add("animate-fade-in");
      header?.classList.remove("opacity-0");
    }, 100);
    
    // Units animation with staggered delay
    const unitCards = document.querySelectorAll(".unit-card");
    unitCards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add("animate-fade-in");
        card.classList.remove("opacity-0");
      }, 200 + 100 * index);
    });
  }, []);
  
  // Calculate module progress
  const moduleProgress = Math.floor(
    moduleUnits.reduce((acc, unit) => acc + unit.progress, 0) / moduleUnits.length
  );

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader />
      
      <main className="flex-1">
        <div className="container py-6 max-w-7xl">
          <div className="flex items-center gap-2 mb-6">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/courses/modules">
                <ChevronLeft size={16} />
                Back to modules
              </Link>
            </Button>
            <Badge>React</Badge>
          </div>
          
          <div className="module-header opacity-0 transition-all duration-500 ease-in-out">
            <div className="flex md:flex-row flex-col gap-6 mb-8">
              <div className="md:w-1/3 w-full">
                <div className="rounded-xl overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1627398242454-45a1465c2479?q=80&w=1000"
                    alt="React Hooks & State Management"
                    className="w-full aspect-video object-cover"
                  />
                </div>
              </div>
              
              <div className="md:w-2/3 w-full">
                <h1 className="text-3xl font-bold mb-2">React Hooks & State Management</h1>
                <p className="text-muted-foreground mb-4">
                  Master React hooks for state and effects. Learn about context API and custom hooks.
                </p>
                
                <div className="flex items-center flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <BookOpen size={16} />
                    <span>4 Units</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BookText size={16} />
                    <span>22 Lessons</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={16} />
                    <span>5 hours</span>
                  </div>
                </div>
                
                <div className="mt-4 mb-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Module Progress</span>
                    <span className="font-medium">{moduleProgress}%</span>
                  </div>
                  <Progress value={moduleProgress} className="h-2" />
                </div>
                
                <div className="mt-6 flex flex-wrap gap-3">
                  <Button>Continue Learning</Button>
                  <Button variant="outline">Download Resources</Button>
                </div>
              </div>
            </div>
          </div>
          
          <Tabs defaultValue="units" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="units">
                Units
              </TabsTrigger>
              <TabsTrigger value="overview">
                Overview
              </TabsTrigger>
              <TabsTrigger value="resources">
                Resources
              </TabsTrigger>
              <TabsTrigger value="discussion">
                Discussion
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="units" className="mt-0">
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Module Units</h2>
                
                <div className="space-y-4">
                  {moduleUnits.map((unit) => (
                    <div key={unit.id} className="unit-card opacity-0 transition-all duration-500 ease-in-out">
                      <UnitCard unit={unit} />
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="overview" className="mt-0">
              <div className="prose max-w-none">
                <h2>About this module</h2>
                <p>
                  React Hooks are a powerful feature introduced in React 16.8 that allow you to use state and other React features without writing a class. They're a game-changer in how we build React applications.
                </p>
                
                <p>
                  In this module, you'll learn all about React Hooks, from the basics to advanced usage. We'll start with useState and useEffect, then move on to useContext and custom hooks. By the end, you'll have a deep understanding of how to use hooks to manage state and side effects in your React applications.
                </p>
                
                <h3>What you'll learn</h3>
                <ul>
                  <li>The motivation and benefits of Hooks vs. class components</li>
                  <li>Managing component state with useState</li>
                  <li>Handling side effects with useEffect</li>
                  <li>Context API and useContext for global state management</li>
                  <li>Performance optimization with useMemo and useCallback</li>
                  <li>Building and composing custom hooks</li>
                  <li>Rules of Hooks and best practices</li>
                  <li>Practical exercises and real-world examples</li>
                </ul>
                
                <h3>Prerequisites</h3>
                <p>
                  Before starting this module, you should have completed the "Introduction to React" module or have equivalent experience with React basics, including components, props, and component lifecycle.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="resources" className="mt-0">
              <div className="prose max-w-none">
                <h2>Module Resources</h2>
                <p>Here are additional resources to help you through this module:</p>
                
                <div className="mt-6 space-y-4 not-prose">
                  <div className="flex items-start gap-3 p-3 border rounded-md bg-accent/20">
                    <BookText className="h-5 w-5 mt-1 text-primary" />
                    <div>
                      <h3 className="text-base font-medium m-0">Module Slides</h3>
                      <p className="text-sm text-muted-foreground mt-1 mb-2">
                        Downloadable slides for all lectures in PDF format
                      </p>
                      <Button size="sm" variant="outline">Download</Button>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 border rounded-md bg-accent/20">
                    <BookText className="h-5 w-5 mt-1 text-primary" />
                    <div>
                      <h3 className="text-base font-medium m-0">Code Repository</h3>
                      <p className="text-sm text-muted-foreground mt-1 mb-2">
                        GitHub repository with all module examples and projects
                      </p>
                      <Button size="sm" variant="outline">View Repository</Button>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 border rounded-md bg-accent/20">
                    <BookText className="h-5 w-5 mt-1 text-primary" />
                    <div>
                      <h3 className="text-base font-medium m-0">React Hooks Cheat Sheet</h3>
                      <p className="text-sm text-muted-foreground mt-1 mb-2">
                        Quick reference guide for all React Hooks
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
                  Join the discussion with other students and instructors about this module.
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

export default ModuleDetail;
