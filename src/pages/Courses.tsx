import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Clock, Filter, Search, SortAsc } from "lucide-react";
import { Input } from "@/components/ui/input";

// Dummy data for courses
const courses = [
  {
    id: "react-2023",
    title: "Complete React Developer in 2023",
    description: "Learn React from scratch with hooks, Redux, and more",
    category: "Web Development",
    progress: 62,
    instructor: "John Smith",
    duration: "25 hours",
    image: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?q=80&w=1000"
  },
  {
    id: "node-backend",
    title: "Node.js Backend Development",
    description: "Build scalable backend applications with Node.js and Express",
    category: "Backend",
    progress: 28,
    instructor: "Sarah Johnson",
    duration: "18 hours",
    image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?q=80&w=1000"
  },
  {
    id: "python-data",
    title: "Python for Data Science",
    description: "Master data analysis and visualization with Python",
    category: "Data Science",
    progress: 0,
    instructor: "Michael Chen",
    duration: "22 hours",
    image: "https://images.unsplash.com/photo-1526379879527-8559ecfcaec0?q=80&w=1000"
  },
  {
    id: "ui-design",
    title: "UI/UX Design Fundamentals",
    description: "Learn the principles of effective user interface design",
    category: "Design",
    progress: 0,
    instructor: "Emma Wilson",
    duration: "15 hours",
    image: "https://images.unsplash.com/photo-1545235617-9465d2a55698?q=80&w=1000"
  },
  {
    id: "mobile-flutter",
    title: "Flutter Mobile App Development",
    description: "Build cross-platform mobile apps with Flutter and Dart",
    category: "Mobile Development",
    progress: 0,
    instructor: "David Kim",
    duration: "20 hours",
    image: "https://images.unsplash.com/photo-1575089976121-8ed7b2a54265?q=80&w=1000"
  },
  {
    id: "aws-cloud",
    title: "AWS Cloud Practitioner",
    description: "Get started with Amazon Web Services cloud computing",
    category: "Cloud Computing",
    progress: 0,
    instructor: "Lisa Brown",
    duration: "16 hours",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000"
  }
];

export function Courses() {
  // Animation effect when component mounts
  useEffect(() => {
    const courseCards = document.querySelectorAll(".course-card");
    courseCards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add("animate-fade-in");
        card.classList.remove("opacity-0");
      }, 100 * index);
    });
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader />
      
      <main className="flex-1">
        <div className="container py-6 max-w-7xl">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">My Courses</h1>
            
            <div className="flex items-center gap-3">
              <div className="relative w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search courses..."
                  className="pl-8"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter size={16} className="mr-2" />
                Filters
              </Button>
              <Button variant="outline" size="sm">
                <SortAsc size={16} className="mr-2" />
                Sort
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div key={course.id} className="course-card opacity-0 transition-all duration-500 ease-in-out">
                <Card className="overflow-hidden hover:shadow-md transition-shadow">
                  <div className="aspect-video relative overflow-hidden">
                    <img 
                      src={course.image} 
                      alt={course.title}
                      className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                    />
                    <Badge className="absolute top-2 right-2 bg-black/70" variant="secondary">
                      {course.category}
                    </Badge>
                  </div>
                  
                  <CardHeader className="pb-2">
                    <CardTitle>{course.title}</CardTitle>
                    <CardDescription>{course.instructor}</CardDescription>
                  </CardHeader>
                  
                  <CardContent className="pb-2">
                    <p className="text-sm text-muted-foreground mb-4">{course.description}</p>
                    
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                      <div className="flex items-center gap-1">
                        <BookOpen size={14} />
                        <span>Course</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>{course.duration}</span>
                      </div>
                    </div>
                    
                    {course.progress > 0 && (
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium">{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} className="h-2" />
                      </div>
                    )}
                  </CardContent>
                  
                  <CardFooter className="pt-2">
                    <Link to={`/courses/${course.id}`} className="w-full">
                      <Button variant="default" className="w-full">
                        {course.progress > 0 ? "Continue Learning" : "Start Course"}
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Courses;
