import { LessonData, QuizData } from "@/types/unit";

export const unitLessons: LessonData[] = [
  {
    id: "1",
    moduleId: "2",
    unitId: "3",
    title: "Introduction to Context API",
    description: "Learn about the React Context API and its use cases",
    type: "video",
    duration: "15:20",
    completed: true,
    locked: false,
    thumbnail: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=1000"
  },
  {
    id: "2",
    moduleId: "2",
    unitId: "3",
    title: "Creating a Context Provider",
    description: "Step-by-step guide to creating your first Context Provider",
    type: "video",
    duration: "12:45",
    completed: true,
    locked: false,
    thumbnail: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?q=80&w=1000"
  },
  {
    id: "3",
    moduleId: "2",
    unitId: "3",
    title: "Consuming Context with useContext",
    description: "How to use the useContext hook to access context values",
    type: "video",
    duration: "10:30",
    completed: false,
    locked: false,
    thumbnail: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=1000"
  },
  {
    id: "4",
    moduleId: "2",
    unitId: "3",
    title: "Context API Best Practices",
    description: "Learn the best practices for using Context API in your React applications",
    type: "text",
    duration: "8 min read",
    completed: false,
    locked: false
  },
  {
    id: "5",
    moduleId: "2",
    unitId: "3",
    title: "Context API vs Redux",
    description: "Comparing Context API with Redux for state management",
    type: "text",
    duration: "10 min read",
    completed: false,
    locked: true
  }
];

export const unitQuizzes: QuizData[] = [
  {
    id: "1",
    moduleId: "2",
    unitId: "3",
    title: "Context API Quiz",
    description: "Test your knowledge of React Context API",
    questionCount: 10,
    duration: "15 min",
    status: "not-started",
    passingScore: 70
  }
];
