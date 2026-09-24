import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { cn } from '../../lib/cn';

// Variants swap the base classes rather than appending to them: clsx does not
// merge conflicting Tailwind utilities, so a caller passing `bg-ac-coral` on top
// of the default `bg-white` gets whichever the stylesheet happens to define
// last — which is how the primary button ended up white-on-white.
const VARIANTS = {
  default:
    'rounded-md border border-ac-light-gray bg-white px-2.5 py-1 text-[11px] font-semibold text-ac-dark-secondary hover:bg-ac-cream hover:text-ac-dark',
  primary:
    'rounded-lg bg-ac-coral px-3 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-white hover:bg-ac-coral-dark',
};

export function CopyButton({ text, label = 'Copy', variant = 'default', className }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        if (!navigator.clipboard) return;
        navigator.clipboard.writeText(text || '').then(() => {
          setDone(true);
          setTimeout(() => setDone(false), 1400);
        });
      }}
      className={cn(
        'inline-flex items-center gap-1.5 transition-colors',
        VARIANTS[variant] || VARIANTS.default,
        className,
      )}
    >
      {done ? <Check size={12} /> : <Copy size={12} />}
      {done ? 'Copied' : label}
    </button>
  );
}
