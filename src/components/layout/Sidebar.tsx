import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Book,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  User,
  BookText,
  BarChart,
  Users,
  MessageSquare,
  Settings,
} from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// Dummy data for dropdown content
const userGroups = [
  { id: 1, name: "Web Development", members: 24 },
  { id: 2, name: "Data Science", members: 18 },
  { id: 3, name: "Mobile App Development", members: 15 },
];

const userCourses = [
  { id: 1, name: "React Fundamentals", progress: "75%" },
  { id: 2, name: "TypeScript Basics", progress: "45%" },
  { id: 3, name: "Node.js Essentials", progress: "30%" },
];

const catalogItems = [
  { id: 1, name: "Frontend Development", count: 15 },
  { id: 2, name: "Backend Development", count: 12 },
  { id: 3, name: "DevOps", count: 8 },
];

type SidebarItemProps = {
  icon: React.ElementType;
  label: string;
  href: string;
  active?: boolean;
  collapsed?: boolean;
  dropdownContent?: {
    items: any[];
    viewAllLink: string;
  };
};

const SidebarItem = ({ icon: Icon, label, href, active, collapsed, dropdownContent }: SidebarItemProps) => {
  if (dropdownContent) {
    return (
      <Link
        to={href}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
          active
            ? "bg-primary text-primary-foreground"
            : "text-foreground"
        )}
      >
        <Icon size={20} />
        {!collapsed && <span>{label}</span>}
      </Link>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            to={href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
              active
                ? "bg-primary text-primary-foreground"
                : "text-foreground"
            )}
          >
            <Icon size={20} />
            {!collapsed && <span>{label}</span>}
          </Link>
        </TooltipTrigger>
        {collapsed && <TooltipContent side="right">{label}</TooltipContent>}
      </Tooltip>
    </TooltipProvider>
  );
};

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  return (
    <div
      className={cn(
        "h-screen sticky top-0 flex flex-col border-r bg-background transition-all duration-300 z-20",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center justify-between border-b p-4">
        {!collapsed && (
          <div className="font-bold text-xl flex items-center gap-2">
            <BookOpen size={24} />
            <span>Creditor Academy</span>
          </div>
        )}
        {collapsed && <BookOpen size={24} className="mx-auto" />}

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>

      <div className="flex-1 overflow-auto p-3 flex flex-col gap-1">
        <SidebarItem
          icon={LayoutDashboard}
          label="Dashboard"
          href="/"
          active={isActive("/")}
          collapsed={collapsed}
        />
        
        <SidebarItem
          icon={Book}
          label="My Courses"
          href="/courses"
          active={isActive("/courses")}
          collapsed={collapsed}
        />

        <SidebarItem
          icon={Users}
          label="Groups"
          href="/groups"
          active={isActive("/groups")}
          collapsed={collapsed}
        />

        <SidebarItem
          icon={BookText}
          label="Catalog"
          href="/catalog"
          active={isActive("/catalog")}
          collapsed={collapsed}
        />

        <SidebarItem
          icon={BarChart}
          label="Progress"
          href="/progress"
          active={isActive("/progress")}
          collapsed={collapsed}
        />

        <SidebarItem
          icon={MessageSquare}
          label="Messages"
          href="/messages"
          active={isActive("/messages")}
          collapsed={collapsed}
        />
      </div>

      <div className="border-t p-3">
        <button
          onClick={handleProfileClick}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg p-2 hover:bg-secondary transition-colors",
            isActive("/profile") ? "bg-primary/10" : "",
            collapsed ? "justify-center" : ""
          )}
        >
          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary grid place-items-center">
            <User size={16} />
          </div>
          {!collapsed && (
            <div className="flex-1 overflow-hidden">
              <div className="font-medium truncate text-sm">Alex Johnson</div>
              <div className="text-xs text-muted-foreground">alex@example.com</div>
            </div>
          )}
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
