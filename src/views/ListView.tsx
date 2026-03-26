import { useMemo, useState } from 'react';
import { users } from '../data/generateTasks';
import { useDispatch } from '../state/store';
import { useFilteredTasks } from '../state/useFilteredTasks';
import { Priority, Task } from '../types';
import { formatDue, PRIORITY_ORDER, STATUS_LABELS } from '../utils/date';

type SortKey = 'title' | 'priority' | 'dueDate';

const ROW_HEIGHT = 56;

function sortTasks(tasks: Task[], key: SortKey, direction: 'asc' | 'desc') {
  const mult = direction === 'asc' ? 1 : -1;
  return [...tasks].sort((a, b) => {
    if (key === 'title') return a.title.localeCompare(b.title) * mult;
    if (key === 'priority') return (PRIORITY_ORDER[a.priority as Priority] - PRIORITY_ORDER[b.priority as Priority]) * mult;
    return (new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()) * mult;
  });
}

export function ListView() {
  const tasks = useFilteredTasks();
  const dispatch = useDispatch();
  const [sort, setSort] = useState<{ key: SortKey; direction: 'asc' | 'desc' }>({ key: 'title', direction: 'asc' });
  const [scrollTop, setScrollTop] = useState(0);

  const sorted = useMemo(() => sortTasks(tasks, sort.key, sort.direction), [tasks, sort]);

  const viewportHeight = 520;
  const totalHeight = sorted.length * ROW_HEIGHT;
  const start = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - 5);
  const visibleCount = Math.ceil(viewportHeight / ROW_HEIGHT) + 10;
  const end = Math.min(sorted.length, start + visibleCount);
  const rows = sorted.slice(start, end);

  const toggleSort = (key: SortKey) => {
    setSort((prev) => ({ key, direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc' }));
  };

  if (sorted.length === 0) {
    return <div className="empty empty--list">No tasks match the current filters. Clear filters to see work items.</div>;
  }

  return (
    <div>
      <div className="tableHead">
        {['title', 'priority', 'dueDate'].map((header) => (
          <button key={header} className={sort.key === header ? 'activeSort' : ''} onClick={() => toggleSort(header as SortKey)}>
            {header}
          </button>
        ))}
        <span>Status</span>
        <span>Assignee</span>
      </div>

      <div className="virtualList" style={{ height: viewportHeight }} onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}>
        <div style={{ height: totalHeight, position: 'relative' }}>
          {rows.map((task, idx) => {
            const top = (start + idx) * ROW_HEIGHT;
            const assignee = users.find((user) => user.id === task.assigneeId)!;
            const due = formatDue(task.dueDate);
            return (
              <div key={task.id} className="row" style={{ transform: `translateY(${top}px)` }}>
                <span>{task.title}</span>
                <span>{task.priority}</span>
                <span className={due.danger ? 'due due--danger' : 'due'}>{due.label}</span>
                <select
                  value={task.status}
                  onChange={(e) => dispatch({ type: 'set_status', payload: { id: task.id, status: e.target.value as Task['status'] } })}
                >
                  {Object.entries(STATUS_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
                <span>{assignee.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
