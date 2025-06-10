import { AlertCircle, Calendar, Edit, Trash2 } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import type { Task, Rule } from "../../types";
import { applyRules } from "../../utils/ruleEngine";

interface TaskCardProps {
  task: Task;
  rules: Rule[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export function TaskCard({ task, rules, onEdit, onDelete }: TaskCardProps) {
  const actions = applyRules(task, rules);
  const highlightAction = actions.find(a => a.type === "highlight");
  const moveToTopAction = actions.some(a => a.type === "move");
  const warnings = actions
    .filter(a => a.type === "warn")
    .map(a => a.value);
  
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge className="bg-red-500 hover:bg-red-600">High</Badge>;
      case "medium":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Medium</Badge>;
      case "low":
        return <Badge className="bg-green-500 hover:bg-green-600">Low</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card 
      key={task.id} 
      className="shadow-sm bg-white overflow-hidden"
      style={{
        borderLeft: highlightAction ? `4px solid ${highlightAction.value}` : undefined
      }}
    >
      <CardContent className="p-0">
        <div className="p-5">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-medium text-slate-800 mb-1">{task.name}</h3>
              <div className="flex flex-wrap items-center gap-2">
                {getPriorityBadge(task.priority)}
                <div className="flex items-center text-xs text-slate-500">
                  <Calendar className="h-3.5 w-3.5 mr-1" />
                  {new Date(task.createdAt).toLocaleDateString(undefined, { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </div>
                
                {moveToTopAction && (
                  <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">
                    Moved to top
                  </Badge>
                )}
              </div>
              
              {/* Display warnings from rules */}
              {warnings.length > 0 && (
                <div className="mt-3 p-2 bg-red-50 rounded-md border border-red-100">
                  {warnings.map((warning, index) => (
                    <p key={index} className="text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle size={12} />
                      {warning}
                    </p>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onEdit(task)}
                className="border-slate-200 text-slate-700"
              >
                <Edit size={14} className="mr-1" /> Edit
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onDelete(task.id)}
                className="border-slate-200 text-red-600 hover:text-red-700 hover:border-red-200"
              >
                <Trash2 size={14} className="mr-1" /> Delete
              </Button>
            </div>
          </div>
        </div>
        
        {highlightAction && (
          <div 
            className="h-1"
            style={{ backgroundColor: highlightAction.value }}
          ></div>
        )}
      </CardContent>
    </Card>
  );
}