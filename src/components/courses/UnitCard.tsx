
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { File, FileText, Video } from "lucide-react";

export interface UnitData {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  progress: number;
  lessonCount: number;
  quizCount: number;
  assignmentCount: number;
  duration: string;
  videoCount: number;
  textCount: number;
}

interface UnitCardProps {
  unit: UnitData;
  className?: string;
}

export function UnitCard({ unit, className }: UnitCardProps) {
  return (
    <Link to={`/courses/module/${unit.moduleId}/unit/${unit.id}`}>
      <Card 
        className={cn(
          "overflow-hidden transition-all hover:shadow-md hover:-translate-y-1 duration-300 border-l-4",
          unit.progress === 100 ? "border-l-green-500" : unit.progress > 0 ? "border-l-blue-500" : "border-l-gray-300",
          className
        )}
      >
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">{unit.title}</CardTitle>
            <Badge variant={unit.progress === 100 ? "default" : "outline"}>
              {unit.progress}%
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground line-clamp-2">{unit.description}</p>
          
          <Progress value={unit.progress} className="h-1.5" />
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-muted-foreground">
                <FileText size={14} />
                {unit.lessonCount} Lessons
              </span>
              {unit.quizCount > 0 && (
                <span className="flex items-center gap-1 text-muted-foreground">
                  <File size={14} />
                  {unit.quizCount} Quiz
                </span>
              )}
              {unit.assignmentCount > 0 && (
                <span className="flex items-center gap-1 text-muted-foreground">
                  <File size={14} />
                  {unit.assignmentCount} Assignment
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="flex items-center gap-1">
                <Video size={14} />
                {unit.videoCount}
              </span>
              <span className="flex items-center gap-1">
                <FileText size={14} />
                {unit.textCount}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default UnitCard;
