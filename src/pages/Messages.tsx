
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageCircle, Search, Send, SmilePlus } from "lucide-react";
import { useState } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";

// Dummy data - replace with real data later
const friends = [
  { id: 1, name: "Sarah Wilson", avatar: "/placeholder.svg", status: "online", lastMessage: "Hey there!" },
  { id: 2, name: "Michael Chen", avatar: "/placeholder.svg", status: "offline", lastMessage: "Let's catch up later" },
  { id: 3, name: "Emily Brown", avatar: "/placeholder.svg", status: "online", lastMessage: "Did you see the new course?" },
  { id: 4, name: "David Kim", avatar: "/placeholder.svg", status: "away", lastMessage: "Thanks for your help!" },
  { id: 5, name: "Jessica Taylor", avatar: "/placeholder.svg", status: "online", lastMessage: "Are you free tomorrow?" },
  { id: 6, name: "Robert Johnson", avatar: "/placeholder.svg", status: "offline", lastMessage: "I'll get back to you" },
];

interface Message {
  id: number;
  senderId: number;
  text: string;
  timestamp: string;
}

export default function Messages() {
  const [selectedFriend, setSelectedFriend] = useState<number | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, senderId: 1, text: "Hey there!", timestamp: "10:30 AM" },
    { id: 2, senderId: 0, text: "Hi! How are you?", timestamp: "10:31 AM" },
    { id: 3, senderId: 1, text: "I'm doing great! Just finished the React module.", timestamp: "10:33 AM" },
    { id: 4, senderId: 0, text: "That's awesome! I'm still working on it.", timestamp: "10:34 AM" },
    { id: 5, senderId: 1, text: "Let me know if you need any help with it.", timestamp: "10:36 AM" },
  ]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([
        ...messages,
        {
          id: messages.length + 1,
          senderId: 0,
          text: newMessage,
          timestamp: new Date().toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
        },
      ]);
      setNewMessage("");
    }
  };

  const filteredFriends = friends.filter(friend => 
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container py-6">
      <DashboardHeader />
      <div className="rounded-lg border bg-card shadow-sm mb-8">
        <div className="flex h-[700px]">
          {/* Friends List Sidebar */}
          <div className="w-80 border-r flex flex-col">
            <div className="p-4 border-b">
              <h2 className="text-xl font-semibold mb-3">Messages</h2>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search contacts..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <ScrollArea className="flex-1">
              {filteredFriends.map((friend) => (
                <div
                  key={friend.id}
                  onClick={() => setSelectedFriend(friend.id)}
                  className={`p-4 flex items-center gap-3 hover:bg-accent cursor-pointer transition-colors border-b ${
                    selectedFriend === friend.id ? "bg-accent" : ""
                  }`}
                >
                  <div className="relative">
                    <Avatar>
                      <AvatarImage src={friend.avatar} />
                      <AvatarFallback>{friend.name[0]}</AvatarFallback>
                    </Avatar>
                    <div
                      className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background ${
                        friend.status === "online"
                          ? "bg-green-500"
                          : friend.status === "away"
                          ? "bg-yellow-500"
                          : "bg-gray-500"
                      }`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <p className="font-medium">{friend.name}</p>
                      <p className="text-xs text-muted-foreground">12:30 PM</p>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {friend.lastMessage}
                    </p>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {selectedFriend ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b bg-muted/30">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage
                        src={
                          friends.find((f) => f.id === selectedFriend)?.avatar
                        }
                      />
                      <AvatarFallback>
                        {friends.find((f) => f.id === selectedFriend)?.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">
                        {friends.find((f) => f.id === selectedFriend)?.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {
                          friends.find((f) => f.id === selectedFriend)?.status
                        }
                      </p>
                    </div>
                  </div>
                </div>

                {/* Messages Area */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.senderId === 0 ? "justify-end" : "justify-start"
                        }`}
                      >
                        {message.senderId !== 0 && (
                          <Avatar className="h-8 w-8 mr-2 mt-1">
                            <AvatarImage
                              src={friends.find((f) => f.id === selectedFriend)?.avatar}
                            />
                            <AvatarFallback>
                              {friends.find((f) => f.id === selectedFriend)?.name[0]}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div
                          className={`max-w-[70%] rounded-lg p-3 ${
                            message.senderId === 0
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          <p>{message.text}</p>
                          <p className="text-xs mt-1 opacity-70 text-right">
                            {message.timestamp}
                          </p>
                        </div>
                        {message.senderId === 0 && (
                          <Avatar className="h-8 w-8 ml-2 mt-1">
                            <AvatarFallback>Y</AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                {/* Message Input */}
                <div className="p-4 border-t bg-background">
                  <div className="flex gap-2 items-center">
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <SmilePlus className="h-5 w-5" />
                    </Button>
                    <Input
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleSendMessage();
                        }
                      }}
                      className="rounded-full"
                    />
                    <Button onClick={handleSendMessage} className="rounded-full" size="icon">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center flex-col gap-4 text-muted-foreground">
                <MessageCircle className="h-12 w-12" />
                <p>Select a conversation to start messaging</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
