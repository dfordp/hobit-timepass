import type { Task, Rule } from "../types";

export function applyRules(task: Task, rules: Rule[]) {
  const appliedRules = rules.filter(rule => {
    const { field, operator, value } = rule.condition;
    
    if (field === "name") {
      if (operator === "contains") return task.name.includes(value);
      if (operator === "equals") return task.name === value;
    } else if (field === "priority") {
      if (operator === "equals") return task.priority === value;
    } else if (field === "createdAt") {
      const taskDate = new Date(task.createdAt).getTime();
      const compareDate = new Date(value).getTime();
      if (operator === "greaterThan") return taskDate > compareDate;
      if (operator === "lessThan") return taskDate < compareDate;
    }
    
    return false;
  });
  
  return appliedRules.map(rule => rule.action);
}

export function checkRuleConflicts(tasks: Task[], rules: Rule[]) {
  return tasks.some(task => {
    const actions = applyRules(task, rules);
    const highlightActions = actions.filter(action => action.type === "highlight");
    return highlightActions.length > 1;
  });
}

export function sortTasksByRules(tasks: Task[], rules: Rule[]) {
  return [...tasks].sort((a, b) => {
    const aActions = applyRules(a, rules);
    const bActions = applyRules(b, rules);
    
    const aMoveToTop = aActions.some(action => action.type === "move");
    const bMoveToTop = bActions.some(action => action.type === "move");
    
    if (aMoveToTop && !bMoveToTop) return -1;
    if (!aMoveToTop && bMoveToTop) return 1;
    
    // Secondary sort by priority
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
}