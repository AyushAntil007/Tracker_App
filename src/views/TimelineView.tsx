import { useMemo } from 'react';
import { useFilteredTasks } from '../state/useFilteredTasks';
import { PRIORITY_COLORS } from '../utils/date';

const DAY_SIZE = 32;

export function TimelineView() {
  const tasks = useFilteredTasks();

  const { monthStart, monthEnd, days } = useMemo(() => {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const dayCount = monthEnd.getDate();
    return { monthStart, monthEnd, days: Array.from({ length: dayCount }, (_, i) => i + 1) };
  }, []);

  const today = new Date();
  const todayOffset = (today.getDate() - 1) * DAY_SIZE;

  const range = monthEnd.getTime() - monthStart.getTime();

  return (
    <div className="timelineWrap">
      <div className="timeline" style={{ width: days.length * DAY_SIZE + 280 }}>
        <div className="timelineHeader">
          <div className="taskCol">Task</div>
          <div className="daysRow">
            {days.map((day) => <span key={day}>{day}</span>)}
            <div className="todayLine" style={{ left: todayOffset }} />
          </div>
        </div>

        {tasks.map((task) => {
          const start = task.startDate ? new Date(task.startDate) : new Date(task.dueDate);
          const due = new Date(task.dueDate);
          const left = Math.max(0, ((start.getTime() - monthStart.getTime()) / range) * days.length * DAY_SIZE);
          const width = Math.max(DAY_SIZE, ((due.getTime() - start.getTime()) / range) * days.length * DAY_SIZE + DAY_SIZE);
          return (
            <div className="timelineRow" key={task.id}>
              <div className="taskCol">{task.title}</div>
              <div className="barZone">
                <div className="bar" style={{ left, width, background: PRIORITY_COLORS[task.priority] }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
