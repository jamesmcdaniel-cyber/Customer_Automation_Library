import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowUp } from 'lucide-react';
import { cn } from '../lib/cn';

// A section counts as "current" once its top passes this far below the sticky header.
const ACTIVE_OFFSET = 140;

// Page body with a floating "On this page" list on the left (large screens only).
// The list is read from the page itself: every element with data-toc="Label" and an id.
export function TocLayout({ children, className }) {
  const ref = useRef(null);
  const [items, setItems] = useState([]);
  const [active, setActive] = useState(null);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const els = [...ref.current.querySelectorAll('[data-toc][id]')];
    setItems(els.map((el) => ({ id: el.id, label: el.dataset.toc })));

    const onScroll = () => {
      let current = els[0]?.id ?? null;
      for (const el of els) if (el.getBoundingClientRect().top <= ACTIVE_OFFSET) current = el.id;
      // A short last section never reaches the top, so the bottom of the page selects it.
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      if (atBottom && els.length) current = els[els.length - 1].id;
      setActive(current);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [pathname]);

  // Replace rather than push, so "Back" still leaves the page instead of stepping through sections.
  const jump = (e, id) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView();
    navigate({ hash: id }, { replace: true });
  };

  return (
    <div className="lg:grid lg:grid-cols-[188px_minmax(0,1fr)] lg:gap-10 xl:gap-14">
      <nav aria-label="On this page" className="hidden lg:block">
        <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pb-6">
          <div className="eyebrow mb-3">On this page</div>
          <ul className="border-l border-ac-light-gray">
            {items.map((it) => (
              <li key={it.id}>
                <a
                  href={`#${it.id}`}
                  onClick={(e) => jump(e, it.id)}
                  aria-current={active === it.id ? 'location' : undefined}
                  className={cn(
                    '-ml-px block border-l-2 py-1.5 pl-3.5 text-[13.5px] leading-5 no-underline transition-colors',
                    active === it.id
                      ? 'border-ac-coral font-medium text-ac-coral-dark'
                      : 'border-transparent text-ac-dark-secondary hover:border-ac-coral-light hover:text-ac-dark',
                  )}
                >
                  {it.label}
                </a>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0 })}
            className="mt-4 inline-flex items-center gap-1.5 pl-4 font-mono text-[11px] font-medium uppercase tracking-[0.1em] text-ac-med-gray transition-colors hover:text-ac-coral-dark"
          >
            <ArrowUp size={12} /> Back to top
          </button>
        </div>
      </nav>
      <div ref={ref} className={cn('min-w-0', className)}>
        {children}
      </div>
    </div>
  );
}
