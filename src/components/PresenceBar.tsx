import { Avatar } from './Avatar';
import { useStore } from '../state/store';

export function PresenceBar() {
  const { presence } = useStore();

  return (
    <div className="presenceBar">
      <div className="presenceBar__avatars">
        {presence.map((person) => (
          <Avatar key={person.id} name={person.name} color={person.color} small />
        ))}
      </div>
      <p>{presence.length} people are viewing this board</p>
    </div>
  );
}
