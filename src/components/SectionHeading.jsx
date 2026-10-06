import { cn } from '../lib/cn';

// The heading every page section opens with: a short mono kicker (optional), the title,
// an intro line (optional), and an action on the right (optional).
export function SectionHeading({ kicker, title, intro, action, className }) {
  return (
    <div className={cn('mb-6 flex flex-wrap items-end justify-between gap-x-6 gap-y-3', className)}>
      <div className="min-w-0 flex-1 basis-[22rem]">
        {kicker && <div className="eyebrow mb-2">{kicker}</div>}
        <h2 className="font-display text-[22px] font-bold leading-tight tracking-[-0.01em] text-ac-dark sm:text-[25px]">{title}</h2>
        {intro && <p className="mt-2 max-w-3xl text-[15px] leading-7 text-ac-dark-secondary">{intro}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
