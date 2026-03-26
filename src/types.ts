export type Status = 'todo' | 'in_progress' | 'in_review' | 'done';
export type Priority = 'critical' | 'high' | 'medium' | 'low';

export interface User {
  id: string;
  name: string;
  color: string;
}

export interface Task {
  id: string;
  title: string;
  assigneeId: string;
  status: Status;
  priority: Priority;
  startDate: string | null;
  dueDate: string;
}

export interface Filters {
  status: Status[];
  priority: Priority[];
  assignee: string[];
  from: string;
  to: string;
}

export type ViewType = 'kanban' | 'list' | 'timeline';

export interface Presence {
  id: string;
  name: string;
  color: string;
  taskId: string;
}
