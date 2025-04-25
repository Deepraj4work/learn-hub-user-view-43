
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import ProfileDropdown from "./ProfileDropdown";
import NotificationCenter from "../layout/NotificationCenter";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Mock user data - In a real app, this would come from an API
const mockUsers = [
  {
    id: "1",
    name: "Sarah Wilson",
    email: "sarah.w@example.com",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&h=50&fit=crop",
    role: "Student"
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "m.chen@example.com",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=50&h=50&fit=crop",
    role: "Instructor"
  },
  {
    id: "3",
    name: "Alex Johnson",
    email: "alex.j@example.com",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop",
    role: "Student"
  }
];

export function DashboardHeader() {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="sticky top-0 z-30 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between space-x-4 max-w-7xl">
        <div className="flex-1 md:flex-initial">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <div className="relative flex w-full md:w-auto">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search users..."
                  className="w-full md:w-[300px] pl-8 bg-muted/50"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-[300px]" align="start">
              <Command>
                <CommandInput placeholder="Search users..." />
                <CommandList>
                  <CommandEmpty>No users found.</CommandEmpty>
                  <CommandGroup heading="Suggestions">
                    {mockUsers.map((user) => (
                      <CommandItem
                        key={user.id}
                        className="flex items-center gap-2 p-2 cursor-pointer"
                        onSelect={() => {
                          setOpen(false);
                          // Handle user selection
                        }}
                      >
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div className="flex flex-col">
                          <span className="font-medium text-sm">{user.name}</span>
                          <span className="text-xs text-muted-foreground">{user.role}</span>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
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
