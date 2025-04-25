
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { UnitHeader } from "@/components/courses/UnitHeader";
import { UnitContent } from "@/components/courses/UnitContent";
import { unitLessons, unitQuizzes } from "@/data/unitData";

export function UnitDetail() {
  const { moduleId, unitId } = useParams();
  const [activeTab, setActiveTab] = useState("lessons");
  
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
  }, []);
  
  // Calculate unit progress
  const totalItems = unitLessons.length;
  const completedItems = unitLessons.filter(lesson => lesson.completed).length;
  const unitProgress = Math.floor((completedItems / totalItems) * 100);

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader />
      
      <main className="flex-1">
        <div className="container py-6 max-w-7xl">
          <UnitHeader
            moduleId={moduleId || ""}
            title="Context API & useContext"
            description="Managing global state with React Context and the useContext hook. Learn how to create, provide, and consume context in your React applications."
            lessonCount={6}
            totalDuration="1h 45m"
            progress={unitProgress}
          />
          
          <UnitContent
            lessons={unitLessons}
            quizzes={unitQuizzes}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>
      </main>
    </div>
  );
}

export default UnitDetail;
