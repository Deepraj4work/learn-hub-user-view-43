
export type LessonType = "video" | "text";

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
}
