import { Priority } from '../types';

export const STATUS_LABELS = {
  todo: 'To Do',
  in_progress: 'In Progress',
  in_review: 'In Review',
  done: 'Done'
} as const;

export const PRIORITY_ORDER: Record<Priority, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3
};

export const PRIORITY_COLORS: Record<Priority, string> = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#3b82f6',
  low: '#22c55e'
};

export function formatDue(dueDate: string): { label: string; danger: boolean } {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);

  const diff = Math.floor((due.getTime() - today.getTime()) / 86400000);
  if (diff === 0) return { label: 'Due Today', danger: false };
  if (diff < -7) return { label: `${Math.abs(diff)} days overdue`, danger: true };

  return {
    label: due.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    danger: diff < 0
  };
}

export function initials(name: string): string {
  return name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();
}
