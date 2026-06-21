import { clsx } from 'clsx';

const SIZE_MAP = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-lg'
};

const UserAvatar = ({ nombre, apellido, imagenUrl, size = 'md' }) => {
  const iniciales = `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase();

  if (imagenUrl) {
    return (
      <img
        src={imagenUrl}
        alt={`${nombre} ${apellido}`}
        className={clsx('rounded-full object-cover border border-gray-200', SIZE_MAP[size])} />);

  }

  return (
    <div
      className={clsx(
        'rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold border border-blue-200',
        SIZE_MAP[size]
      )}>

      {iniciales}
    </div>);

};

export default UserAvatar;
