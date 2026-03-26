import { Priority, Status, Task, User } from '../types';

export const users: User[] = [
  { id: 'u1', name: 'Ava Patel', color: '#6366f1' },

  { id: 'u2', name: 'Arjun Mehta', color: '#059669' },
  { id: 'u3', name: 'Priya Nair', color: '#dc2626' },
  { id: 'u4', name: 'Rohan Iyer', color: '#d97706' },
  { id: 'u5', name: 'Neha Verma', color: '#0891b2' },
  { id: 'u6', name: 'Kabir Singh', color: '#7c3aed' }

];

const titles = [
  'Design dashboard cards','Write API contract','Fix auth redirect bug','Run QA sweep','Prepare release notes',
  'Refactor list rendering','Create onboarding flow','Validate CSV import','Improve loading skeleton',
  'Add overdue reminders','Finalize sprint goals','Document keyboard shortcuts'
];

const statuses: Status[] = ['todo', 'in_progress', 'in_review', 'done'];
const priorities: Priority[] = ['critical', 'high', 'medium', 'low'];

const rand = (max: number) => Math.floor(Math.random() * max);

export function generateTasks(count = 500): Task[] {
  const today = new Date();
  return Array.from({ length: count }).map((_, index) => {
    const base = new Date(today);
    base.setDate(today.getDate() - 20 + rand(50));

    const hasStart = Math.random() > 0.18;
    const start = hasStart ? new Date(base) : null;
    if (start) start.setDate(base.getDate() - rand(8));

    const due = new Date(base);
    due.setDate(base.getDate() + rand(12) - 4);

    return {
      id: `task-${index + 1}`,
      title: `${titles[rand(titles.length)]} #${index + 1}`,
      assigneeId: users[rand(users.length)].id,
      status: statuses[rand(statuses.length)],
      priority: priorities[rand(priorities.length)],
      startDate: start ? start.toISOString() : null,
      dueDate: due.toISOString()
    };
  });
}
