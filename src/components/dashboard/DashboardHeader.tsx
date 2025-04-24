
import React from "react";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import ProfileDropdown from "./ProfileDropdown";
import NotificationCenter from "../layout/NotificationCenter";

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-30 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between space-x-4 max-w-7xl">
        <div className="flex-1 md:flex-initial">
          <form className="relative flex w-full md:w-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full md:w-[200px] lg:w-[300px] pl-8 bg-muted/50"
            />
          </form>
        </div>
        <div className="flex items-center space-x-2">
          <NotificationCenter />
          <ProfileDropdown />
        </div>
      </div>
    </header>
  );
}

export default DashboardHeader;
