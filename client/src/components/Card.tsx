'use client';
import clsx from 'clsx';

interface Props {
  label: string;
  selected: boolean;
  onSelect(): void;
  disabled?: boolean;
}

export default function Card({ label, selected, onSelect, disabled }: Props) {
  return (
    <button
      aria-label={`vote ${label}`}
      disabled={disabled}
      onClick={onSelect}
      className={clsx(
        'w-16 h-20 rounded-xl border flex items-center justify-center text-xl font-semibold focus:outline-none',
        selected ? 'bg-blue-600 text-white' : 'bg-white',
        disabled && 'opacity-50'
      )}
    >
      {label}
    </button>
  );
}
