
import React from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Progress } from "@/components/ui/progress";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, BookOpen, Clock, GraduationCap, Trophy } from "lucide-react";

const progressData = [
  {
    courseTitle: "Complete React Developer in 2023",
    overallProgress: 62,
    lastAccessed: "2024-04-22",
    totalHours: "25",
    completedHours: "15.5"
  },
  {
    courseTitle: "Advanced JavaScript Concepts",
    overallProgress: 35,
    lastAccessed: "2024-04-21",
    totalHours: "18",
    completedHours: "6.3"
  },
  {
    courseTitle: "UI/UX Design Masterclass",
    overallProgress: 78,
    lastAccessed: "2024-04-23",
    totalHours: "22",
    completedHours: "17.2"
  }
];

export function ProgressPage() {
  const totalCourses = progressData.length;
  const completedCourses = progressData.filter(course => course.overallProgress === 100).length;
  const averageProgress = Math.round(
    progressData.reduce((acc, course) => acc + course.overallProgress, 0) / totalCourses
  );
  const totalLearningHours = progressData.reduce(
    (acc, course) => acc + parseFloat(course.completedHours), 
    0
  ).toFixed(1);

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader />
      
      <main className="flex-1">
        <div className="container py-6 max-w-7xl">
          <h1 className="text-2xl font-bold mb-6">Learning Progress</h1>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalCourses}</div>
                <p className="text-xs text-muted-foreground">In progress</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <Trophy className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{completedCourses}</div>
                <p className="text-xs text-muted-foreground">Courses finished</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Learning Hours</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalLearningHours}</div>
                <p className="text-xs text-muted-foreground">Total hours spent</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Average Progress</CardTitle>
                <BarChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{averageProgress}%</div>
                <p className="text-xs text-muted-foreground">Across all courses</p>
              </CardContent>
            </Card>
          </div>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Course Progress Details</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Course</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Last Accessed</TableHead>
                    <TableHead>Hours Completed</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {progressData.map((course) => (
                    <TableRow key={course.courseTitle}>
                      <TableCell className="font-medium">{course.courseTitle}</TableCell>
                      <TableCell>
                        <div className="w-[200px]">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-muted-foreground">{course.overallProgress}%</span>
                          </div>
                          <Progress value={course.overallProgress} className="h-2" />
                        </div>
                      </TableCell>
                      <TableCell>{new Date(course.lastAccessed).toLocaleDateString()}</TableCell>
                      <TableCell>{course.completedHours}/{course.totalHours} hours</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

export default ProgressPage;
