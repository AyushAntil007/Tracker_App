import { useMemo, useRef, useState } from 'react';
import { users } from '../data/generateTasks';
import { useDispatch, useStore } from '../state/store';
import { useFilteredTasks } from '../state/useFilteredTasks';
import { Status } from '../types';
import { formatDue, PRIORITY_COLORS, STATUS_LABELS } from '../utils/date';
import { Avatar } from '../components/Avatar';

const columns: Status[] = ['todo', 'in_progress', 'in_review', 'done'];

export function KanbanView() {
  const tasks = useFilteredTasks();
  const { presence } = useStore();
  const dispatch = useDispatch();
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [hoverCol, setHoverCol] = useState<Status | null>(null);
  const [ghost, setGhost] = useState<{ x: number; y: number; title: string } | null>(null);
  const pointerOffset = useRef({ x: 0, y: 0 });

  const grouped = useMemo(() => {
    return columns.reduce((acc, status) => {
      acc[status] = tasks.filter((task) => task.status === status);
      return acc;
    }, {} as Record<Status, typeof tasks>);
  }, [tasks]);

  function onPointerDown(event: React.PointerEvent, id: string, title: string) {
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    pointerOffset.current = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    setDraggedId(id);
    setGhost({ x: event.clientX, y: event.clientY, title });

    const move = (ev: PointerEvent) => setGhost((prev) => prev ? { ...prev, x: ev.clientX, y: ev.clientY } : prev);
    const up = () => {
      setGhost(null);
      setDraggedId(null);
      setHoverCol(null);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };

    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up, { once: true });
  }

  const drop = (status: Status) => {
    if (draggedId) {
      dispatch({ type: 'set_status', payload: { id: draggedId, status } });
    }
    setDraggedId(null);
    setGhost(null);
    setHoverCol(null);
  };

  return (
    <div className="kanban">
      {columns.map((status) => (
        <section
          key={status}
          className={`kanbanCol ${hoverCol === status ? 'kanbanCol--hover' : ''}`}
          onPointerEnter={() => draggedId && setHoverCol(status)}
          onPointerLeave={() => setHoverCol((prev) => (prev === status ? null : prev))}
          onPointerUp={() => drop(status)}
        >
          <header>
            <h3>{STATUS_LABELS[status]}</h3>
            <span>{grouped[status].length}</span>
          </header>
          <div className="kanbanCol__scroll">
            {grouped[status].length === 0 ? <div className="empty">Nothing here yet</div> : null}
            {grouped[status].map((task) => {
              const assignee = users.find((user) => user.id === task.assigneeId)!;
              const due = formatDue(task.dueDate);
              const viewers = presence.filter((p) => p.taskId === task.id);
              return (
                <article
                  key={task.id}
                  className={`card ${draggedId === task.id ? 'card--placeholder' : ''}`}
                  onPointerDown={(e) => onPointerDown(e, task.id, task.title)}
                >
                  <h4>{task.title}</h4>
                  <div className="card__meta">
                    <Avatar name={assignee.name} color={assignee.color} />
                    <span className="badge" style={{ background: PRIORITY_COLORS[task.priority] }}>{task.priority}</span>
                    <span className={due.danger ? 'due due--danger' : 'due'}>{due.label}</span>
                  </div>
                  {viewers.length > 0 ? (
                    <div className="stackedAvatars">
                      {viewers.slice(0, 2).map((viewer) => (
                        <Avatar key={viewer.id} name={viewer.name} color={viewer.color} small />
                      ))}
                      {viewers.length > 2 ? <span className="plus">+{viewers.length - 2}</span> : null}
                    </div>
                  ) : null}
                </article>
              );
            })}
          </div>
        </section>
      ))}

      {ghost ? (
        <div
          className="dragGhost"
          style={{ left: ghost.x - pointerOffset.current.x, top: ghost.y - pointerOffset.current.y }}
        >
          {ghost.title}
        </div>
      ) : null}
    </div>
  );
}
