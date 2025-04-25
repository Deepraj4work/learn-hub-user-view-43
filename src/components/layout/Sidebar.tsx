
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
  VideoIcon,
  BadgeHelp,
  School
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type SidebarItemProps = {
  icon: React.ElementType;
  label: string;
  href: string;
  active?: boolean;
  collapsed?: boolean;
  dropdownItems?: Array<{
    label: string;
    href: string;
    icon?: React.ElementType;
  }>;
};

const SidebarItem = ({ icon: Icon, label, href, active, collapsed, dropdownItems }: SidebarItemProps) => {
  if (dropdownItems) {
    return (
      <DropdownMenu>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Link
                  to={href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-secondary text-foreground hover:text-foreground"
                  )}
                >
                  <Icon size={20} />
                  {!collapsed && <span>{label}</span>}
                </Link>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            {collapsed && <TooltipContent side="right">{label}</TooltipContent>}
          </Tooltip>
        </TooltipProvider>
        <DropdownMenuContent
          className="w-56 bg-popover p-2"
          side="right"
          align="start"
          alignOffset={-4}
        >
          {dropdownItems.map((item) => (
            <DropdownMenuItem key={item.label} asChild>
              <Link
                to={item.href}
                className="flex items-center gap-2 py-2 px-3 rounded-md hover:bg-accent"
              >
                {item.icon && <item.icon size={16} />}
                <span>{item.label}</span>
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
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
                : "hover:bg-secondary text-foreground hover:text-foreground"
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
          dropdownItems={[
            { label: "In Progress", href: "/courses?filter=in-progress", icon: VideoIcon },
            { label: "Completed", href: "/courses?filter=completed", icon: BookText },
            { label: "Saved", href: "/courses?filter=saved", icon: BookOpen },
            { label: "Course Settings", href: "/courses/settings", icon: Settings }
          ]}
        />

        <SidebarItem
          icon={BookText}
          label="Catalog"
          href="/catalog"
          active={isActive("/catalog")}
          collapsed={collapsed}
          dropdownItems={[
            { label: "Popular Courses", href: "/catalog?sort=popular", icon: School },
            { label: "New Arrivals", href: "/catalog?sort=new", icon: BookText },
            { label: "Categories", href: "/catalog/categories", icon: BookOpen },
            { label: "Help Center", href: "/help", icon: BadgeHelp }
          ]}
        />

        <SidebarItem
          icon={BarChart}
          label="Progress"
          href="/progress"
          active={isActive("/progress")}
          collapsed={collapsed}
        />

        <SidebarItem
          icon={Users}
          label="Groups"
          href="/groups"
          active={isActive("/groups")}
          collapsed={collapsed}
          dropdownItems={[
            { label: "My Groups", href: "/groups/my", icon: Users },
            { label: "Discover", href: "/groups/discover", icon: BookOpen },
            { label: "Create Group", href: "/groups/create", icon: Settings }
          ]}
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
