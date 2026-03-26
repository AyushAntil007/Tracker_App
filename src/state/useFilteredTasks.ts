import { useMemo } from 'react';
import { useStore } from './store';

export function useFilteredTasks() {
  const { tasks, filters } = useStore();

  return useMemo(() => {
    return tasks.filter((task) => {
      if (filters.status.length && !filters.status.includes(task.status)) return false;
      if (filters.priority.length && !filters.priority.includes(task.priority)) return false;
      if (filters.assignee.length && !filters.assignee.includes(task.assigneeId)) return false;

      const due = new Date(task.dueDate).getTime();
      if (filters.from && due < new Date(filters.from).getTime()) return false;
      if (filters.to && due > new Date(filters.to).getTime()) return false;
      return true;
    });
  }, [tasks, filters]);
}
