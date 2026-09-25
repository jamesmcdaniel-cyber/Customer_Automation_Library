import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { SectionHero } from '../components/SectionHero';
import { Tabs } from '../components/ui/Tabs';
import { CopyButton } from '../components/ui/CopyButton';
import { NextStep } from '../components/NextStep';
import { swaps } from '../lib/content';
import { cn } from '../lib/cn';

// One colour per swap pattern, matching the three bars in the MCP 101 deck.
export const PATTERN_STYLE = {
  ask: { bar: 'bg-ac-coral', pill: 'border-ac-coral/50 text-ac-coral-dark' },
  pull: { bar: 'bg-[#4E9E73]', pill: 'border-[#4E9E73]/60 text-[#2F7A52]' },
  specific: { bar: 'bg-[#C4552B]', pill: 'border-[#C4552B]/50 text-[#A2431F]' },
};
const HIGHLIGHT = { filter: 'decoration-[#99C1D1]', signal: 'decoration-[#F2B8A0]', window: 'decoration-[#9FD8B8]' };
const TONE = {
  good: 'bg-ac-success/10 text-ac-success',
  gap: 'bg-[#C4552B]/10 text-[#A2431F]',
  partial: 'bg-ac-warning/10 text-ac-warning',
  unknown: 'bg-ac-cream text-ac-dark-secondary',
};

const patternName = (id) => swaps.patterns.find((p) => p.id === id)?.name;

export function PatternPill({ id }) {
  return (
    <span className={cn('whitespace-nowrap rounded-full border px-2.5 py-0.5 font-mono text-[10.5px] font-medium', PATTERN_STYLE[id].pill)}>
      {patternName(id)}
    </span>
  );
}

function Prompt({ text, highlights }) {
  if (!highlights) return <>&ldquo;{text}&rdquo;</>;
  const parts = [];
  let rest = text;
  for (const h of highlights) {
    const i = rest.indexOf(h.text);
    if (i === -1) continue;
    parts.push(rest.slice(0, i));
    parts.push(
      <span key={h.text} className={cn('underline decoration-[3px] underline-offset-[6px]', HIGHLIGHT[h.kind])}>
        {h.text}
      </span>,
    );
    rest = rest.slice(i + h.text.length);
  }
  parts.push(rest);
  return <>&ldquo;{parts}&rdquo;</>;
}

