import { useState } from "react";
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import type { Task } from "../../types";

interface TaskFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "add" | "edit";
  currentTask: Task | null;
  onSubmit: (taskData: Omit<Task, "id" | "createdAt">) => void;
}

export function TaskFormDialog({
  open,
  onOpenChange,
  mode,
  currentTask,
  onSubmit
}: TaskFormDialogProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: currentTask?.name || "",
    priority: currentTask?.priority || "medium" as "high" | "medium" | "low",
  });
  const [nameError, setNameError] = useState("");

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      setNameError("Task name cannot be empty");
      return;
    }
    
    onSubmit(formData);
    resetForm();
    onOpenChange(false);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      priority: "medium"
    });
    setNameError("");
    setCurrentStep(1);
  };

  const handleCancel = () => {
    resetForm();
    onOpenChange(false);
  };

  const titleText = mode === "add" 
    ? (currentStep === 1 ? "Add Task - Step 1: Task Name" : "Add Task - Step 2: Priority")
    : (currentStep === 1 ? "Edit Task - Step 1: Task Name" : "Edit Task - Step 2: Priority");

  const descriptionText = currentStep === 1 
    ? (mode === "add" ? "Enter a name for your task" : "Update the name of your task")
    : (mode === "add" ? "Select a priority level for your task" : "Update the priority level of your task");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>{titleText}</DialogTitle>
          <DialogDescription>{descriptionText}</DialogDescription>
        </DialogHeader>
        
        {currentStep === 1 ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="task-name">Task Name</Label>
              <Input
                id="task-name"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  if (e.target.value.trim()) setNameError("");
                }}
                placeholder="Enter task name"
                className="border-slate-200"
              />
              {nameError && (
                <p className="text-sm text-red-500">{nameError}</p>
              )}
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={handleCancel}
                className="border-slate-200 text-slate-700"
              >
                Cancel
              </Button>
              <Button 
                onClick={() => {
                  if (!formData.name.trim()) {
                    setNameError("Task name cannot be empty");
                    return;
                  }
                  setCurrentStep(2);
                }}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Next
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="task-priority">Task Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => 
                  setFormData({ ...formData, priority: value as "high" | "medium" | "low" })
                }
              >
                <SelectTrigger className="border-slate-200 bg-white">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setCurrentStep(1)}
                className="border-slate-200 text-slate-700"
              >
                Back
              </Button>
              <Button 
                onClick={handleSubmit}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {mode === "add" ? "Add Task" : "Update Task"}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}