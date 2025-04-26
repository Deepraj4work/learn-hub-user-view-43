
import React from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, BellDot, MessageCircle } from "lucide-react";
import ProfileDropdown from "./ProfileDropdown";
import NotificationCenter from "@/components/layout/NotificationCenter";
import ThemeSwitcher from "@/components/theme/ThemeSwitcher";

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-30 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container h-16 flex items-center gap-4">
        <Link to="/" className="hidden md:block">
          <h1 className="text-xl font-bold tracking-tighter bg-gradient-to-r from-primary to-purple-400 text-transparent bg-clip-text">
            EduBlend
          </h1>
        </Link>
        
        <div className="flex items-center gap-2 md:ml-auto">
          <div className="relative hidden md:flex w-full max-w-sm items-center">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search courses, topics..."
              className="pl-8 rounded-full bg-background"
            />
          </div>
          
          <Button size="icon" variant="ghost">
            <MessageCircle className="h-5 w-5" />
          </Button>

          <NotificationCenter trigger={
            <Button size="icon" variant="ghost" className="relative">
              <BellDot className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                3
              </Badge>
            </Button>
          } />
          
          <ThemeSwitcher />
          
          <ProfileDropdown />
        </div>
      </div>
    </header>
  );
}

export default DashboardHeader;
