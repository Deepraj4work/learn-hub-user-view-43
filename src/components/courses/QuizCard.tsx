
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, FileText, Play } from "lucide-react";
import { cn } from "@/lib/utils";

export interface QuizData {
  id: string;
  moduleId: string;
  unitId: string;
  title: string;
  description: string;
  questionCount: number;
  duration: string;
  status: "not-started" | "in-progress" | "completed";
  dueDate?: string;
  score?: number;
  passingScore: number;
}

interface QuizCardProps {
  quiz: QuizData;
  className?: string;
}

export function QuizCard({ quiz, className }: QuizCardProps) {
  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all border-l-4",
        quiz.status === "completed" 
          ? (quiz.score && quiz.score >= quiz.passingScore ? "border-l-green-500" : "border-l-red-500") 
          : quiz.status === "in-progress" ? "border-l-amber-500" : "border-l-gray-300",
        className
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">
            <span className="mr-2">{quiz.title}</span>
            {quiz.status === "completed" && (
              <Badge variant={quiz.score && quiz.score >= quiz.passingScore ? "default" : "destructive"}>
                {quiz.score}%
              </Badge>
            )}
          </CardTitle>
          
          <Badge variant={
            quiz.status === "completed" 
              ? (quiz.score && quiz.score >= quiz.passingScore ? "default" : "destructive") 
              : quiz.status === "in-progress" ? "outline" : "secondary"
          }>
            {quiz.status === "completed" 
              ? (quiz.score && quiz.score >= quiz.passingScore ? "Passed" : "Failed") 
              : quiz.status === "in-progress" ? "In Progress" : "Not Started"}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-2">
        <p className="text-sm text-muted-foreground">{quiz.description}</p>
        
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <FileText size={14} />
            <span>{quiz.questionCount} Questions</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={14} />
            <span>{quiz.duration}</span>
          </div>
        </div>
        
        {quiz.dueDate && (
          <div className="text-sm text-muted-foreground">
            Due: {quiz.dueDate}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-2">
        <Link to={`/courses/module/${quiz.moduleId}/unit/${quiz.unitId}/quiz/${quiz.id}`} className="w-full">
          <Button 
            variant={quiz.status === "completed" ? "outline" : "default"} 
            className="w-full gap-2"
          >
            {quiz.status === "completed" ? "Review Quiz" : (
              <>
                <Play size={14} />
                {quiz.status === "in-progress" ? "Continue Quiz" : "Start Quiz"}
              </>
            )}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

export default QuizCard;
