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
import MonthlyProgress from "@/components/dashboard/MonthlyProgress";

export function Dashboard() {
  const inProgressCourses = [
    {
      id: "1",
      title: "Constitutional Law Fundamentals",
      description: "Learn the essentials of US constitutional law including rights, powers, and judicial review.",
      image: "https://images.unsplash.com/photo-1589994965851-a8f479c573a9?q=80&w=1000",
      progress: 62,
      lessonsCount: 42,
      category: "Legal Studies",
      duration: "25 hours"
    },
    {
      id: "2",
      title: "Civil Litigation Procedure",
      description: "Master the procedures and strategies involved in civil litigation in American courts.",
      image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=1000",
      progress: 35,
      lessonsCount: 28,
      category: "Legal Practice",
      duration: "18 hours"
    },
    {
      id: "3",
      title: "Criminal Law and Procedure",
      description: "Study the principles of criminal law, defenses, and procedural requirements in the US justice system.",
      image: "https://images.unsplash.com/photo-1505664194779-8beaceb93744?q=80&w=1000",
      progress: 78,
      lessonsCount: 36,
      category: "Criminal Justice",
      duration: "22 hours"
    }
  ];

  const recommendedCourses = [
    {
      id: "4",
      title: "Contract Law and Drafting",
      description: "Learn to analyze, interpret, and draft legally binding contracts under US law.",
      image: "https://images.unsplash.com/photo-1589391886645-d51941baf7fb?q=80&w=1000",
      progress: 0,
      lessonsCount: 38,
      category: "Business Law",
      duration: "28 hours"
    },
    {
      id: "5",
      title: "Legal Research and Writing",
      description: "Develop essential skills for conducting legal research and preparing legal documents.",
      image: "https://images.unsplash.com/photo-1562564055-71e051d33c19?q=80&w=1000",
      progress: 0,
      lessonsCount: 32,
      category: "Legal Skills",
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
          </div>
          
          {/* Dashboard Top Section - Carousel (70%) + Calendar/Todo/Progress (30%) */}
          <div className="mb-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Section with Carousel and Progress - 70% */}
            <div className="lg:col-span-8 space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Latest Updates</h3>
                <DashboardCarousel />
              </div>
              <div>
                <h3 className="text-lg font-medium mb-3">Your Progress</h3>
                <ProgressStats />
              </div>
              <div>
                <h3 className="text-lg font-medium mb-3">Monthly Overview</h3>
                <MonthlyProgress />
              </div>
            </div>
            
            {/* Right Section with Calendar and Todo - 30% */}
            <div className="lg:col-span-4 space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Your Calendar</h3>
                <DashboardCalendar />
              </div>
              <div>
                <h3 className="text-lg font-medium mb-3">Your Tasks</h3>
                <DashboardTodo />
              </div>
            </div>
          </div>
          
          {/* Continue Learning Section */}
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
                <p className="text-muted-foreground text-sm mb-4">Discover courses tailored to your legal education goals.</p>
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
