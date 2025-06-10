import { useState } from "react";
import { Tag } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { RuleCard } from "../RuleCard";
import { RuleFormDialog } from "../RuleFormDialog";
import { type Rule } from "../../types";

interface RulesTabProps {
  rules: Rule[];
  onAddRule: (rule: Omit<Rule, "id">) => void;
  onDeleteRule: (id: string) => void;
}

export function RulesTab({ rules, onAddRule, onDeleteRule }: RulesTabProps) {
  const [isRuleDialogOpen, setIsRuleDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-slate-800">Automation Rules</h2>
        <RuleFormDialog
          open={isRuleDialogOpen}
          onOpenChange={setIsRuleDialogOpen}
          onSubmit={onAddRule}
        />
      </div>
      
      {rules.length === 0 ? (
        <Card className="shadow-sm bg-white">
          <CardContent className="flex flex-col items-center justify-center py-12 text-slate-400">
            <div className="rounded-full bg-slate-100 p-3 mb-3">
              <Tag className="h-6 w-6" />
            </div>
            <p className="text-center">No automation rules yet.</p>
            <p className="text-center text-sm mt-1">
              Create rules to automatically highlight tasks, move them to the top, or show warnings.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rules.map(rule => (
            <RuleCard
              key={rule.id}
              rule={rule}
              onDelete={onDeleteRule}
            />
          ))}
        </div>
      )}
    </div>
  );
}