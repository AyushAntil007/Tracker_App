import { initials } from '../utils/date';

interface Props {
  name: string;
  color: string;
  small?: boolean;
}

export function Avatar({ name, color, small = false }: Props) {
  return (
    <span
      className={small ? 'avatar avatar--small' : 'avatar'}
      style={{ background: color }}
      title={name}
    >
      {initials(name)}
    </span>
  );
}
