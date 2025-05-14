
import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { UnitHeader } from "@/components/courses/UnitHeader";
import { UnitContent } from "@/components/courses/UnitContent";
import { unitLessons, unitQuizzes, unitAssignments } from "@/data/unitData";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Bookmark, Share2, Award, BookOpen } from "lucide-react";
import { ImmersiveReader } from "@/components/courses/ImmersiveReader";

// Sample unit content for immersive reader
const unitContentForReader = `
<h1>Context API & useContext</h1>

<p>Managing global state with React Context and the useContext hook is an essential skill for modern React development. This unit covers all the fundamentals you need to understand context-based state management.</p>

<h2>What You'll Learn</h2>
<ul>
  <li>How to create and provide context in React applications</li>
  <li>When to use Context API vs other state management solutions</li>
  <li>Best practices for structuring your context providers</li>
  <li>Advanced patterns for optimizing context usage</li>
</ul>

<p>By the end of this unit, you'll be able to implement global state management solutions that are both efficient and maintainable.</p>
`;

export function UnitDetail() {
  const { moduleId, unitId } = useParams();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("lessons");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isImmersiveReaderOpen, setIsImmersiveReaderOpen] = useState(false);
  
  // Animation effect when component mounts
  useEffect(() => {
    // Header animation
    const header = document.querySelector(".unit-header");
    setTimeout(() => {
      header?.classList.add("animate-fade-in");
      header?.classList.remove("opacity-0");
    }, 100);
    
    // Content animation with staggered delay
    const lessonCards = document.querySelectorAll(".lesson-card");
    lessonCards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add("animate-fade-in");
        card.classList.remove("opacity-0");
      }, 200 + 100 * index);
    });
    
    // Add entrance animation to action buttons
    const actionButtons = document.querySelectorAll(".action-button");
    actionButtons.forEach((button, index) => {
      setTimeout(() => {
        button.classList.add("animate-fade-in");
        button.classList.remove("opacity-0");
      }, 500 + 100 * index);
    });
  }, []);
  
  // Calculate unit progress
  const totalItems = unitLessons.length + unitQuizzes.length + unitAssignments.length;
  const completedLessons = unitLessons.filter(lesson => lesson.completed).length;
  const completedQuizzes = unitQuizzes.filter(quiz => quiz.status === "completed").length;
  const completedAssignments = unitAssignments.filter(assignment => 
    assignment.status === "submitted" || assignment.status === "graded").length;
  const completedItems = completedLessons + completedQuizzes + completedAssignments;
  const unitProgress = Math.floor((completedItems / totalItems) * 100);

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast.success(isBookmarked ? "Unit removed from bookmarks" : "Unit added to bookmarks");
  };

  const handleShare = () => {
    // In a real app, this would use the Web Share API or copy to clipboard
    toast.success("Share link copied to clipboard");
  };

  const handleRequestCertificate = () => {
    // In a real app, this would send a request to the server
    toast.success("Certificate request submitted! You will receive an email when it's ready.");
  };
  
  const handleOpenImmersiveReader = () => {
    setIsImmersiveReaderOpen(true);
    toast.success("Immersive Reader activated");
  };

  return (
    <div className="flex flex-col min-h-screen bg-background transition-colors duration-300">
      <DashboardHeader />
      
      <main className="flex-1">
        <div className="container py-6 max-w-7xl">
          <UnitHeader
            moduleId={moduleId || ""}
            title="Context API & useContext"
            description="Managing global state with React Context and the useContext hook. Learn how to create, provide, and consume context in your React applications."
            lessonCount={unitLessons.length}
            assignmentCount={unitAssignments.length}
            quizCount={unitQuizzes.length}
            totalDuration="1h 45m"
            progress={unitProgress}
          />
          
          <div className="flex items-center justify-end gap-3 mb-6 opacity-0 action-button">
            <Button
              variant="outline"
              size="sm"
              onClick={handleOpenImmersiveReader}
              className="flex items-center gap-1 transition-all duration-300 hover:bg-primary/10"
            >
              <BookOpen size={16} />
              <span>Immersive Reader</span>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={toggleBookmark}
              className="flex items-center gap-1 transition-all duration-300 hover:bg-primary/10"
            >
              <Bookmark size={16} className={isBookmarked ? "fill-primary text-primary" : ""} />
              <span>{isBookmarked ? "Bookmarked" : "Bookmark"}</span>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="flex items-center gap-1 transition-all duration-300 hover:bg-primary/10"
            >
              <Share2 size={16} />
              <span>Share</span>
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="outline"
                  size="sm" 
                  className="flex items-center gap-1 transition-all duration-300 hover:bg-primary/10"
                  disabled={unitProgress < 100}
                >
                  <Award size={16} />
                  <span>Get Certificate</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="glass-card">
                <AlertDialogHeader>
                  <AlertDialogTitle>Request Unit Completion Certificate</AlertDialogTitle>
                  <AlertDialogDescription>
                    {unitProgress < 100 
                      ? "You need to complete 100% of the unit to request a certificate."
                      : "Congratulations on completing this unit! You can now request a certificate of completion."}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleRequestCertificate} disabled={unitProgress < 100}>
                    Request Certificate
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          
          <UnitContent
            lessons={unitLessons}
            quizzes={unitQuizzes}
            assignments={unitAssignments}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>
      </main>
      
      {/* Updated Immersive Reader Component */}
      <ImmersiveReader
        title="Context API & useContext"
        content={unitContentForReader}
        isOpen={isImmersiveReaderOpen}
        onClose={() => setIsImmersiveReaderOpen(false)}
        currentPath={location.pathname}
      />
    </div>
  );
}

export default UnitDetail;
