
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LessonCard } from "@/components/courses/LessonCard";
import { QuizCard } from "@/components/courses/QuizCard";
import { AssignmentCard } from "@/components/courses/AssignmentCard";
import { Button } from "@/components/ui/button";
import { 
  Book, 
  Video, 
  FileText, 
  GraduationCap, 
  MessageSquare,
  Download,
  Search
} from "lucide-react";
import { LessonData, QuizData, AssignmentData } from "@/types/unit";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

interface UnitContentProps {
  lessons: LessonData[];
  quizzes: QuizData[];
  assignments?: AssignmentData[];
  activeTab: string;
  onTabChange: (value: string) => void;
}

export function UnitContent({ lessons, quizzes, assignments = [], activeTab, onTabChange }: UnitContentProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllResources, setShowAllResources] = useState(false);
  const [selectedResourceType, setSelectedResourceType] = useState<string | null>(null);
  
  const filteredLessons = lessons.filter(lesson => 
    lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lesson.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Animation effect when switching tabs
  useEffect(() => {
    const contentItems = document.querySelectorAll(".content-item");
    contentItems.forEach((item, index) => {
      setTimeout(() => {
        item.classList.add("animate-fade-in");
        item.classList.remove("opacity-0");
      }, 100 * index);
    });
  }, [activeTab]);
  
  const handleDownload = (resourceName: string) => {
    toast.success(`Downloading ${resourceName}...`);
  };
  
  const renderResources = () => {
    const resources = [
      { type: 'document', name: 'Context API Documentation', icon: <Book className="h-5 w-5 mt-1 text-primary" /> },
      { type: 'video', name: 'Context API Patterns', icon: <Video className="h-5 w-5 mt-1 text-primary" /> },
      { type: 'pdf', name: 'Context API Cheat Sheet', icon: <FileText className="h-5 w-5 mt-1 text-primary" /> },
      { type: 'document', name: 'React Performance Optimization', icon: <Book className="h-5 w-5 mt-1 text-primary" /> },
      { type: 'video', name: 'Advanced Context Techniques', icon: <Video className="h-5 w-5 mt-1 text-primary" /> },
      { type: 'pdf', name: 'State Management Comparison', icon: <FileText className="h-5 w-5 mt-1 text-primary" /> }
    ];
    
    const filteredResources = selectedResourceType 
      ? resources.filter(r => r.type === selectedResourceType) 
      : resources;
      
    const displayResources = showAllResources ? filteredResources : filteredResources.slice(0, 3);
    
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Input 
              placeholder="Search resources..." 
              className="w-full max-w-xs"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              className={selectedResourceType === 'document' ? 'bg-primary/10' : ''}
              onClick={() => setSelectedResourceType(selectedResourceType === 'document' ? null : 'document')}
            >
              <Book size={16} className="mr-1" />
              Docs
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className={selectedResourceType === 'video' ? 'bg-primary/10' : ''}
              onClick={() => setSelectedResourceType(selectedResourceType === 'video' ? null : 'video')}
            >
              <Video size={16} className="mr-1" />
              Videos
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className={selectedResourceType === 'pdf' ? 'bg-primary/10' : ''}
              onClick={() => setSelectedResourceType(selectedResourceType === 'pdf' ? null : 'pdf')}
            >
              <FileText size={16} className="mr-1" />
              PDFs
            </Button>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          {displayResources.map((resource, index) => (
            <div 
              key={index} 
              className="content-item opacity-0 flex items-start gap-3 p-4 rounded-lg border bg-accent/20 hover:bg-accent/40 transition-all duration-300 hover:shadow-md"
            >
              {resource.icon}
              <div className="flex-1">
                <h3 className="text-base font-medium">{resource.name}</h3>
                <p className="text-sm text-muted-foreground mt-1 mb-2">
                  {resource.type === 'document' && 'Official documentation resource'}
                  {resource.type === 'video' && 'Video tutorial with examples'}
                  {resource.type === 'pdf' && 'Downloadable PDF guide'}
                </p>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => handleDownload(resource.name)}
                  className="flex items-center gap-1"
                >
                  {resource.type === 'document' && 'View Documentation'}
                  {resource.type === 'video' && 'Watch Video'}
                  {resource.type === 'pdf' && (
                    <>
                      <Download size={14} />
                      <span>Download PDF</span>
                    </>
                  )}
                </Button>
              </div>
              <Badge variant="outline" className="capitalize">{resource.type}</Badge>
            </div>
          ))}
        </div>
        
        {filteredResources.length > 3 && (
          <div className="flex justify-center mt-4">
            <Button variant="outline" onClick={() => setShowAllResources(!showAllResources)}>
              {showAllResources ? "Show Less" : "Show All Resources"}
            </Button>
          </div>
        )}
      </div>
    );
  };
  
  const renderDiscussions = () => {
    return (
      <div className="space-y-6">
        <Alert className="bg-primary/10 border-primary/30">
          <AlertTitle className="text-base">Join the discussion</AlertTitle>
          <AlertDescription>
            Ask questions, share insights, and connect with other students learning the same topics.
          </AlertDescription>
        </Alert>
        
        <div className="rounded-lg border p-4 mt-4">
          <div className="flex items-start gap-3 mb-4">
            <Avatar>
              <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330" />
              <AvatarFallback>SR</AvatarFallback>
            </Avatar>
            <div className="space-y-1 flex-1">
              <Input placeholder="Ask a question or share your thoughts..." className="w-full" />
              <div className="flex justify-end mt-2">
                <Button size="sm">Post</Button>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <Accordion type="single" collapsible>
              <AccordionItem value="discussion-1" className="border-b">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3 text-left">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">When should I use Context vs. Redux?</p>
                      <p className="text-sm text-muted-foreground">John Doe · 2 days ago</p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-2">
                  <div className="space-y-4">
                    <p>
                      I'm trying to understand when I should use Context API versus a state management library like Redux. Are there specific use cases for each?
                    </p>
                    
                    <div className="pl-10 pt-2 border-l-2 space-y-4">
                      <div className="flex items-start gap-3">
                        <Avatar className="w-6 h-6">
                          <AvatarImage src="https://images.unsplash.com/photo-1607746882042-944635dfe10e" />
                          <AvatarFallback>TS</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Taylor S.</span>
                            <span className="text-xs text-muted-foreground">instructor</span>
                          </div>
                          <p className="text-sm mt-1">
                            Great question! Context API is perfect for simpler applications where you need to share state across components. Redux is more suitable for complex state management, especially when you need middleware, time-travel debugging, or a more structured approach to state updates.
                          </p>
                          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                            <span>1 day ago</span>
                            <button className="hover:text-primary transition-colors duration-300">Reply</button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <Avatar className="w-6 h-6">
                          <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330" />
                          <AvatarFallback>SR</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Sarah R.</span>
                          </div>
                          <p className="text-sm mt-1">
                            I've found Context works well for theme settings, user authentication, and other app-wide settings that don't change often. When you have complex state or frequent updates, Redux might be better for performance.
                          </p>
                          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                            <span>12 hours ago</span>
                            <button className="hover:text-primary transition-colors duration-300">Reply</button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-2 flex items-start gap-3">
                      <Avatar className="w-6 h-6">
                        <AvatarFallback>Me</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <Input placeholder="Write a reply..." className="text-sm" />
                        <div className="flex justify-end mt-2">
                          <Button size="sm" variant="outline">Reply</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="discussion-2" className="border-b">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3 text-left">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde" />
                      <AvatarFallback>AM</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">Issue with multiple contexts</p>
                      <p className="text-sm text-muted-foreground">Alex M. · 3 days ago</p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <p>
                    I'm trying to use multiple contexts in my application but I'm running into some nesting issues. Has anyone figured out a clean pattern for organizing multiple contexts?
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          
          <div className="flex justify-center mt-6">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline">View All Discussions</Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="glass-card">
                <AlertDialogHeader>
                  <AlertDialogTitle>Join Course to Access Full Discussions</AlertDialogTitle>
                  <AlertDialogDescription>
                    Enrolling in this course will give you full access to the discussion forum, where you can interact with instructors and other students.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction>Enroll Now</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Tabs defaultValue={activeTab} className="w-full" onValueChange={onTabChange}>
      <TabsList className="mb-6 bg-background/95 backdrop-blur sticky top-16 z-20 rounded-lg p-1 border">
        <TabsTrigger value="lessons" className="flex items-center gap-1 data-[state=active]:bg-primary data-[state=active]:text-white transition-all duration-300">
          <FileText size={16} />
          <span>Lessons</span>
        </TabsTrigger>
        <TabsTrigger value="quizzes" className="flex items-center gap-1 data-[state=active]:bg-primary data-[state=active]:text-white transition-all duration-300">
          <GraduationCap size={16} />
          <span>Quizzes</span>
        </TabsTrigger>
        <TabsTrigger value="assignments" className="flex items-center gap-1 data-[state=active]:bg-primary data-[state=active]:text-white transition-all duration-300">
          <FileText size={16} />
          <span>Assignments</span>
        </TabsTrigger>
        <TabsTrigger value="resources" className="flex items-center gap-1 data-[state=active]:bg-primary data-[state=active]:text-white transition-all duration-300">
          <Book size={16} />
          <span>Resources</span>
        </TabsTrigger>
        <TabsTrigger value="discussion" className="flex items-center gap-1 data-[state=active]:bg-primary data-[state=active]:text-white transition-all duration-300">
          <MessageSquare size={16} />
          <span>Discussion</span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="lessons" className="mt-0">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">Unit Lessons</h2>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search lessons..."
                className="pl-8 w-[200px] rounded-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredLessons.map((lesson) => (
              <div key={lesson.id} className="content-item lesson-card opacity-0 transition-all duration-500 ease-in-out">
                <LessonCard lesson={lesson} />
              </div>
            ))}
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="quizzes" className="mt-0">
        <div className="space-y-6">
          <h2 className="text-xl font-semibold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">Unit Quizzes</h2>
          {quizzes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quizzes.map(quiz => (
                <div key={quiz.id} className="content-item opacity-0 transition-all duration-500 ease-in-out">
                  <QuizCard quiz={quiz} />
                </div>
              ))}
            </div>
          ) : (
            <div className="content-item opacity-0 text-center py-12 border rounded-lg bg-accent/10 transition-all duration-300 hover:bg-accent/20">
              <p className="text-muted-foreground">No quizzes available for this unit.</p>
            </div>
          )}
        </div>
      </TabsContent>

      <TabsContent value="assignments" className="mt-0">
        <div className="space-y-6">
          <h2 className="text-xl font-semibold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">Unit Assignments</h2>
          {assignments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {assignments.map(assignment => (
                <div key={assignment.id} className="content-item opacity-0 transition-all duration-500 ease-in-out">
                  <AssignmentCard key={assignment.id} assignment={assignment} />
                </div>
              ))}
            </div>
          ) : (
            <div className="content-item opacity-0 text-center py-12 border rounded-lg bg-accent/10 transition-all duration-300 hover:bg-accent/20">
              <p className="text-muted-foreground">No assignments available for this unit.</p>
            </div>
          )}
        </div>
      </TabsContent>

      <TabsContent value="resources" className="mt-0">
        <div className="prose max-w-none">
          <h2 className="text-xl font-semibold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent mb-4">Unit Resources</h2>
          <p className="mb-6 text-muted-foreground">Here are additional resources to help you through this unit:</p>
          
          <div className="mt-6 space-y-4 not-prose">
            {renderResources()}
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="discussion" className="mt-0">
        <div className="prose max-w-none">
          <h2 className="text-xl font-semibold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent mb-4">Discussion Forum</h2>
          {renderDiscussions()}
        </div>
      </TabsContent>
    </Tabs>
  );
}
