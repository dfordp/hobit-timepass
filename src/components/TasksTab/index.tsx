import { useState } from "react";
import { PlusCircle, Search, AlertCircle } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Dialog, DialogTrigger } from "../ui/dialog";
import { TaskCard } from "../TaskCard";
import { TaskFormDialog } from "../TaskFormDialog";
import type { Task, Rule } from "../../types";
import { sortTasksByRules, checkRuleConflicts } from "../../utils/ruleEngine";

interface TasksTabProps {
  tasks: Task[];
  rules: Rule[];
  onAddTask: (taskData: Omit<Task, "id" | "createdAt">) => void;
  onUpdateTask: (taskId: string, taskData: Omit<Task, "id" | "createdAt">) => void;
  onDeleteTask: (id: string) => void;
}

export function TasksTab({ tasks, rules, onAddTask, onUpdateTask, onDeleteTask }: TasksTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);

  // Filter tasks based on search query
  const filteredTasks = tasks.filter(task => 
    task.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Sort tasks based on rules
  const sortedTasks = sortTasksByRules(filteredTasks, rules);
  
  // Check for warnings
  const highPriorityCount = tasks.filter(task => task.priority === "high").length;
  const showHighPriorityWarning = highPriorityCount > 3;
  const hasRuleConflicts = checkRuleConflicts(tasks, rules);

  const handleEditTask = (task: Task) => {
    setCurrentTask(task);
    setIsEditDialogOpen(true);
  };

  const handleUpdateTask = (taskData: Omit<Task, "id" | "createdAt">) => {
    if (currentTask) {
      onUpdateTask(currentTask.id, taskData);
    }
  };

  return (
    <>
      {/* Search and add task controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-slate-200"
          />
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Task
            </Button>
          </DialogTrigger>
          <TaskFormDialog 
            open={isAddDialogOpen}
            onOpenChange={setIsAddDialogOpen}
            mode="add"
            currentTask={null}
            onSubmit={onAddTask}
          />
        </Dialog>
      </div>
      
      {/* Warnings section */}
      {(showHighPriorityWarning || hasRuleConflicts) && (
        <div className="space-y-4 mb-6">
          {showHighPriorityWarning && (
            <Alert variant="default" className="bg-amber-50 border-amber-200 text-amber-800">
              <AlertCircle className="h-4 w-4 text-amber-800" />
              <AlertTitle className="text-amber-800">Attention Needed</AlertTitle>
              <AlertDescription className="text-amber-700">
                You have {highPriorityCount} high priority tasks. Consider addressing some of them soon.
              </AlertDescription>
            </Alert>
          )}
          
          {hasRuleConflicts && (
            <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-800">
              <AlertCircle className="h-4 w-4 text-red-800" />
              <AlertTitle className="text-red-800">Rule Conflicts Detected</AlertTitle>
              <AlertDescription className="text-red-700">
                There are conflicts between your automation rules. Consider revising them for better results.
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}
      
      {/* Task statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card className="shadow-sm bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-slate-800">{tasks.length}</p>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">High Priority</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-500">{highPriorityCount}</p>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Active Rules</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-500">{rules.length}</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Task list */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-800 mb-3">My Tasks</h2>
        
        {sortedTasks.length === 0 ? (
          <Card className="shadow-sm bg-white">
            <CardContent className="flex flex-col items-center justify-center py-12 text-slate-400">
              <div className="rounded-full bg-slate-100 p-3 mb-3">
                <PlusCircle className="h-6 w-6" />
              </div>
              {searchQuery ? "No tasks match your search" : "No tasks yet. Add your first task!"}
            </CardContent>
          </Card>
        ) : (
          sortedTasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              rules={rules}
              onEdit={handleEditTask}
              onDelete={onDeleteTask}
            />
          ))
        )}
      </div>

      {/* Edit task dialog */}
      <TaskFormDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        mode="edit"
        currentTask={currentTask}
        onSubmit={handleUpdateTask}
      />
    </>
  );
}