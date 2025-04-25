
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, FileText, Play, Video, FileImage, BookText } from "lucide-react";
import { cn } from "@/lib/utils";

export type LessonType = "video" | "text" | "pdf" | "presentation" | "image";

export interface LessonData {
  id: string;
  moduleId: string;
  unitId: string;
  title: string;
  description: string;
  type: LessonType;
  duration: string;
  completed: boolean;
  locked: boolean;
  thumbnail?: string;
}

interface LessonCardProps {
  lesson: LessonData;
  className?: string;
}

export function LessonCard({ lesson, className }: LessonCardProps) {
  const getLessonIcon = () => {
    switch (lesson.type) {
      case "video":
        return <Video size={16} />;
      case "pdf":
        return <FileText size={16} />;
      case "presentation":
        return <FileText size={16} />;
      case "image":
        return <FileImage size={16} />;
      case "text":
      default:
        return <BookText size={16} />;
    }
  };
  
  const getLessonTypeLabel = () => {
    switch (lesson.type) {
      case "video":
        return "Video";
      case "pdf":
        return "PDF Document";
      case "presentation":
        return "Presentation";
      case "image":
        return "Image Gallery";
      case "text":
      default:
        return "Article";
    }
  };

  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all hover:shadow-md",
        lesson.completed ? "border-l-4 border-l-green-500" : lesson.locked ? "border-l-4 border-l-gray-300 opacity-80" : "",
        className
      )}
    >
      {lesson.thumbnail && !lesson.locked && (
        <div className="aspect-video relative overflow-hidden">
          <img 
            src={lesson.thumbnail} 
            alt={lesson.title}
            className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
          />
          {lesson.type === "video" && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity">
              <div className="bg-white rounded-full p-3">
                <Play size={24} className="text-primary ml-1" />
              </div>
            </div>
          )}
          <Badge 
            className="absolute top-2 right-2 bg-black/70"
            variant="secondary"
          >
            {getLessonTypeLabel()}
          </Badge>
        </div>
      )}
      
      <CardHeader className={lesson.thumbnail ? "pb-2" : "pb-3"}>
        <div className="flex justify-between items-center">
          <CardTitle className={cn("flex items-center gap-2", lesson.completed ? "text-muted-foreground line-through" : "")}>
            {getLessonIcon()}
            <span className="text-lg">{lesson.title}</span>
          </CardTitle>
          
          <Badge variant={lesson.completed ? "default" : lesson.locked ? "outline" : "secondary"}>
            {lesson.completed ? "Completed" : lesson.locked ? "Locked" : getLessonTypeLabel()}
          </Badge>
        </div>
      </CardHeader>
      
      {!lesson.locked && (
        <CardContent className="space-y-2">
          <p className="text-sm text-muted-foreground">{lesson.description}</p>
          
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock size={14} />
              <span>{lesson.duration}</span>
            </div>
          </div>
        </CardContent>
      )}
      
      <CardFooter className="pt-2 pb-3">
        {!lesson.locked ? (
          <Link 
            to={`/courses/module/${lesson.moduleId}/unit/${lesson.unitId}/lesson/${lesson.id}`}
            className="w-full"
          >
            <Button 
              variant={lesson.completed ? "outline" : "default"} 
              className="w-full gap-2"
            >
              {lesson.completed ? (
                "Review Lesson"
              ) : (
                <>
                  <Play size={14} />
                  Start Lesson
                </>
              )}
            </Button>
          </Link>
        ) : (
          <Button 
            variant="outline" 
            className="w-full cursor-not-allowed" 
            disabled
          >
            Locked
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default LessonCard;
