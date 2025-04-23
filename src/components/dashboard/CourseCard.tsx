
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { BookOpen, Clock } from "lucide-react";

interface CourseCardProps {
  id: string;
  title: string;
  description: string;
  image: string;
  progress: number;
  lessonsCount: number;
  category: string;
  duration: string;
}

export function CourseCard({
  id,
  title,
  description,
  image,
  progress,
  lessonsCount,
  category,
  duration
}: CourseCardProps) {
  return (
    <Link 
      to={`/courses/${id}`}
      className="group flex flex-col overflow-hidden rounded-lg border bg-card transition-all hover:shadow-md"
    >
      <div className="aspect-video w-full relative overflow-hidden bg-muted">
        <img
          src={image}
          alt={title}
          className="object-cover w-full h-full transition-transform group-hover:scale-105"
        />
        <Badge 
          variant="secondary" 
          className="absolute top-2 right-2"
        >
          {category}
        </Badge>
      </div>
      
      <div className="flex flex-col flex-1 p-4">
        <h3 className="font-semibold text-lg line-clamp-1">{title}</h3>
        <p className="text-muted-foreground line-clamp-2 text-sm mt-1 mb-4">{description}</p>
        
        <div className="flex items-center text-sm text-muted-foreground gap-4 mt-auto">
          <div className="flex items-center gap-1">
            <BookOpen size={14} />
            <span>{lessonsCount} lessons</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={14} />
            <span>{duration}</span>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>
    </Link>
  );
}

export default CourseCard;
