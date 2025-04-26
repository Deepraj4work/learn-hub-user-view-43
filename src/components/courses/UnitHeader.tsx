
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, FileText, Clock, BookOpen, FileCheck, GraduationCap, Share2 } from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
            <Button variant="ghost" size="sm" asChild className="group transition-all duration-300 hover:bg-primary/10">
              <Link to={`/courses/module/${moduleId}`}>
                <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform duration-300" />
                <span className="ml-1">Back to module</span>
              </Link>
            </Button>
            <Badge className="bg-primary/20 text-primary hover:bg-primary hover:text-white transition-colors duration-300">
              Context API
            </Badge>
          </div>

          <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">{title}</h1>
          <p className="text-muted-foreground mb-5 text-lg">{description}</p>
          
          <div className="flex flex-wrap gap-4 mb-6">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-accent/50 hover:bg-accent transition-colors duration-300">
                    <FileText size={18} className="text-primary" />
                    <span>{lessonCount} Lessons</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Total lessons in this unit</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {quizCount > 0 && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-accent/50 hover:bg-accent transition-colors duration-300">
                      <GraduationCap size={18} className="text-primary" />
                      <span>{quizCount} Quizzes</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Total quizzes to complete</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            
            {assignmentCount > 0 && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-accent/50 hover:bg-accent transition-colors duration-300">
                      <FileCheck size={18} className="text-primary" />
                      <span>{assignmentCount} Assignments</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Total assignments to submit</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-accent/50 hover:bg-accent transition-colors duration-300">
                    <Clock size={18} className="text-primary" />
                    <span>{totalDuration}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Estimated time to complete</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <div className="mt-6 mb-2">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Unit Progress</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-3 bg-accent" indicatorClassName="bg-gradient-to-r from-primary to-purple-400" />
          </div>
        </div>
        
        <div className="md:w-1/3 w-full flex items-center justify-center">
          <div className="glass-card p-8 rounded-xl text-center w-full transform hover:scale-105 transition-all duration-300">
            <div className="flex justify-center mb-4">
              <div className="bg-primary/20 p-4 rounded-full">
                <BookOpen size={32} className="text-primary" />
              </div>
            </div>
            <h3 className="font-semibold mb-1 text-lg">Unit 3 of 4</h3>
            <p className="text-muted-foreground mb-5">Module: React Hooks & State Management</p>
            <div className="space-y-3">
              <Button className="w-full bg-gradient-to-r from-primary to-purple-400 transition-all duration-300 hover:opacity-90">Continue Learning</Button>
              <Button variant="outline" size="icon" className="w-full flex items-center justify-center gap-2">
                <Share2 size={16} />
                <span>Share Unit</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
