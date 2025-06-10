export interface Task {
  id: string;
  name: string;
  priority: "high" | "medium" | "low";
  createdAt: string; // Store as ISO string for better serialization
}

export interface Rule {
  id: string;
  condition: {
    field: "name" | "priority" | "createdAt";
    operator: "contains" | "equals" | "greaterThan" | "lessThan";
    value: string;
  };
  action: {
    type: "highlight" | "move" | "warn";
    value: string; // color for highlight, position for move, message for warn
  };
}