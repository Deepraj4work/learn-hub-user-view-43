
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { CheckSquare, ChevronRight, ListTodo, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";

interface TodoItem {
  id: number;
  title: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
}

const todoItems: TodoItem[] = [
  {
    id: 1,
    title: "Complete React module exercises",
    completed: false,
    priority: 'high'
  },
  {
    id: 2,
    title: "Review JavaScript concepts",
    completed: true,
    priority: 'medium'
  },
  {
    id: 3,
    title: "Prepare for upcoming quiz",
    completed: false,
    priority: 'high'
  },
  {
    id: 4,
    title: "Read documentation on hooks",
    completed: false,
    priority: 'low'
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
    <Card className="border h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ListTodo size={20} className="text-primary" />
            Todo List
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/todo">
              View all tasks
              <ChevronRight size={16} className="ml-1" />
            </Link>
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3">
        <div className="space-y-2">
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
      </CardContent>
      <CardFooter className="p-3 pt-0">
        <Button variant="outline" size="sm" className="w-full">
          <Plus size={16} className="mr-1" />
          Add new task
        </Button>
      </CardFooter>
    </Card>
  );
}

export default DashboardTodo;
