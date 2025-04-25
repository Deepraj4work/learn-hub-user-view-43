
import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, Clock, AlertTriangle } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

// Dummy quiz questions
const quizQuestions = [
  {
    id: "q1",
    question: "What problem does the Context API solve?",
    options: [
      { id: "q1-a", text: "Making API requests more efficient" },
      { id: "q1-b", text: "Avoiding prop drilling through intermediate components" },
      { id: "q1-c", text: "Styling React components" },
      { id: "q1-d", text: "Managing side effects in components" }
    ],
    correctAnswer: "q1-b"
  },
  {
    id: "q2",
    question: "Which function is used to create a context?",
    options: [
      { id: "q2-a", text: "makeContext()" },
      { id: "q2-b", text: "newContext()" },
      { id: "q2-c", text: "createContext()" },
      { id: "q2-d", text: "generateContext()" }
    ],
    correctAnswer: "q2-c"
  },
  {
    id: "q3",
    question: "Which component is provided by the Context object to make values available to nested components?",
    options: [
      { id: "q3-a", text: "Context.Consumer" },
      { id: "q3-b", text: "Context.Provider" },
      { id: "q3-c", text: "Context.Supplier" },
      { id: "q3-d", text: "Context.Distributor" }
    ],
    correctAnswer: "q3-b"
  }
];

export function QuizView() {
  const { moduleId, unitId, quizId } = useParams();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  
  const totalQuestions = quizQuestions.length;
  const progressPercentage = ((currentQuestion + 1) / totalQuestions) * 100;
  
  const handleAnswerSelect = (questionId: string, answerId: string) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: answerId
    });
  };
  
  const handleNextQuestion = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };
  
  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };
  
  const handleSubmitQuiz = () => {
    setIsSubmitting(true);
    
    // Calculate score
    const correctAnswers = quizQuestions.filter(q => 
      selectedAnswers[q.id] === q.correctAnswer
    ).length;
    
    const calculatedScore = Math.round((correctAnswers / totalQuestions) * 100);
    
    // Simulate API request
    setTimeout(() => {
      setScore(calculatedScore);
      setQuizCompleted(true);
      setIsSubmitting(false);
    }, 1500);
  };
  
  // Check if all questions are answered
  const allQuestionsAnswered = quizQuestions.every(q => selectedAnswers[q.id]);
  
  // Current question data
  const currentQuestionData = quizQuestions[currentQuestion];

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader />
      
      <main className="flex-1 bg-muted/30">
        <div className="container py-6 max-w-3xl">
          <div className="flex items-center justify-between mb-6">
            <Button variant="ghost" size="sm" asChild>
              <Link to={`/courses/module/${moduleId}/unit/${unitId}`}>
                <ChevronLeft size={16} />
                Back to unit
              </Link>
            </Button>
            
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span className="text-sm">Time remaining: 18:45</span>
            </div>
          </div>
          
          {!quizCompleted ? (
            <>
              <div className="mb-6">
                <h1 className="text-2xl font-bold mb-2">Context API Quiz</h1>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Question {currentQuestion + 1} of {totalQuestions}</span>
                  <span className="font-medium">{Math.round(progressPercentage)}%</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </div>
              
              <Card className="mb-6 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl">
                    {currentQuestionData.question}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={selectedAnswers[currentQuestionData.id]}
                    onValueChange={(value) => handleAnswerSelect(currentQuestionData.id, value)}
                  >
                    {currentQuestionData.options.map((option) => (
                      <div key={option.id} className="flex items-center space-x-2 py-2">
                        <RadioGroupItem value={option.id} id={option.id} />
                        <Label htmlFor={option.id} className="cursor-pointer w-full">
                          {option.text}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={handlePreviousQuestion}
                    disabled={currentQuestion === 0}
                  >
                    <ChevronLeft size={16} className="mr-2" />
                    Previous
                  </Button>
                  
                  {currentQuestion < totalQuestions - 1 ? (
                    <Button
                      onClick={handleNextQuestion}
                      disabled={!selectedAnswers[currentQuestionData.id]}
                    >
                      Next
                      <ChevronRight size={16} className="ml-2" />
                    </Button>
                  ) : (
                    <Button 
                      onClick={handleSubmitQuiz} 
                      disabled={!allQuestionsAnswered || isSubmitting}
                    >
                      {isSubmitting ? "Submitting..." : "Submit Quiz"}
                    </Button>
                  )}
                </CardFooter>
              </Card>
              
              {!allQuestionsAnswered && (
                <div className="bg-amber-50 border border-amber-200 rounded-md p-4 flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-amber-800">Some questions are unanswered</p>
                    <p className="text-sm text-amber-700">
                      Please answer all questions before submitting the quiz.
                    </p>
                  </div>
                </div>
              )}
            </>
          ) : (
            <Card className="overflow-hidden shadow-sm">
              <div className={`h-2 ${score >= 70 ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <CardHeader>
                <CardTitle className="text-2xl flex justify-between items-center">
                  <span>Quiz Results</span>
                  <Badge variant={score >= 70 ? "default" : "destructive"}>
                    {score}%
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="py-6 px-4 rounded-lg bg-muted text-center">
                  <h3 className="text-xl font-bold mb-2">
                    {score >= 70 ? 'Congratulations! 🎉' : 'Keep Learning! 📚'}
                  </h3>
                  <p className="text-muted-foreground">
                    {score >= 70 
                      ? 'You have passed this quiz and demonstrated your understanding of Context API.' 
                      : 'You did not pass this time. Review the material and try again.'}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Quiz Summary</h4>
                  <div className="flex items-center justify-between text-sm border-b pb-2">
                    <span>Total Questions</span>
                    <span>{totalQuestions}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm border-b pb-2">
                    <span>Correct Answers</span>
                    <span>{Math.round((score / 100) * totalQuestions)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm border-b pb-2">
                    <span>Score</span>
                    <span className="font-medium">{score}%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Pass Threshold</span>
                    <span>70%</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row gap-3">
                <Button variant="outline" asChild className="w-full sm:w-auto">
                  <Link to={`/courses/module/${moduleId}/unit/${unitId}`}>
                    Return to Unit
                  </Link>
                </Button>
                {score < 70 && (
                  <Button asChild className="w-full sm:w-auto">
                    <Link to="#">Retake Quiz</Link>
                  </Button>
                )}
                {score >= 70 && (
                  <Button asChild className="w-full sm:w-auto">
                    <Link to={`/courses/module/${moduleId}`}>
                      Continue to Next Unit
                    </Link>
                  </Button>
                )}
              </CardFooter>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}

export default QuizView;
