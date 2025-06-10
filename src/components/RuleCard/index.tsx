import { Trash2 } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import type { Rule } from "../../types";

interface RuleCardProps {
  rule: Rule;
  onDelete: (id: string) => void;
}

export function RuleCard({ rule, onDelete }: RuleCardProps) {
  return (
    <Card className="shadow-sm bg-white">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base font-medium text-slate-700">Rule</CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onDelete(rule.id)}
            className="h-8 w-8 p-0 text-slate-500 hover:text-red-600"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="py-2 text-sm">
        <div className="bg-slate-50 p-3 rounded-md border border-slate-100 mb-3">
          <p className="font-medium text-slate-600 mb-1">If a task's:</p>
          <div className="flex items-center gap-2 mb-1 ml-2">
            <Badge variant="outline" className="bg-slate-100">
              {rule.condition.field === "name" ? "Name" : 
               rule.condition.field === "priority" ? "Priority" : "Created Date"}
            </Badge>
            <span className="text-slate-500">
              {rule.condition.operator === "contains" && "contains"}
              {rule.condition.operator === "equals" && "equals"}
              {rule.condition.operator === "greaterThan" && "is after"}
              {rule.condition.operator === "lessThan" && "is before"}
            </span>
            <Badge className="bg-blue-100 text-blue-800 border-none">
              {rule.condition.value}
            </Badge>
          </div>
        </div>
        
        <div className="bg-slate-50 p-3 rounded-md border border-slate-100">
          <p className="font-medium text-slate-600 mb-1">Then:</p>
          <div className="flex items-center gap-2 ml-2">
            {rule.action.type === "highlight" && (
              <>
                <span className="text-slate-500">Highlight task in</span>
                <div 
                  className="h-4 w-4 rounded-full border border-slate-300" 
                  style={{ backgroundColor: rule.action.value }}
                ></div>
                <span className="text-xs text-slate-400">{rule.action.value}</span>
              </>
            )}
            
            {rule.action.type === "move" && (
              <span className="text-slate-500">Move task to the top of the list</span>
            )}
            
            {rule.action.type === "warn" && (
              <>
                <span className="text-slate-500">Show warning:</span>
                <span className="text-red-600 font-medium">"{rule.action.value}"</span>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}