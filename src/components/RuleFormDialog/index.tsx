import { useState } from "react";
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Separator } from "../ui/separator";
import { PlusCircle } from "lucide-react";
import type { Rule } from "../../types";

interface RuleFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (rule: Omit<Rule, "id">) => void;
}

export function RuleFormDialog({ open, onOpenChange, onSubmit }: RuleFormDialogProps) {
  const [newRule, setNewRule] = useState<Omit<Rule, "id">>({
    condition: { field: "name", operator: "contains", value: "" },
    action: { type: "highlight", value: "#FF0000" }
  });

  const handleSubmit = () => {
    if (!newRule.condition.value) {
      return; // Prevent adding rules with empty values
    }
    
    onSubmit(newRule);
    onOpenChange(false);
    setNewRule({
      condition: { field: "name", operator: "contains", value: "" },
      action: { type: "highlight", value: "#FF0000" }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <PlusCircle className="mr-2 h-4 w-4" /> Create Rule
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md bg-white">
        <DialogHeader>
          <DialogTitle>Create a New Rule</DialogTitle>
          <DialogDescription>
            Define conditions and actions for automating task management
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>If a task's</Label>
            <Select
              value={newRule.condition.field}
              onValueChange={(value) => 
                setNewRule({
                  ...newRule, 
                  condition: {
                    ...newRule.condition,
                    field: value as "name" | "priority" | "createdAt"
                  }
                })
              }
            >
              <SelectTrigger className="border-slate-200 bg-white">
                <SelectValue placeholder="Select field" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="priority">Priority</SelectItem>
                <SelectItem value="createdAt">Created Date</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Condition</Label>
            <Select
              value={newRule.condition.operator}
              onValueChange={(value) => 
                setNewRule({
                  ...newRule, 
                  condition: {
                    ...newRule.condition,
                    operator: value as "contains" | "equals" | "greaterThan" | "lessThan"
                  }
                })
              }
            >
              <SelectTrigger className="border-slate-200 bg-white">
                <SelectValue placeholder="Select operator" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="contains">Contains</SelectItem>
                <SelectItem value="equals">Equals</SelectItem>
                <SelectItem value="greaterThan">Is after</SelectItem>
                <SelectItem value="lessThan">Is before</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Value</Label>
            <Input
              value={newRule.condition.value}
              onChange={(e) => 
                setNewRule({
                  ...newRule, 
                  condition: {
                    ...newRule.condition,
                    value: e.target.value
                  }
                })
              }
              placeholder="Enter value"
              type={newRule.condition.field === "createdAt" ? "date" : "text"}
              className="border-slate-200"
            />
          </div>
          
          <Separator className="my-4" />
          
          <div className="space-y-2">
            <Label>Then</Label>
            <Select
              value={newRule.action.type}
              onValueChange={(value) => 
                setNewRule({
                  ...newRule, 
                  action: {
                    ...newRule.action,
                    type: value as "highlight" | "move" | "warn",
                    value: value === "highlight" ? "#3b82f6" : 
                           value === "warn" ? "This task requires attention" : ""
                  }
                })
              }
            >
              <SelectTrigger className="border-slate-200 bg-white">
                <SelectValue placeholder="Select action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="highlight">Highlight Task</SelectItem>
                <SelectItem value="move">Move to Top</SelectItem>
                <SelectItem value="warn">Show Warning</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {newRule.action.type === "highlight" && (
            <div className="space-y-2">
              <Label>Highlight Color</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={newRule.action.value}
                  onChange={(e) => 
                    setNewRule({
                      ...newRule, 
                      action: {
                        ...newRule.action,
                        value: e.target.value
                      }
                    })
                  }
                  className="w-16 h-10 p-1 border-slate-200"
                />
                <Input
                  value={newRule.action.value}
                  onChange={(e) => 
                    setNewRule({
                      ...newRule, 
                      action: {
                        ...newRule.action,
                        value: e.target.value
                      }
                    })
                  }
                  placeholder="#RRGGBB"
                  className="flex-1 border-slate-200"
                />
              </div>
            </div>
          )}
          
          {newRule.action.type === "warn" && (
            <div className="space-y-2">
              <Label>Warning Message</Label>
              <Input
                value={newRule.action.value}
                onChange={(e) => 
                  setNewRule({
                    ...newRule, 
                    action: {
                      ...newRule.action,
                      value: e.target.value
                    }
                  })
                }
                placeholder="Enter warning message"
                className="border-slate-200"
              />
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="border-slate-200 text-slate-700"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Add Rule
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}