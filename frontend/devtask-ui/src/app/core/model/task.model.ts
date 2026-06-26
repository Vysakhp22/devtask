export type Priority = 'high' | 'medium' | 'low';

export type TaskStatus = 'todo' | 'inprogress' | 'done';

export interface Task {
  id: string;
  title: string;
  priority: Priority;
  status: TaskStatus;
  deadline?: string; // ISO date string e.g. "2026-06-28"
  tags?: string[];
}

export interface KanbanColumn {
  id: TaskStatus;
  label: string;
  tasks: Task[];
}
