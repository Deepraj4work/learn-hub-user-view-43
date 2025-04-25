
import React from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import CourseCard from "@/components/dashboard/CourseCard";
import { Button } from "@/components/ui/button";
import { 
  BarChart3,
  BookCheck,
  BookOpen,
  Clock,
  Folders
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";

export function Courses() {
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
    },
    {
      id: "6",
      title: "Data Science Fundamentals",
      description: "Learn the basics of data science, statistics, and machine learning algorithms.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000",
      progress: 15,
      lessonsCount: 45,
      category: "Data Science",
      duration: "32 hours"
    }
  ];

  const completedCourses = [
    {
      id: "7",
      title: "HTML & CSS Bootcamp",
      description: "Build responsive websites with modern HTML5 and CSS3 techniques.",
      image: "https://images.unsplash.com/photo-1621839673705-6617adf9e890?q=80&w=1000",
      progress: 100,
      lessonsCount: 24,
      category: "Web Development",
      duration: "15 hours"
    },
    {
      id: "8",
      title: "Git & GitHub Complete Guide",
      description: "Master version control with Git and collaborate effectively using GitHub.",
      image: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?q=80&w=1000",
      progress: 100,
      lessonsCount: 18,
      category: "Developer Tools",
      duration: "10 hours"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader />
      
      <main className="flex-1">
        <div className="container py-6 max-w-7xl">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold">My Courses</h1>
            
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm">
                <Clock size={16} className="mr-2" />
                Recent
              </Button>
              <Button variant="outline" size="sm">
                <BarChart3 size={16} className="mr-2" />
                Progress
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="in-progress" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="in-progress" className="flex items-center gap-2">
                <BookOpen size={16} />
                In Progress ({inProgressCourses.length})
              </TabsTrigger>
              <TabsTrigger value="completed" className="flex items-center gap-2">
                <BookCheck size={16} />
                Completed ({completedCourses.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="in-progress" className="mt-0">
              {/* Featured Course */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Folders size={18} />
                  <h2 className="text-xl font-semibold">Continue Learning</h2>
                </div>
                <div className="bg-accent/30 rounded-xl p-6 border">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/3">
                      <div className="rounded-xl overflow-hidden">
                        <img 
                          src="https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1000" 
                          alt="React Course"
                          className="w-full aspect-[4/3] object-cover"
                        />
                      </div>
                    </div>
                    <div className="md:w-2/3 flex flex-col">
                      <h3 className="text-2xl font-bold mb-2">Complete React Developer in 2023</h3>
                      <p className="text-muted-foreground mb-4">Learn React with Redux, Hooks, GraphQL from industry experts. Build real projects.</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                        <span className="flex items-center gap-1">
                          <BookOpen size={16} />
                          42 Lessons
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={16} />
                          25 hours
                        </span>
                      </div>
                      <div className="mb-4 mt-auto">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">62% Complete</span>
                          <span>Module 2 of 6</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: '62%' }}></div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-3 mt-2">
                        <Button asChild>
                          <Link to="/courses/modules">
                            Continue Learning
                          </Link>
                        </Button>
                        <Button variant="outline">View Course Details</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {inProgressCourses.map((course) => (
                  <Link to="/courses/modules" key={course.id}>
                    <CourseCard key={course.id} {...course} />
                  </Link>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="completed" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {completedCourses.map((course) => (
                  <CourseCard key={course.id} {...course} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}

export default Courses;
