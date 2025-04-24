
import React from 'react';
import { Card } from "@/components/ui/card";
import { CheckSquare, ListTodo, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TodoItem {
  id: number;
  title: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
}

const todoItems: TodoItem[] = [
  {
    id: 1,
    title: "Complete Constitutional Law quiz",
    completed: false,
    priority: 'high'
  },
  {
    id: 2,
    title: "Review legal cases",
    completed: true,
    priority: 'medium'
  },
  {
    id: 3,
    title: "Prepare debate arguments",
    completed: false,
    priority: 'high'
  },
  {
    id: 4,
    title: "Read chapter on Civil Procedure",
    completed: false,
    priority: 'low'
  },
  {
    id: 5,
    title: "Submit legal brief draft",
    completed: false,
    priority: 'high'
  }
];

export function DashboardTodo() {
  const [todos, setTodos] = React.useState<TodoItem[]>(todoItems);
  
  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'high': return 'bg-red-100';
      case 'medium': return 'bg-amber-100';
      case 'low': return 'bg-green-100';
      default: return '';
    }
  };
  
  return (
    <Card className="border h-full shadow">
      <div className="p-4 flex items-center justify-between border-b">
        <div className="flex items-center gap-2">
          <ListTodo size={20} className="text-primary" />
          <h3 className="font-medium">Task List</h3>
        </div>
        <Button variant="ghost" size="sm" className="text-xs h-8" asChild>
          <Link to="/todo">View all</Link>
        </Button>
      </div>
      
      <ScrollArea className="h-[260px] p-4">
        <div className="space-y-2 pr-4">
          {todos.map(todo => (
            <div 
              key={todo.id} 
              className={`flex items-center gap-2 p-2 rounded-md transition-colors ${
                todo.completed ? 'bg-muted/30' : `${getPriorityColor(todo.priority)} bg-opacity-30`
              }`}
            >
              <Checkbox
                id={`todo-${todo.id}`}
                checked={todo.completed}
                onCheckedChange={() => toggleTodo(todo.id)}
              />
              <label 
                htmlFor={`todo-${todo.id}`}
                className={`flex-1 text-sm cursor-pointer ${
                  todo.completed ? 'line-through text-muted-foreground' : ''
                }`}
              >
                {todo.title}
              </label>
            </div>
          ))}
        </div>
      </ScrollArea>
      
      <div className="p-4 pt-2 border-t">
        <Button variant="outline" size="sm" className="w-full">
          <Plus size={16} className="mr-1" />
          Add task
        </Button>
      </div>
    </Card>
  );
}

export default DashboardTodo;
