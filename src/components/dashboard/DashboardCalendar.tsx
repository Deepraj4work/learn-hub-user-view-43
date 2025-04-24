
import React from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

interface CalendarEvent {
  id: number;
  title: string;
  date: Date;
  status: 'upcoming' | 'ongoing' | 'completed';
}

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);

const nextWeek = new Date(today);
nextWeek.setDate(nextWeek.getDate() + 7);

const calendarEvents: CalendarEvent[] = [
  {
    id: 1,
    title: "Project Submission",
    date: tomorrow,
    status: 'upcoming'
  },
  {
    id: 2,
    title: "Team Meeting",
    date: today,
    status: 'ongoing'
  },
  {
    id: 3,
    title: "Course Review",
    date: nextWeek,
    status: 'upcoming'
  }
];

export function DashboardCalendar() {
  const [date, setDate] = React.useState<Date | undefined>(today);
  
  // Get events for the selected date
  const selectedDateEvents = React.useMemo(() => {
    if (!date) return [];
    
    return calendarEvents.filter(event => 
      event.date.getDate() === date.getDate() &&
      event.date.getMonth() === date.getMonth() &&
      event.date.getFullYear() === date.getFullYear()
    );
  }, [date]);
  
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'upcoming': return 'bg-blue-100 text-blue-600 hover:bg-blue-200';
      case 'ongoing': return 'bg-green-100 text-green-600 hover:bg-green-200';
      case 'completed': return 'bg-gray-100 text-gray-600 hover:bg-gray-200';
      default: return 'bg-gray-100 text-gray-600 hover:bg-gray-200';
    }
  };

  return (
    <Card className="border h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarIcon size={20} className="text-primary" />
            Calendar
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/calendar">
              View full calendar
              <ChevronRight size={16} className="ml-1" />
            </Link>
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 pb-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="w-full border rounded-md"
        />
        
        <div className="mt-4">
          <div className="text-sm font-medium mb-2">
            {selectedDateEvents.length > 0 
              ? `Events for ${date?.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}` 
              : `No events for ${date?.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}`}
          </div>
          <div className="space-y-1">
            {selectedDateEvents.map(event => (
              <div key={event.id} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                <span>{event.title}</span>
                <Badge className={getStatusColor(event.status)}>
                  {event.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-3 pt-0">
      </CardFooter>
    </Card>
  );
}

export default DashboardCalendar;
