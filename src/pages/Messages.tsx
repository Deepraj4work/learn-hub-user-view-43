
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageCircle, Send } from "lucide-react";
import { useState } from "react";

// Dummy data - replace with real data later
const friends = [
  { id: 1, name: "Sarah Wilson", avatar: "/placeholder.svg", status: "online" },
  { id: 2, name: "Michael Chen", avatar: "/placeholder.svg", status: "offline" },
  { id: 3, name: "Emily Brown", avatar: "/placeholder.svg", status: "online" },
  { id: 4, name: "David Kim", avatar: "/placeholder.svg", status: "away" },
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
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, senderId: 1, text: "Hey there!", timestamp: "10:30 AM" },
    { id: 2, senderId: 0, text: "Hi! How are you?", timestamp: "10:31 AM" },
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

  return (
    <div className="container py-6">
      <div className="rounded-lg border bg-card shadow-sm">
        <div className="flex h-[800px]">
          {/* Friends List Sidebar */}
          <div className="w-80 border-r">
            <div className="p-4 border-b">
              <h2 className="text-xl font-semibold">Messages</h2>
            </div>
            <ScrollArea className="h-[calc(800px-69px)]">
              {friends.map((friend) => (
                <div
                  key={friend.id}
                  onClick={() => setSelectedFriend(friend.id)}
                  className={`p-4 flex items-center gap-3 hover:bg-accent cursor-pointer transition-colors ${
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
                  <div>
                    <p className="font-medium">{friend.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {friend.status}
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
                <div className="p-4 border-b">
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
                        <div
                          className={`max-w-[70%] rounded-lg p-3 ${
                            message.senderId === 0
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          <p>{message.text}</p>
                          <p className="text-xs mt-1 opacity-70">
                            {message.timestamp}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                {/* Message Input */}
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleSendMessage();
                        }
                      }}
                    />
                    <Button onClick={handleSendMessage}>
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
