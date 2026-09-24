import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import * as RD from '@radix-ui/react-dialog';
import { Menu, X } from 'lucide-react';
import { BrandMark } from './BrandMark';
import { assetUrl, cn } from '../lib/cn';
import { STAGES } from '../lib/stages';

// Example pages belong to the "Use it" stage.
function useActiveStage() {
  const { pathname } = useLocation();
  if (pathname.startsWith('/example/')) return 'use-it';
  return pathname.replace(/^\//, '').split('/')[0];
}

function StageLink({ stage, active, className }) {
  return (
    <NavLink
      to={`/${stage.id}`}
      className={cn(
        'flex items-baseline gap-2 rounded-[10px] px-3 py-2 font-mono text-[13px] font-medium no-underline transition-colors',
        active ? 'bg-ac-coral/15 text-ac-coral-dark' : 'text-ac-dark hover:bg-ac-cream hover:text-ac-coral-dark',
        className,
      )}
    >
      <span className={cn('text-[10.5px]', active ? 'text-ac-coral' : 'text-ac-med-gray')}>{stage.num}</span>
      {stage.label}
    </NavLink>
  );
}

function MobileMenu({ activeStage }) {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => setOpen(false), [pathname]);

  return (
    <RD.Root open={open} onOpenChange={setOpen}>
      <RD.Trigger
        className="grid h-10 w-10 place-items-center rounded-[10px] text-ac-dark transition-colors hover:bg-ac-cream md:hidden"
        aria-label="Open menu"
      >
        <Menu size={20} />
      </RD.Trigger>
      <RD.Portal>
        <RD.Overlay className="fixed inset-0 z-50 bg-ac-dark/40 animate-overlay-in" />
        <RD.Content
          aria-describedby={undefined}
          className="fixed inset-y-0 right-0 z-50 flex w-full flex-col border-l border-ac-light-gray bg-ac-ink p-6 shadow-menu animate-fade-in sm:w-[320px]"
        >
          <div className="flex items-center justify-between">
            <RD.Title className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-ac-med-gray">
              <BrandMark /> Menu
            </RD.Title>
            <RD.Close
              className="grid h-9 w-9 place-items-center rounded-lg text-ac-med-gray transition-colors hover:bg-ac-cream hover:text-ac-dark"
              aria-label="Close menu"
            >
              <X size={18} />
            </RD.Close>
          </div>
          <nav aria-label="Stages" className="mt-6 flex flex-col gap-1">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                cn(
                  'rounded-[10px] px-3 py-2.5 font-mono text-[13px] font-medium no-underline transition-colors',
                  isActive ? 'bg-ac-coral/15 text-ac-coral-dark' : 'text-ac-dark hover:bg-ac-cream hover:text-ac-coral-dark',
                )
              }
            >
              Home
            </NavLink>
            {STAGES.map((s) => (
              <StageLink key={s.id} stage={s} active={activeStage === s.id} className="py-2.5" />
            ))}
          </nav>
        </RD.Content>
      </RD.Portal>
    </RD.Root>
  );
}

export function Header() {
  const activeStage = useActiveStage();
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-ac-light-gray bg-ac-ink/95 px-5 py-4 shadow-card sm:px-8">
      <div className="flex items-center gap-4">
        <Link to="/" className="flex-shrink-0">
          <img src={assetUrl('assets/backstory-logo-lockup-dark.svg')} alt="Backstory" className="h-7 w-auto" />
        </Link>
        <div className="hidden h-8 w-px bg-ac-coral/25 sm:block" />
        <div className="hidden text-[13px] text-ac-dark-secondary sm:block">MCP starter library</div>
      </div>
      <nav aria-label="Stages" className="hidden items-center gap-1 md:flex">
        {STAGES.map((s) => (
          <StageLink key={s.id} stage={s} active={activeStage === s.id} />
        ))}
      </nav>
      <MobileMenu activeStage={activeStage} />
    </header>
  );
}
