
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import CourseDetail from "@/components/courses/CourseDetail";
import CourseStructureView from "@/components/courses/CourseStructureView";

// Sample course data structure
const courseModules = [
  {
    id: "1",
    title: "Getting Started with React",
    description: "Introduction to React and essential concepts",
    progress: 100,
    units: [
      {
        id: "1-1",
        moduleId: "1",
        title: "React Fundamentals",
        description: "Core concepts of React",
        progress: 100,
        lessons: [
          {
            id: "1-1-1",
            title: "Introduction to React",
            duration: "10:30",
            type: "video",
            completed: true,
            locked: false
          },
          {
            id: "1-1-2",
            title: "Setting up your environment",
            duration: "8:45",
            type: "video",
            completed: true,
            locked: false
          },
          {
            id: "1-1-3",
            title: "Your first React component",
            duration: "15:20",
            type: "video",
            completed: true,
            locked: false
          }
        ]
      },
      {
        id: "1-2",
        moduleId: "1",
        title: "Working with JSX",
        description: "Learn to write JSX efficiently",
        progress: 100,
        lessons: [
          {
            id: "1-2-1",
            title: "JSX Syntax",
            duration: "12:15",
            type: "video",
            completed: true,
            locked: false
          },
          {
            id: "1-2-2",
            title: "JSX vs HTML",
            duration: "8 min read",
            type: "text",
            completed: true,
            locked: false
          }
        ]
      }
    ]
  },
  {
    id: "2",
    title: "React Hooks & State Management",
    description: "Master React hooks for state and effects",
    progress: 60,
    units: [
      {
        id: "2-1",
        moduleId: "2",
        title: "React Hooks Overview",
        description: "Introduction to React Hooks",
        progress: 100,
        lessons: [
          {
            id: "2-1-1",
            title: "Introduction to Hooks",
            duration: "8:45",
            type: "video",
            completed: true,
            locked: false
          },
          {
            id: "2-1-2",
            title: "Hooks vs Class Components",
            duration: "10 min read",
            type: "text",
            completed: true,
            locked: false
          }
        ]
      },
      {
        id: "2-2",
        moduleId: "2",
        title: "useState and useEffect",
        description: "Learn the two most commonly used hooks",
        progress: 75,
        lessons: [
          {
            id: "2-2-1",
            title: "Managing State with useState",
            duration: "14:30",
            type: "video",
            completed: true,
            locked: false
          },
          {
            id: "2-2-2",
            title: "Side Effects with useEffect",
            duration: "16:45",
            type: "video",
            completed: true,
            locked: false
          },
          {
            id: "2-2-3",
            title: "Cleanup with useEffect",
            duration: "12:20",
            type: "video",
            completed: false,
            locked: false
          },
          {
            id: "2-2-4",
            title: "Practical Exercise",
            duration: "20 min",
            type: "assignment",
            completed: false,
            locked: false
          }
        ]
      },
      {
        id: "2-3",
        moduleId: "2",
        title: "Context API & useContext",
        description: "Managing global state with React Context",
        progress: 0,
        lessons: [
          {
            id: "2-3-1",
            title: "Introduction to Context API",
            duration: "10:15",
            type: "video",
            completed: false,
            locked: false
          },
          {
            id: "2-3-2",
            title: "Creating a Context",
            duration: "18:45",
            type: "video",
            completed: false,
            locked: false
          },
          {
            id: "2-3-3",
            title: "Using the useContext Hook",
            duration: "14:30",
            type: "video",
            completed: false,
            locked: true
          }
        ]
      }
    ]
  },
  {
    id: "3",
    title: "Building Real-World Applications",
    description: "Apply your React knowledge to real projects",
    progress: 0,
    units: [
      {
        id: "3-1",
        moduleId: "3",
        title: "Project Structure & Planning",
        description: "Setting up a scalable project",
        progress: 0,
        lessons: [
          {
            id: "3-1-1",
            title: "Planning Your Application",
            duration: "15 min read",
            type: "text",
            completed: false,
            locked: true
          },
          {
            id: "3-1-2",
            title: "Folder Structure Best Practices",
            duration: "12:30",
            type: "video",
            completed: false,
            locked: true
          }
        ]
      }
    ]
  }
];

export function CourseView() {
  const { courseId } = useParams();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col min-h-screen transition-colors duration-300">
      <DashboardHeader />
      
      <main className="flex-1">
        <div className="container py-6 max-w-7xl mx-auto">
          <CourseDetail />
          
          {isLoading ? (
            <div className="flex justify-center my-12">
              <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
            </div>
          ) : (
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                Course Structure
              </h2>
              <CourseStructureView courseId={courseId || "1"} modules={courseModules} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default CourseView;
