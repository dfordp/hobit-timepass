import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { TasksTab } from "./components/TasksTab";
import { RulesTab } from "./components/RulesTab";
import type { Task, Rule } from "./types";
import { useLocalStorage } from "./hooks/useLocalStorage";

function App() {
  // State management with localStorage persistence
  const [tasks, setTasks] = useLocalStorage<Task[]>("tasks", []);
  const [rules, setRules] = useLocalStorage<Rule[]>("rules", []);
  const [, setActiveTab] = useState("tasks");
  
  // Task operations
  const addTask = (taskData: Omit<Task, "id" | "createdAt">) => {
    const newTask: Task = {
      id: Date.now().toString(),
      name: taskData.name,
      priority: taskData.priority,
      createdAt: new Date().toISOString()
    };
    
    setTasks([...tasks, newTask]);
  };
  
  const updateTask = (taskId: string, taskData: Omit<Task, "id" | "createdAt">) => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId 
        ? { ...task, name: taskData.name, priority: taskData.priority }
        : task
    );
    
    setTasks(updatedTasks);
  };
  
  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };
  
  // Rule operations
  const addRule = (ruleData: Omit<Rule, "id">) => {
    const newRule: Rule = {
      id: Date.now().toString(),
      ...ruleData
    };
    
    setRules([...rules, newRule]);
  };
  
  const deleteRule = (id: string) => {
    setRules(rules.filter(rule => rule.id !== id));
  };
  
  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Task Tracker</h1>
          <p className="text-slate-500">Keep track of your tasks and automate your workflow</p>
        </header>
        
        <Tabs defaultValue="tasks" className="mb-8" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="tasks">My Tasks</TabsTrigger>
            <TabsTrigger value="rules">Automation Rules</TabsTrigger>
          </TabsList>
          
          <TabsContent value="tasks" className="mt-6">
            <TasksTab
              tasks={tasks}
              rules={rules}
              onAddTask={addTask}
              onUpdateTask={updateTask}
              onDeleteTask={deleteTask}
            />
          </TabsContent>
          
          <TabsContent value="rules" className="mt-6">
            <RulesTab
              rules={rules}
              onAddRule={addRule}
              onDeleteRule={deleteRule}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default App;