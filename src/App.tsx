import { useEffect } from 'react';
import { FilterBar } from './components/FilterBar';
import { PresenceBar } from './components/PresenceBar';
import { users } from './data/generateTasks';
import { useDispatch, useStore } from './state/store';
import { Filters, Presence, Status, ViewType } from './types';
import { KanbanView } from './views/KanbanView';
import { ListView } from './views/ListView';
import { TimelineView } from './views/TimelineView';

function parseFilters(): Filters {
  const params = new URLSearchParams(window.location.search);
  return {
    status: (params.get('status')?.split(',').filter(Boolean) as Status[]) || [],
    priority: (params.get('priority')?.split(',').filter(Boolean) as Filters['priority']) || [],
    assignee: params.get('assignee')?.split(',').filter(Boolean) || [],
    from: params.get('from') || '',
    to: params.get('to') || ''
  };
}

function writeFilters(filters: Filters) {
  const params = new URLSearchParams();
  if (filters.status.length) params.set('status', filters.status.join(','));
  if (filters.priority.length) params.set('priority', filters.priority.join(','));
  if (filters.assignee.length) params.set('assignee', filters.assignee.join(','));
  if (filters.from) params.set('from', filters.from);
  if (filters.to) params.set('to', filters.to);
  const query = params.toString();
  window.history.pushState({}, '', `${window.location.pathname}${query ? `?${query}` : ''}`);
}

export default function App() {
  const { view, filters, tasks, presence } = useStore();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({ type: 'set_filters', payload: parseFilters() });

    const onPop = () => dispatch({ type: 'set_filters', payload: parseFilters() });
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [dispatch]);

  useEffect(() => {
    writeFilters(filters);
  }, [filters]);

  useEffect(() => {
    const timer = setInterval(() => {
      const count = 2 + Math.floor(Math.random() * 3);
      const active = users.slice(0, count);
      const nextPresence: Presence[] = active.map((user) => ({
        id: user.id,
        name: user.name,
        color: user.color,
        taskId: tasks[Math.floor(Math.random() * tasks.length)].id
      }));
      dispatch({ type: 'set_presence', payload: nextPresence });
    }, 2500);

    return () => clearInterval(timer);
  }, [dispatch, tasks]);

  return (
    <main>
      <h1>Project Tracker</h1>
      <PresenceBar />
      <FilterBar filters={filters} setFilters={(next) => dispatch({ type: 'set_filters', payload: next })} />

      <nav className="tabs">
        {(['kanban', 'list', 'timeline'] as ViewType[]).map((item) => (
          <button key={item} className={view === item ? 'tab tab--active' : 'tab'} onClick={() => dispatch({ type: 'set_view', payload: item })}>
            {item}
          </button>
        ))}
      </nav>

      {view === 'kanban' && <KanbanView />}
      {view === 'list' && <ListView />}
      {view === 'timeline' && <TimelineView />}

      <footer className="footer">Live presence indicators: {presence.length}</footer>
    </main>
  );
}
