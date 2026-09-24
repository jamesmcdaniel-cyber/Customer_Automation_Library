import { Check, Minus } from 'lucide-react';
import { cn } from '../lib/cn';

export function Checklist({ items, negative = false, className }) {
  const Icon = negative ? Minus : Check;
  return (
    <ul className={cn('space-y-2.5', className)}>
      {items.map((t, i) => (
        <li key={i} className="flex gap-3 text-[14px] leading-6 text-ac-dark-secondary">
          <span
            className={cn(
              'mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border',
              negative ? 'border-ac-light-gray text-ac-med-gray' : 'border-ac-coral/40 bg-ac-coral/10 text-ac-coral-dark',
            )}
          >
            <Icon size={12} strokeWidth={2.5} />
          </span>
          <span>{t}</span>
        </li>
      ))}
    </ul>
  );
}
