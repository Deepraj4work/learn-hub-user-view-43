
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ChevronRight, BookOpen, Clock, Video, FileText, CheckCircle, Lock } from "lucide-react";
import { LessonType } from "@/types/unit";

interface LessonItem {
  id: string;
  title: string;
  duration: string;
  type: LessonType | "quiz" | "assignment";
  completed: boolean;
  locked: boolean;
}

interface UnitItem {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  progress: number;
  lessons: LessonItem[];
}

interface ModuleItem {
  id: string;
  title: string;
  description: string;
  progress: number;
  units: UnitItem[];
}

interface CourseStructureViewProps {
  courseId: string;
  modules: ModuleItem[];
}

export function CourseStructureView({ courseId, modules }: CourseStructureViewProps) {
  return (
    <div className="space-y-8 transition-all duration-300">
      {modules.map((module, moduleIndex) => (
        <div 
          key={module.id} 
          className="opacity-0 animate-fade-in"
          style={{ animationDelay: `${moduleIndex * 100}ms`, animationFillMode: 'forwards' }}
        >
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-semibold flex items-center">
              <span className="bg-primary/20 text-primary h-7 w-7 rounded-full inline-flex items-center justify-center mr-2">
                {moduleIndex + 1}
              </span>
              {module.title}
            </h2>
            <Badge variant={module.progress === 100 ? "default" : "outline"}>
              {module.progress}% Complete
            </Badge>
          </div>
          
          <p className="text-muted-foreground mb-4">{module.description}</p>
          
          <div className="space-y-4">
            {module.units.map((unit, unitIndex) => (
              <Card 
                key={unit.id} 
                className="overflow-hidden hover:shadow-md transition-all border-l-4"
                style={{ 
                  borderLeftColor: unit.progress === 100 
                    ? 'hsl(var(--primary))' 
                    : unit.progress > 0 
                      ? 'hsl(var(--primary) / 0.5)' 
                      : 'hsl(var(--border))' 
                }}
              >
                <CardContent className="p-0">
                  <div className="p-4 border-b">
                    <Link to={`/courses/module/${module.id}/unit/${unit.id}`}>
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium hover:text-primary transition-colors flex items-center">
                          <span className="text-sm text-muted-foreground mr-2">Unit {unitIndex + 1}</span>
                          {unit.title}
                        </h3>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </Link>
                    
                    <Progress value={unit.progress} className="h-1.5 mt-2" />
                    
                    <div className="flex items-center text-sm text-muted-foreground mt-2 gap-3">
                      <div className="flex items-center gap-1">
                        <BookOpen size={14} />
                        <span>{unit.lessons.length} Lessons</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>{unit.lessons.reduce((acc, lesson) => {
                          // Simple duration calculation - assumes format like "10:30" or "5 min read"
                          const num = parseInt(lesson.duration.split(":")[0] || lesson.duration.split(" ")[0]);
                          return acc + (num || 0);
                        }, 0)} min</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="max-h-0 overflow-hidden transition-all duration-300 hover:max-h-96 bg-accent/20">
                    <div className="p-4 space-y-2">
                      {unit.lessons.map((lesson, idx) => (
                        <Link 
                          key={lesson.id}
                          to={`/courses/module/${module.id}/unit/${unit.id}/lesson/${lesson.id}`}
                          className={`flex items-center justify-between p-2 rounded-md transition-colors ${
                            lesson.locked ? 'opacity-60 cursor-not-allowed' : 'hover:bg-accent'
                          }`}
                          onClick={e => lesson.locked && e.preventDefault()}
                        >
                          <div className="flex items-center gap-3">
                            {lesson.completed ? (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : lesson.locked ? (
                              <Lock className="h-5 w-5 text-muted-foreground" />
                            ) : lesson.type === 'video' ? (
                              <Video className="h-5 w-5 text-primary" />
                            ) : (
                              <FileText className="h-5 w-5 text-primary" />
                            )}
                            <span className={lesson.completed ? "text-muted-foreground line-through" : ""}>
                              {idx + 1}. {lesson.title}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">{lesson.duration}</span>
                            {!lesson.locked && !lesson.completed && (
                              <Button variant="ghost" size="sm">
                                Start
                              </Button>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default CourseStructureView;
