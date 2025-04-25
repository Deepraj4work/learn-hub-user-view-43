
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AssignmentData {
  id: string;
  moduleId: string;
  unitId: string;
  title: string;
  description: string;
  dueDate: string;
  status: "not-started" | "in-progress" | "submitted" | "graded";
  estimatedTime: string;
  score?: number;
  maxScore: number;
  fileCount: number;
}

interface AssignmentCardProps {
  assignment: AssignmentData;
  className?: string;
}

export function AssignmentCard({ assignment, className }: AssignmentCardProps) {
  // Check if assignment is due soon (within 2 days)
  const isDueSoon = () => {
    const dueDate = new Date(assignment.dueDate);
    const now = new Date();
    const diffTime = dueDate.getTime() - now.getTime();
    const diffDays = diffTime / (1000 * 3600 * 24);
    return diffDays <= 2 && diffDays > 0;
  };
  
  // Check if assignment is overdue
  const isOverdue = () => {
    const dueDate = new Date(assignment.dueDate);
    const now = new Date();
    return now > dueDate && assignment.status !== "submitted" && assignment.status !== "graded";
  };

  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all border-l-4",
        assignment.status === "graded" 
          ? (assignment.score && assignment.score >= (assignment.maxScore * 0.6) ? "border-l-green-500" : "border-l-red-500") 
          : assignment.status === "submitted" ? "border-l-blue-500" 
          : assignment.status === "in-progress" ? "border-l-amber-500" 
          : isOverdue() ? "border-l-red-500" : "border-l-gray-300",
        className
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">
            <span className="mr-2">{assignment.title}</span>
            {assignment.status === "graded" && (
              <Badge variant={assignment.score && assignment.score >= (assignment.maxScore * 0.6) ? "default" : "destructive"}>
                {assignment.score}/{assignment.maxScore}
              </Badge>
            )}
          </CardTitle>
          
          <Badge variant={
            assignment.status === "graded" 
              ? (assignment.score && assignment.score >= (assignment.maxScore * 0.6) ? "default" : "destructive") 
              : assignment.status === "submitted" ? "default" 
              : assignment.status === "in-progress" ? "outline" 
              : isOverdue() ? "destructive" : isDueSoon() ? "outline" : "secondary"
          }>
            {assignment.status === "graded" ? "Graded" 
              : assignment.status === "submitted" ? "Submitted" 
              : assignment.status === "in-progress" ? "In Progress" 
              : isOverdue() ? "Overdue" : isDueSoon() ? "Due Soon" : "Not Started"}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-2">
        <p className="text-sm text-muted-foreground">{assignment.description}</p>
        
        <div className="flex items-center flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar size={14} />
            <span>Due: {assignment.dueDate}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={14} />
            <span>{assignment.estimatedTime}</span>
          </div>
          <div className="flex items-center gap-1">
            <FileText size={14} />
            <span>{assignment.fileCount} Files</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-2">
        <Link to={`/courses/module/${assignment.moduleId}/unit/${assignment.unitId}/assignment/${assignment.id}`} className="w-full">
          <Button 
            variant={assignment.status === "graded" || assignment.status === "submitted" ? "outline" : "default"} 
            className="w-full"
          >
            {assignment.status === "graded" ? "View Feedback" 
              : assignment.status === "submitted" ? "View Submission" 
              : assignment.status === "in-progress" ? "Continue Assignment" 
              : "Start Assignment"}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

export default AssignmentCard;
