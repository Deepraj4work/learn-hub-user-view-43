
import React from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import ProgressStats from "@/components/dashboard/ProgressStats";
import CourseCard from "@/components/dashboard/CourseCard";
import { Button } from "@/components/ui/button";
import { BookOpen, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import DashboardCarousel from "@/components/dashboard/DashboardCarousel";
import DashboardCalendar from "@/components/dashboard/DashboardCalendar";
import DashboardTodo from "@/components/dashboard/DashboardTodo";

export function Dashboard() {
  const inProgressCourses = [
    {
      id: "1",
      title: "Complete React Developer in 2023",
      description: "Learn React with Redux, Hooks, GraphQL from industry experts. Build real projects.",
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1000",
      progress: 62,
      lessonsCount: 42,
      category: "Web Development",
      duration: "25 hours"
    },
    {
      id: "2",
      title: "Advanced JavaScript Concepts",
      description: "Master advanced JavaScript concepts: prototypal inheritance, closures, and more.",
      image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?q=80&w=1000",
      progress: 35,
      lessonsCount: 28,
      category: "Programming",
      duration: "18 hours"
    },
    {
      id: "3",
      title: "UI/UX Design Masterclass",
      description: "Create stunning user interfaces and improve user experiences for web applications.",
      image: "https://images.unsplash.com/photo-1545235617-9465d2a55698?q=80&w=1000",
      progress: 78,
      lessonsCount: 36,
      category: "Design",
      duration: "22 hours"
    }
  ];

  const recommendedCourses = [
    {
      id: "4",
      title: "Node.js Complete Guide",
      description: "Build complete backend solutions with Node.js, Express, and MongoDB.",
      image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1000",
      progress: 0,
      lessonsCount: 38,
      category: "Backend",
      duration: "28 hours"
    },
    {
      id: "5",
      title: "TypeScript Fundamentals to Advanced",
      description: "Learn TypeScript from basics to advanced concepts with practical examples.",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000",
      progress: 0,
      lessonsCount: 32,
      category: "Programming",
      duration: "20 hours"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader />
      
      <main className="flex-1">
        <div className="container py-6 max-w-7xl">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-5">Hello, Alex 👋</h2>
            <p className="text-muted-foreground">Track your progress, continue learning, and explore new courses.</p>
            <ProgressStats />
          </div>
          
          {/* New Dashboard Top Section */}
          <div className="mb-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Carousel Section - 70% */}
            <div className="lg:col-span-8">
              <h3 className="text-lg font-medium mb-3">Latest Updates</h3>
              <DashboardCarousel />
            </div>
            
            {/* Calendar & Todo Section - 30% */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="h-[350px]">
                <h3 className="text-lg font-medium mb-3">Your Calendar</h3>
                <DashboardCalendar />
              </div>
              <div>
                <h3 className="text-lg font-medium mb-3">Your Tasks</h3>
                <DashboardTodo />
              </div>
            </div>
          </div>
          
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Continue Learning</h2>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/courses">
                  View all courses
                  <ChevronRight size={16} className="ml-1" />
                </Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {inProgressCourses.map((course) => (
                <CourseCard key={course.id} {...course} />
              ))}
            </div>
          </div>
          
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Recommended for You</h2>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/catalog">
                  Browse catalog
                  <ChevronRight size={16} className="ml-1" />
                </Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedCourses.map((course) => (
                <CourseCard key={course.id} {...course} />
              ))}
              
              <div className="flex flex-col items-center justify-center border rounded-lg bg-muted/30 p-6 text-center">
                <BookOpen size={36} className="text-muted-foreground mb-3" />
                <h3 className="font-semibold mb-2">Explore More Courses</h3>
                <p className="text-muted-foreground text-sm mb-4">Discover courses tailored to your interests and learning goals.</p>
                <Button asChild>
                  <Link to="/catalog">
                    Browse Catalog
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
