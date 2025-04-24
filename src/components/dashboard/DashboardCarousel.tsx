
import React from 'react';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Calendar, User, AlertCircle } from 'lucide-react';

interface CarouselItemData {
  id: number;
  title: string;
  description: string;
  icon: React.ElementType;
  type: 'event' | 'notification' | 'profile' | 'alert';
}

const carouselItems: CarouselItemData[] = [
  {
    id: 1,
    title: "Upcoming Webinar",
    description: "Join our React Advanced Patterns webinar tomorrow at 3 PM.",
    icon: Calendar,
    type: 'event'
  },
  {
    id: 2,
    title: "Profile Update",
    description: "Please update your profile with your latest certification details.",
    icon: User,
    type: 'profile'
  },
  {
    id: 3,
    title: "New Course Published",
    description: "A new course on TypeScript Advanced Techniques has been published.",
    icon: Bell,
    type: 'notification'
  },
  {
    id: 4,
    title: "System Maintenance",
    description: "The platform will be under maintenance this Sunday from 2 AM to 4 AM.",
    icon: AlertCircle,
    type: 'alert'
  }
];

export function DashboardCarousel() {
  const getItemColor = (type: string) => {
    switch(type) {
      case 'event': return 'bg-blue-100 text-blue-600';
      case 'profile': return 'bg-purple-100 text-purple-600';
      case 'notification': return 'bg-amber-100 text-amber-600';
      case 'alert': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      className="w-full"
    >
      <CarouselContent>
        {carouselItems.map((item) => {
          const Icon = item.icon;
          const colorClass = getItemColor(item.type);
          
          return (
            <CarouselItem key={item.id} className="md:basis-1/2 lg:basis-1/2">
              <Card className="border hover:shadow-md transition-all">
                <CardHeader className="p-4 pb-2 flex flex-row items-center space-y-0">
                  <div className={`p-2 rounded-full mr-3 ${colorClass}`}>
                    <Icon size={16} />
                  </div>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                  <CardDescription>{item.description}</CardDescription>
                </CardContent>
              </Card>
            </CarouselItem>
          );
        })}
      </CarouselContent>
      <div className="flex justify-end gap-1 mt-3">
        <CarouselPrevious className="static translate-y-0 mr-1" />
        <CarouselNext className="static translate-y-0" />
      </div>
    </Carousel>
  );
}

export default DashboardCarousel;
