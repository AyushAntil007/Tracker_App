import { createContext, Dispatch, ReactNode, useContext, useMemo, useReducer } from 'react';
import { generateTasks, users } from '../data/generateTasks';
import { Filters, Presence, Task, ViewType } from '../types';

interface State {
  tasks: Task[];
  filters: Filters;
  view: ViewType;
  presence: Presence[];
}

type Action =
  | { type: 'set_view'; payload: ViewType }
  | { type: 'set_filters'; payload: Filters }
  | { type: 'set_status'; payload: { id: string; status: Task['status'] } }
  | { type: 'set_presence'; payload: Presence[] };

const initialFilters: Filters = { status: [], priority: [], assignee: [], from: '', to: '' };

const initialState: State = {
  tasks: generateTasks(560),
  filters: initialFilters,
  view: 'kanban',
  presence: users.slice(0, 3).map((user, idx) => ({
    id: user.id,
    name: user.name,
    color: user.color,
    taskId: `task-${idx + 1}`
  }))
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'set_view':
      return { ...state, view: action.payload };
    case 'set_filters':
      return { ...state, filters: action.payload };
    case 'set_status':
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id ? { ...task, status: action.payload.status } : task
        )
      };
    case 'set_presence':
      return { ...state, presence: action.payload };
    default:
      return state;
  }
}

const StoreContext = createContext<State | null>(null);
const DispatchContext = createContext<Dispatch<Action> | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const memoState = useMemo(() => state, [state]);
  return (
    <DispatchContext.Provider value={dispatch}>
      <StoreContext.Provider value={memoState}>{children}</StoreContext.Provider>
    </DispatchContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside StoreProvider');
  return ctx;
}

export function useDispatch() {
  const ctx = useContext(DispatchContext);
  if (!ctx) throw new Error('useDispatch must be used inside StoreProvider');
  return ctx;
}
