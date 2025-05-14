import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { Home } from "@/pages/Home";
import { Courses } from "@/pages/Courses";
import { ModuleDetail } from "@/pages/ModuleDetail";
import { UnitDetail } from "@/pages/UnitDetail";
import { LessonView } from "@/pages/LessonView";
import { Toaster } from "@/components/ui/toaster"
import { ImmersiveReaderView } from "./pages/ImmersiveReaderView";

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="ui-theme">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/module/:moduleId" element={<ModuleDetail />} />
          <Route path="/courses/module/:moduleId/unit/:unitId" element={<UnitDetail />} />
          <Route path="/courses/module/:moduleId/unit/:unitId/lesson/:lessonId" element={<LessonView />} />
          <Route path="/immersive-reader" element={<ImmersiveReaderView />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
