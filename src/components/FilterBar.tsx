import { ChangeEvent } from 'react';
import { users } from '../data/generateTasks';
import { Filters, Priority, Status } from '../types';

const statuses: Status[] = ['todo', 'in_progress', 'in_review', 'done'];
const priorities: Priority[] = ['critical', 'high', 'medium', 'low'];

interface Props {
  filters: Filters;
  setFilters: (filters: Filters) => void;
}

const readMulti = (event: ChangeEvent<HTMLSelectElement>) =>
  Array.from(event.target.selectedOptions).map((opt) => opt.value);

export function FilterBar({ filters, setFilters }: Props) {
  const hasActive =
    filters.status.length || filters.priority.length || filters.assignee.length || filters.from || filters.to;

  return (
    <section className="filterBar">
      <select multiple value={filters.status} onChange={(e) => setFilters({ ...filters, status: readMulti(e) as Status[] })}>
        {statuses.map((status) => (
          <option key={status} value={status}>{status}</option>
        ))}
      </select>

      <select multiple value={filters.priority} onChange={(e) => setFilters({ ...filters, priority: readMulti(e) as Priority[] })}>
        {priorities.map((priority) => (
          <option key={priority} value={priority}>{priority}</option>
        ))}
      </select>

      <select multiple value={filters.assignee} onChange={(e) => setFilters({ ...filters, assignee: readMulti(e) })}>
        {users.map((user) => (
          <option key={user.id} value={user.id}>{user.name}</option>
        ))}
      </select>

      <input type="date" value={filters.from} onChange={(e) => setFilters({ ...filters, from: e.target.value })} />
      <input type="date" value={filters.to} onChange={(e) => setFilters({ ...filters, to: e.target.value })} />

      {hasActive ? (
        <button className="ghostBtn" onClick={() => setFilters({ status: [], priority: [], assignee: [], from: '', to: '' })}>
          Clear all filters
        </button>
      ) : null}
    </section>
  );
}
