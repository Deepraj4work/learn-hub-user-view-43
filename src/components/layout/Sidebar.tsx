import React, { useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  Book, 
  BookOpen, 
  ChevronLeft, 
  ChevronRight, 
  LayoutDashboard, 
  Settings, 
  User,
  BookText,
  GraduationCap,
  BarChart,
  Users,
  MessageSquare
} from "lucide-react";

type SidebarItemProps = {
  icon: React.ElementType;
  label: string;
  href: string;
  active?: boolean;
  collapsed?: boolean;
};

const SidebarItem = ({ icon: Icon, label, href, active, collapsed }: SidebarItemProps) => (
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
);

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div 
      className={cn(
        "h-screen sticky top-0 flex flex-col border-r bg-background transition-all duration-300",
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
          active={location.pathname === "/"} 
          collapsed={collapsed} 
        />
        <SidebarItem 
          icon={Book} 
          label="My Courses" 
          href="/courses" 
          active={location.pathname === "/courses"} 
          collapsed={collapsed} 
        />
        <SidebarItem 
          icon={BookText} 
          label="Catalog" 
          href="/catalog" 
          active={location.pathname === "/catalog"} 
          collapsed={collapsed} 
        />
        <SidebarItem 
          icon={BarChart} 
          label="Progress" 
          href="/progress" 
          active={location.pathname === "/progress"} 
          collapsed={collapsed} 
        />
        <SidebarItem 
          icon={Users} 
          label="Groups" 
          href="/groups" 
          active={location.pathname.startsWith("/groups")} 
          collapsed={collapsed} 
        />
        <SidebarItem 
          icon={MessageSquare} 
          label="Messages" 
          href="/messages" 
          active={location.pathname === "/messages"} 
          collapsed={collapsed} 
        />
        
        <div className="mt-2 pt-2 border-t">
          <div className={cn("px-3 py-1.5 text-xs text-muted-foreground uppercase font-medium", 
            collapsed && "text-center"
          )}>
            {!collapsed && "Account"}
          </div>
          <SidebarItem icon={User} label="Profile" href="/profile" active={location.pathname === "/profile"} collapsed={collapsed} />
          <SidebarItem icon={Settings} label="Settings" href="/settings" active={location.pathname === "/settings"} collapsed={collapsed} />
        </div>
      </div>
      
      <div className="border-t p-3">
        <div className={cn(
          "flex items-center gap-3 rounded-lg p-2", 
          collapsed ? "justify-center" : ""
        )}>
          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary grid place-items-center">
            <User size={16} />
          </div>
          {!collapsed && (
            <div className="flex-1 overflow-hidden">
              <div className="font-medium truncate text-sm">Alex Johnson</div>
              <div className="text-xs text-muted-foreground">alex@example.com</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
