import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import CourseView from "./pages/CourseView";
import DashboardLayout from "./layouts/DashboardLayout";
import Progress from "./pages/Progress";
import Catalog from "./pages/Catalog";
import { Profile } from "./pages/Profile";
import Groups from "./pages/Groups";
import GroupLayout from "./layouts/GroupLayout";
import NewsPage from "./pages/group/NewsPage";
import CalendarPage from "./pages/group/CalendarPage";
import MembersPage from "./pages/group/MembersPage";
import AdminPage from "./pages/group/AdminPage";
import Messages from "./pages/Messages";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="courses" element={<Courses />} />
            <Route path="courses/:id" element={<CourseView />} />
            <Route path="catalog" element={<Catalog />} />
            <Route path="progress" element={<Progress />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Dashboard />} />
            <Route path="groups" element={<Groups />} />
            <Route path="messages" element={<Messages />} />
          </Route>
          
          <Route path="/groups/:groupId" element={<GroupLayout />}>
            <Route path="news" element={<NewsPage />} />
            <Route path="calendar" element={<CalendarPage />} />
            <Route path="members" element={<MembersPage />} />
            <Route path="admin" element={<AdminPage />} />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
