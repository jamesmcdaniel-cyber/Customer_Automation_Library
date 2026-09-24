import { Link } from 'react-router-dom';
import { ArrowRight, Clock } from 'lucide-react';
import { cn } from '../lib/cn';

// Mirrors the full library's WorkflowCard.
export function ExampleCard({ example: e }) {
  return (
    <Link
      to={`/example/${e.id}`}
      className={cn(
        'group flex flex-col rounded-xl border bg-ac-card p-5 shadow-card no-underline transition-all duration-200 hover:-translate-y-0.5 hover:border-ac-coral hover:shadow-cardhover',
        e.startHere ? 'border-ac-coral ring-1 ring-ac-coral' : 'border-ac-light-gray',
      )}
    >
      <div className="mb-2.5 flex items-center gap-2">
        <span
          className={cn(
            'rounded-md px-2 py-0.5 font-mono text-[10.5px] font-medium uppercase tracking-[0.12em]',
            e.startHere ? 'bg-ac-coral text-white' : 'bg-ac-coral/12 text-ac-coral-dark',
          )}
        >
          {e.startHere ? 'Start here' : `Example 0${e.order}`}
        </span>
      </div>
      <h3 className="font-display text-[15px] font-bold leading-snug tracking-[-0.01em] text-ac-dark">{e.title}</h3>
      <p className="mt-2 line-clamp-3 flex-1 text-[13.5px] leading-6 text-ac-dark-secondary">{e.helpsYou}</p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {e.whoFor.map((w) => (
          <span key={w} className="rounded-md bg-ac-cream px-2 py-0.5 font-mono text-[11px] font-medium text-ac-dark-secondary">
            {w}
          </span>
        ))}
        <span className="inline-flex items-center gap-1 font-mono text-[11px] text-ac-med-gray">
          <Clock size={11} /> {e.timeToTry}
        </span>
      </div>
      <span className="mt-4 inline-flex items-center gap-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.1em] text-ac-coral-dark">
        Try it <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}
