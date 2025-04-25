
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LessonCard } from "@/components/courses/LessonCard";
import { QuizCard } from "@/components/courses/QuizCard";
import { AssignmentCard } from "@/components/courses/AssignmentCard";
import { Button } from "@/components/ui/button";
import { Book, Video, FileText, GraduationCap } from "lucide-react";
import { LessonData, QuizData, AssignmentData } from "@/types/unit";

interface UnitContentProps {
  lessons: LessonData[];
  quizzes: QuizData[];
  assignments?: AssignmentData[];
  activeTab: string;
  onTabChange: (value: string) => void;
}

export function UnitContent({ lessons, quizzes, assignments = [], activeTab, onTabChange }: UnitContentProps) {
  return (
    <Tabs defaultValue={activeTab} className="w-full" onValueChange={onTabChange}>
      <TabsList className="mb-6">
        <TabsTrigger value="lessons">Lessons</TabsTrigger>
        <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
        <TabsTrigger value="assignments">Assignments</TabsTrigger>
        <TabsTrigger value="resources">Resources</TabsTrigger>
        <TabsTrigger value="discussion">Discussion</TabsTrigger>
      </TabsList>
      
      <TabsContent value="lessons" className="mt-0">
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Unit Lessons</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lessons.map((lesson) => (
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
          {quizzes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quizzes.map(quiz => (
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

      <TabsContent value="assignments" className="mt-0">
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Unit Assignments</h2>
          {assignments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {assignments.map(assignment => (
                <AssignmentCard key={assignment.id} assignment={assignment} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border rounded-lg bg-accent/10">
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
              <FileText className="h-5 w-5 mt-1 text-primary" />
              <div>
                <h3 className="text-base font-medium m-0">Context API Cheat Sheet</h3>
                <p className="text-sm text-muted-foreground mt-1 mb-2">
                  Downloadable quick reference guide
                </p>
                <Button size="sm" variant="outline">Download PDF</Button>
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
  );
}
