
import React from "react";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from "@/components/ui/toaster";

import DashboardLayout from "@/layouts/DashboardLayout";
import { Dashboard } from "@/pages/Dashboard";
import { Courses } from "@/pages/Courses";
import { ModulesList } from "@/pages/ModulesList";
import { ModuleDetail } from "@/pages/ModuleDetail";
import { UnitDetail } from "@/pages/UnitDetail";
import { LessonView } from "@/pages/LessonView";
import { QuizView } from "@/pages/QuizView";
import { Groups } from "@/pages/Groups";
import Catalog from "@/pages/Catalog";
import Progress from "@/pages/Progress";
import Messages from "@/pages/Messages";
import { Profile } from "@/pages/Profile";
import NotFound from "@/pages/NotFound";
import CourseView from "@/pages/CourseView";
import GroupLayout from "@/layouts/GroupLayout";
import NewsPage from "@/pages/group/NewsPage";
import CalendarPage from "@/pages/group/CalendarPage";
import MembersPage from "@/pages/group/MembersPage";
import AdminPage from "@/pages/group/AdminPage";

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="ui-theme">
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="courses" element={<Courses />} />
          <Route path="courses/:courseId" element={<CourseView />} />
          <Route path="courses/modules" element={<ModulesList />} />
          <Route path="courses/module/:moduleId" element={<ModuleDetail />} />
          <Route path="courses/module/:moduleId/unit/:unitId" element={<UnitDetail />} />
          <Route path="courses/module/:moduleId/unit/:unitId/lesson/:lessonId" element={<LessonView />} />
          <Route path="courses/module/:moduleId/unit/:unitId/quiz/:quizId" element={<QuizView />} />
          <Route path="groups" element={<Groups />} />
          <Route path="groups/:groupId/*" element={<GroupLayout />}>
            <Route path="news" element={<NewsPage />} />
            <Route path="calendar" element={<CalendarPage />} />
            <Route path="members" element={<MembersPage />} />
            <Route path="admin" element={<AdminPage />} />
            <Route path="*" element={<NewsPage />} />
          </Route>
          <Route path="catalog" element={<Catalog />} />
          <Route path="progress" element={<Progress />} />
          <Route path="messages" element={<Messages />} />
          <Route path="profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
