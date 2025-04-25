
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, FileText, Clock, BookOpen, FileCheck, GraduationCap } from "lucide-react";

interface UnitHeaderProps {
  moduleId: string;
  title: string;
  description: string;
  lessonCount: number;
  quizCount?: number;
  assignmentCount?: number;
  totalDuration: string;
  progress: number;
}

export function UnitHeader({ 
  moduleId, 
  title, 
  description, 
  lessonCount, 
  quizCount = 0,
  assignmentCount = 0,
  totalDuration, 
  progress 
}: UnitHeaderProps) {
  return (
    <div className="unit-header opacity-0 transition-all duration-500 ease-in-out">
      <div className="flex md:flex-row flex-col gap-6 mb-8">
        <div className="md:w-2/3 w-full">
          <div className="flex items-center gap-2 mb-6">
            <Button variant="ghost" size="sm" asChild>
              <Link to={`/courses/module/${moduleId}`}>
                <ChevronLeft size={16} />
                Back to module
              </Link>
            </Button>
            <Badge>Context API</Badge>
          </div>

          <h1 className="text-2xl font-bold mb-2">{title}</h1>
          <p className="text-muted-foreground mb-4">{description}</p>
          
          <div className="flex items-center flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-1">
              <FileText size={16} />
              <span>{lessonCount} Lessons</span>
            </div>
            {quizCount > 0 && (
              <div className="flex items-center gap-1">
                <GraduationCap size={16} />
                <span>{quizCount} Quizzes</span>
              </div>
            )}
            {assignmentCount > 0 && (
              <div className="flex items-center gap-1">
                <FileCheck size={16} />
                <span>{assignmentCount} Assignments</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Clock size={16} />
              <span>{totalDuration}</span>
            </div>
          </div>
          
          <div className="mt-4 mb-2">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Unit Progress</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
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
  );
}
