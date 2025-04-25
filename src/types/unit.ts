
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

export interface QuizData {
  id: string;
  moduleId: string;
  unitId: string;
  title: string;
  description: string;
  questionCount: number;
  duration: string;
  status: "not-started" | "in-progress" | "completed";
  passingScore: number;
  dueDate?: string;
  score?: number;
}

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