function Mock({ mock }) {
  return (
    <div className="mt-3 rounded-lg border border-ac-light-gray bg-white p-4">
      <div className="mb-2.5 flex items-baseline justify-between gap-3">
        <span className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.12em] text-ac-dark-secondary">{mock.title}</span>
        <span className="font-mono text-[9.5px] uppercase tracking-[0.12em] text-ac-med-gray">Mock data</span>
      </div>
      {mock.caption && <div className="mb-2 rounded-md bg-ac-horizon-700 px-3 py-1.5 text-[12.5px] text-white">{mock.caption} →</div>}
      {mock.type === 'text' && (
        <div className="text-[13px] leading-5">
          <div className="font-semibold">Subject: {mock.subject}</div>
          <p className="mt-1 text-ac-dark-secondary">{mock.body}</p>
        </div>
      )}
      {mock.type === 'rows' && (
        <div className="divide-y divide-ac-light-gray">
          {mock.rows.map((r, i) => (
            <div key={i} className="flex items-center gap-3 py-1.5 text-[12.5px]">
              {r.stat && <span className="w-14 shrink-0 font-display text-[16px] text-ac-dark">{r.stat}</span>}
              {r.sub && r.sub.length === 1 && <span className="w-3 shrink-0 font-mono text-ac-med-gray">{r.sub}</span>}
              <span className="min-w-0 flex-1">
                <span className="font-medium text-ac-dark">{r.label}</span>
                {r.sub && r.sub.length > 1 && <span className="ml-1.5 text-ac-med-gray">{r.sub}</span>}
                {r.value && <span className="block text-ac-dark-secondary sm:hidden">{r.value}</span>}
              </span>
              {r.value && <span className="hidden min-w-0 flex-[1.3] text-ac-dark-secondary sm:block">{r.value}</span>}
              {r.tag && <span className={cn('shrink-0 rounded-full px-2 py-0.5 font-mono text-[10px]', TONE[r.tone])}>{r.tag}</span>}
            </div>
          ))}
        </div>
      )}
      {mock.type === 'bars' && (
        <div className="space-y-1.5">
          {mock.rows.map((r) => (
            <div key={r.label} className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)_auto] items-center gap-3 text-[12.5px]">
              <span className="truncate font-medium">{r.label}</span>
              <span className="h-2.5 overflow-hidden rounded-full bg-ac-cream">
                <span className="block h-full rounded-full bg-ac-horizon-700" style={{ width: `${r.pct}%` }} />
              </span>
              <span className="whitespace-nowrap font-mono text-[11px] text-ac-dark-secondary">{r.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function SwapCard({ s, n }) {
  return (
    <div className="surface-card flex flex-col overflow-hidden">
      <div className={cn('h-1', PATTERN_STYLE[s.pattern].bar)} />
      <div className="flex flex-1 flex-col p-5">
        {s.moment && <div className="mb-1 font-mono text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ac-coral-dark">{s.moment}</div>}
        <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
          <h4 className="font-display text-[17px] font-bold leading-snug">
            {n && <span className="mr-2 font-mono text-[11px] font-medium text-ac-med-gray">{n}</span>}
            {s.title}
          </h4>
          <PatternPill id={s.pattern} />
        </div>
        <div className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[#C4552B]">Instead of this</div>
        <p className="mt-1 text-[14px] leading-6 text-ac-dark-secondary">{s.instead}</p>
        <div className="mt-3 flex-1 rounded-lg bg-ac-horizon-700 p-4 text-white">
          <div className="mb-1.5 flex items-center justify-between gap-3">
            <span className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.14em] text-white/70">Do this</span>
            <CopyButton text={s.ask} variant="onDark" />
          </div>
          <p className="text-[15.5px] italic leading-7">
            <Prompt text={s.ask} highlights={s.highlights} />
          </p>
        </div>
        {s.highlights && (
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11.5px] text-ac-dark-secondary">
            <span className="inline-flex items-center gap-1.5"><span className="h-[3px] w-4 bg-[#99C1D1]" /> Filter</span>
            <span className="inline-flex items-center gap-1.5"><span className="h-[3px] w-4 bg-[#F2B8A0]" /> Signal</span>
            <span className="inline-flex items-center gap-1.5"><span className="h-[3px] w-4 bg-[#9FD8B8]" /> Time window</span>
          </div>
        )}
        {s.mock && <Mock mock={s.mock} />}
        <p className="mt-3 text-[13.5px] leading-6 text-ac-dark">
          <span className="mr-2 font-mono text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ac-coral-dark">Why</span>
          {s.why}
        </p>
        {s.note && <p className="mt-1.5 text-[12.5px] leading-5 text-ac-med-gray">{s.note}</p>}
      </div>
    </div>
  );
}

function Role({ role }) {
  let n = 0;
  return (
    <div className="space-y-8">
      <p className="text-[15px] text-ac-dark-secondary">{role.tagline}</p>
      {role.groups.map((g, gi) => (
        <section key={g.title}>
          <div className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="font-mono text-[11px] font-semibold text-ac-coral-dark">0{gi + 1}</span>
            <h3 className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-ac-dark">{g.title}</h3>
            <span className="text-[14px] text-ac-dark-secondary">· {g.heading}</span>
          </div>
          <div
            className={cn(
              'grid gap-4',
              g.swaps.length === 2 && 'md:grid-cols-2',
              g.swaps.length === 3 && 'md:grid-cols-2 xl:grid-cols-3',
              g.swaps.length === 4 && 'md:grid-cols-2',
            )}
          >
            {g.swaps.map((s) => {
              n += 1;
              return <SwapCard key={s.title} s={s} n={String(n).padStart(2, '0')} />;
            })}
          </div>
        </section>
      ))}
    </div>
  );
}

export function PatternBars() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {swaps.patterns.map((p, i) => (
        <div key={p.id}>
          <div className={cn('mb-3 h-1 rounded-full', PATTERN_STYLE[p.id].bar)} />
          <div className="font-mono text-[11px] text-ac-coral-dark">0{i + 1}</div>
          <h3 className="mt-0.5 font-display text-[17px] font-bold">{p.name}</h3>
          <p className="mt-1 text-[13.5px] leading-6 text-ac-dark-secondary">{p.desc}</p>
        </div>
      ))}
    </div>
  );
}

export function Swaps() {
  const total = swaps.roles.reduce((a, r) => a + r.groups.reduce((b, g) => b + g.swaps.length, 0), 0);
  const countFor = (r) => r.groups.reduce((b, g) => b + g.swaps.length, 0);
  return (
    <div className="container-page">
      <Link to="/use-it" className="mb-4 inline-flex items-center gap-1.5 font-mono text-[12px] font-medium uppercase tracking-[0.08em] text-ac-coral-dark no-underline hover:text-ac-coral">
        <ArrowLeft size={14} /> First 15 minutes
      </Link>
      <SectionHero
        eyebrow="03 · Use it · Swap cards"
        title="Instead of this, do this"
        subtitle={`${total} swaps across three roles for the habits that keep Claude and Backstory from doing their best work.`}
        image="bg-04.jpg"
      />
      <div className="mx-auto max-w-6xl space-y-10">
        <section className="surface-card p-6">
          <div className="eyebrow mb-2">The pattern</div>
          <h2 className="max-w-3xl font-display text-[22px] font-bold leading-tight tracking-[-0.01em]">
            People keep their old habits and <em className="font-normal">bolt Claude onto the end of them.</em>
          </h2>
          <p className="mb-6 mt-2 text-[14px] text-ac-dark-secondary">Every card in this set applies one of three swaps.</p>
          <PatternBars />
        </section>

        <section className="surface-card p-6">
          <Tabs
            tabs={swaps.roles.map((r) => ({
              value: r.id,
              label: `${r.name} · ${countFor(r)}`,
              content: <Role role={r} />,
            }))}
          />
        </section>

        <section className="rounded-xl border border-ac-horizon-100 bg-ac-horizon-50 px-6 py-8">
          <div className="eyebrow mb-2 !text-ac-coral-dark">Every swap, one habit</div>
          <p className="font-display text-[26px] font-bold leading-tight tracking-[-0.01em] sm:text-[30px]">
            Name the tool. Scope the ask. <em className="font-normal text-ac-coral-dark">Ask for receipts.</em>
          </p>
          <p className="mt-3 text-[13px] text-ac-dark-secondary">
            Accounts, reps and deals shown are mock examples: Vantage Retail, Halden Freight, Corvia Health.
          </p>
        </section>

        <NextStep text="Up next: from prompt to playbook." to="/stretch-it" label="Stretch it" />
      </div>
    </div>
  );
}
