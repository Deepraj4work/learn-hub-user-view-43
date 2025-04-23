
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function DashboardHeader() {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
      <div className="flex h-16 items-center gap-4 px-4 sm:px-6">
        <h1 className="text-lg font-semibold">Dashboard</h1>
        
        <div className="flex-1 flex justify-center ml-auto mr-5 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search courses..."
              className="w-full pl-8"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon">
            <Bell size={18} />
          </Button>
          
          <Avatar>
            <AvatarImage src="" />
            <AvatarFallback>AJ</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}

export default DashboardHeader;
