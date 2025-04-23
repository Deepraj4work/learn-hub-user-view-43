
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Heart, Bell, Send, ThumbsUp } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Post {
  id: number;
  author: {
    name: string;
    avatar: string;
    isAdmin: boolean;
  };
  content: string;
  timestamp: string;
  likes: number;
  isAnnouncement: boolean;
  comments: {
    id: number;
    author: {
      name: string;
      avatar: string;
    };
    content: string;
    timestamp: string;
  }[];
}

// Sample data for posts
const initialPosts: Post[] = [
  {
    id: 1,
    author: {
      name: "Sarah Adams",
      avatar: "",
      isAdmin: true
    },
    content: "Welcome to our new Web Development group! We'll be sharing resources, tips, and organizing study sessions here.",
    timestamp: "2 hours ago",
    likes: 15,
    isAnnouncement: true,
    comments: [
      {
        id: 1,
        author: {
          name: "Mike Johnson",
          avatar: ""
        },
        content: "Looking forward to learning with everyone!",
        timestamp: "1 hour ago"
      }
    ]
  },
  {
    id: 2,
    author: {
      name: "Alex Johnson",
      avatar: "",
      isAdmin: false
    },
    content: "Has anyone tried the new React hooks course? Would love to hear your thoughts before I enroll.",
    timestamp: "Yesterday",
    likes: 8,
    isAnnouncement: false,
    comments: []
  }
];

export function NewsPage() {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [newPostContent, setNewPostContent] = useState("");
  const [newCommentContents, setNewCommentContents] = useState<{[key: number]: string}>({});
  const [showCommentFields, setShowCommentFields] = useState<{[key: number]: boolean}>({});
  const isAdmin = true; // In a real app, this would come from auth context
  
  const handlePostSubmit = () => {
    if (!newPostContent.trim()) return;
    
    const newPost: Post = {
      id: Date.now(),
      author: {
        name: "Alex Johnson",
        avatar: "",
        isAdmin: false
      },
      content: newPostContent,
      timestamp: "Just now",
      likes: 0,
      isAnnouncement: false,
      comments: []
    };
    
    setPosts([newPost, ...posts]);
    setNewPostContent("");
    toast.success("Post created successfully!");
  };
  
  const handleCommentSubmit = (postId: number) => {
    if (!newCommentContents[postId] || !newCommentContents[postId].trim()) return;
    
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [
            ...post.comments,
            {
              id: Date.now(),
              author: {
                name: "Alex Johnson",
                avatar: ""
              },
              content: newCommentContents[postId],
              timestamp: "Just now"
            }
          ]
        };
      }
      return post;
    }));
    
    setNewCommentContents({...newCommentContents, [postId]: ""});
    setShowCommentFields({...showCommentFields, [postId]: false});
    toast.success("Comment added!");
  };
  
  const handleLike = (postId: number) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          likes: post.likes + 1
        };
      }
      return post;
    }));
    toast("You liked this post");
  };
  
  const handleCreateAnnouncement = () => {
    if (!newPostContent.trim()) return;
    
    const newAnnouncement: Post = {
      id: Date.now(),
      author: {
        name: "Admin",
        avatar: "",
        isAdmin: true
      },
      content: newPostContent,
      timestamp: "Just now",
      likes: 0,
      isAnnouncement: true,
      comments: []
    };
    
    setPosts([newAnnouncement, ...posts]);
    setNewPostContent("");
    toast.success("Announcement created!");
  };
  
  const toggleCommentField = (postId: number) => {
    setShowCommentFields({
      ...showCommentFields,
      [postId]: !showCommentFields[postId]
    });
    
    if (!newCommentContents[postId]) {
      setNewCommentContents({
        ...newCommentContents,
        [postId]: ""
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create a post</CardTitle>
          <CardDescription>Share something with the group</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="What's on your mind?"
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            className="min-h-[100px]"
          />
        </CardContent>
        <CardFooter className="flex justify-between">
          <div>
            {isAdmin && (
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={handleCreateAnnouncement}
                disabled={!newPostContent.trim()}
              >
                <Bell className="h-4 w-4" />
                Post as Announcement
              </Button>
            )}
          </div>
          <Button 
            onClick={handlePostSubmit}
            disabled={!newPostContent.trim()}
            className="flex items-center gap-2"
          >
            <Send className="h-4 w-4" />
            Post
          </Button>
        </CardFooter>
      </Card>

      <div className="space-y-4">
        {posts.map((post) => (
          <Card key={post.id} className={post.isAnnouncement ? "border-primary" : ""}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                    {post.author.avatar && <AvatarImage src={post.author.avatar} />}
                  </Avatar>
                  <div>
                    <div className="font-semibold">{post.author.name}</div>
                    <div className="text-sm text-muted-foreground">{post.timestamp}</div>
                  </div>
                </div>
                
                {post.isAnnouncement && (
                  <Badge variant="outline" className="flex items-center gap-1 bg-primary/10">
                    <Bell className="h-3 w-3" />
                    Announcement
                  </Badge>
                )}
              </div>
            </CardHeader>
            
            <CardContent>
              <p className="whitespace-pre-wrap">{post.content}</p>
            </CardContent>
            
            <CardFooter className="flex flex-col items-stretch">
              <div className="flex justify-between items-center w-full mb-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="gap-1 text-muted-foreground"
                  onClick={() => handleLike(post.id)}
                >
                  <ThumbsUp className="h-4 w-4" />
                  {post.likes > 0 && <span>{post.likes}</span>}
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="gap-1 text-muted-foreground"
                  onClick={() => toggleCommentField(post.id)}
                >
                  <MessageSquare className="h-4 w-4" />
                  {post.comments.length > 0 && <span>{post.comments.length}</span>}
                </Button>
              </div>
              
              {post.comments.length > 0 && (
                <>
                  <Separator className="my-2" />
                  <div className="space-y-3 w-full mt-2">
                    {post.comments.map((comment) => (
                      <div key={comment.id} className="flex gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs">{comment.author.name[0]}</AvatarFallback>
                          {comment.author.avatar && <AvatarImage src={comment.author.avatar} />}
                        </Avatar>
                        <div className="bg-secondary/30 rounded-lg px-3 py-2 text-sm flex-1">
                          <div className="font-medium">{comment.author.name}</div>
                          <p>{comment.content}</p>
                          <div className="text-xs text-muted-foreground mt-1">{comment.timestamp}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
              
              {showCommentFields[post.id] && (
                <div className="flex gap-2 mt-3 w-full">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback>A</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 flex gap-2">
                    <Textarea
                      placeholder="Write a comment..."
                      value={newCommentContents[post.id] || ""}
                      onChange={(e) => setNewCommentContents({
                        ...newCommentContents,
                        [post.id]: e.target.value
                      })}
                      className="text-sm min-h-[60px] flex-1"
                    />
                    <Button 
                      size="sm" 
                      onClick={() => handleCommentSubmit(post.id)}
                      disabled={!newCommentContents[post.id] || !newCommentContents[post.id].trim()}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default NewsPage;
