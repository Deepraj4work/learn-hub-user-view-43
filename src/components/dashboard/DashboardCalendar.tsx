
import React from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";

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

const threedays = new Date(today);
threedays.setDate(threedays.getDate() + 3);

const calendarEvents: CalendarEvent[] = [
  {
    id: 1,
    title: "Mock Trial Competition",
    date: tomorrow,
    status: 'upcoming'
  },
  {
    id: 2,
    title: "Legal Research Workshop",
    date: today,
    status: 'ongoing'
  },
  {
    id: 3,
    title: "Bar Exam Study Group",
    date: nextWeek,
    status: 'upcoming'
  },
  {
    id: 4,
    title: "Contract Law Webinar",
    date: threedays,
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
    <Card className="border h-full shadow">
      <div className="p-4 flex items-center justify-between border-b">
        <div className="flex items-center gap-2">
          <CalendarIcon size={20} className="text-primary" />
          <h3 className="font-medium">Calendar</h3>
        </div>
        <Button variant="ghost" size="sm" className="text-xs h-8" asChild>
          <Link to="/calendar">View all</Link>
        </Button>
      </div>

      <div className="p-4 border-b">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="w-full border rounded-md"
          showOutsideDays={true}
        />
      </div>
      
      <div className="px-4 py-2">
        <div className="text-sm font-medium mb-2">
          {selectedDateEvents.length > 0 
            ? `Events for ${date?.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}` 
            : `No events for ${date?.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}`}
        </div>
      </div>
      
      <ScrollArea className="h-[120px] px-4 pb-4">
        <div className="space-y-2 pr-4">
          {selectedDateEvents.map(event => (
            <div key={event.id} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
              <span className="text-sm">{event.title}</span>
              <Badge className={getStatusColor(event.status)}>
                {event.status}
              </Badge>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}

export default DashboardCalendar;
