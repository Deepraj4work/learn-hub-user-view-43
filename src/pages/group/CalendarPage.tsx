
import React, { useState } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CalendarDays, Clock, MapPin, CalendarPlus } from "lucide-react";
import { toast } from "sonner";

interface Event {
  id: number;
  title: string;
  description: string;
  date: Date;
  time: string;
  location: string;
}

// Sample events data
const initialEvents: Event[] = [
  {
    id: 1,
    title: "Web Dev Workshop",
    description: "Introduction to React hooks and state management",
    date: new Date(2025, 3, 25), // April 25, 2025
    time: "14:00 - 16:00",
    location: "Virtual Meeting Room 1"
  },
  {
    id: 2,
    title: "Group Project Kickoff",
    description: "Discuss our upcoming group project and assign roles",
    date: new Date(2025, 3, 28), // April 28, 2025
    time: "10:00 - 11:30",
    location: "Main Campus, Building B, Room 203"
  }
];

export function CalendarPage() {
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Form state for new event
  const [newEvent, setNewEvent] = useState<{
    title: string;
    description: string;
    date: Date | undefined;
    time: string;
    location: string;
  }>({
    title: "",
    description: "",
    date: new Date(),
    time: "",
    location: ""
  });
  
  // Get events for selected date
  const selectedDateEvents = events.filter(event => 
    date && event.date.toDateString() === date.toDateString()
  );
  
  // Add a new event
  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.date || !newEvent.time) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    const event: Event = {
      id: Date.now(),
      ...newEvent,
      date: newEvent.date as Date
    };
    
    setEvents([...events, event]);
    setIsDialogOpen(false);
    toast.success("Event added to calendar!");
    
    // Reset form
    setNewEvent({
      title: "",
      description: "",
      date: new Date(),
      time: "",
      location: ""
    });
  };
  
  // Highlighted dates for the calendar (dates with events)
  const highlightedDates = events.map(event => event.date);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            Group Calendar
          </CardTitle>
          <CardDescription>
            View and manage group events
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border p-3 pointer-events-auto"
            modifiers={{
              highlighted: highlightedDates
            }}
            modifiersStyles={{
              highlighted: { 
                fontWeight: 'bold', 
                backgroundColor: 'hsl(var(--primary) / 0.1)',
                color: 'hsl(var(--primary))'
              }
            }}
          />
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="mt-4 w-full">
                <CalendarPlus className="mr-2 h-4 w-4" />
                Add New Event
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Event</DialogTitle>
                <DialogDescription>
                  Add a new event to the group calendar
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="event-title">Event Title*</Label>
                  <Input
                    id="event-title"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                    placeholder="Enter event title"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="event-description">Description</Label>
                  <Textarea
                    id="event-description"
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                    placeholder="Describe your event"
                    className="min-h-[80px]"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Date*</Label>
                    <Input
                      type="date"
                      value={newEvent.date ? format(newEvent.date, 'yyyy-MM-dd') : ''}
                      onChange={(e) => {
                        const selectedDate = e.target.value ? new Date(e.target.value) : undefined;
                        setNewEvent({...newEvent, date: selectedDate});
                      }}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="event-time">Time*</Label>
                    <Input
                      id="event-time"
                      placeholder="e.g., 14:00 - 16:00"
                      value={newEvent.time}
                      onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="event-location">Location</Label>
                  <Input
                    id="event-location"
                    placeholder="Enter event location"
                    value={newEvent.location}
                    onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddEvent}>
                  Create Event
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
      
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>
            {date ? format(date, 'MMMM d, yyyy') : 'Select a date'}
          </CardTitle>
          <CardDescription>
            {selectedDateEvents.length 
              ? `${selectedDateEvents.length} event${selectedDateEvents.length > 1 ? 's' : ''} scheduled` 
              : 'No events scheduled for this day'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {selectedDateEvents.length > 0 ? (
              selectedDateEvents.map((event) => (
                <Card key={event.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{event.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-sm">{event.description}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{event.time}</span>
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>{event.location}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm">View Details</Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
                <CalendarDays className="h-12 w-12 mb-4 opacity-20" />
                <h3 className="text-lg font-medium">No Events</h3>
                <p className="max-w-sm">
                  There are no events scheduled for this date. Select a different date or add a new event.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default CalendarPage;
