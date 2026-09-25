import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft, Clock, UserRound } from 'lucide-react';
import { SectionHero } from '../components/SectionHero';
import { Accordion } from '../components/ui/Accordion';
import { CopyButton } from '../components/ui/CopyButton';
import { Checklist } from '../components/Checklist';
import { NextStep } from '../components/NextStep';
import { GUIDES, findGuide } from '../data/connectGuides';
import { assetUrl, cn } from '../lib/cn';

export function PlatformLogo({ guide, className }) {
  return <img src={assetUrl(`assets/logos/${guide.logo}`)} alt="" aria-hidden className={cn('shrink-0 object-contain', className)} />;
}

function Shot({ src, alt, narrow }) {
  const url = assetUrl(`assets/connect/${src}`);
  return (
    <a href={url} target="_blank" rel="noopener" title="Open full size" className={cn('mt-3 block', narrow ? 'max-w-[200px]' : 'max-w-lg')}>
      <img src={url} alt={alt} loading="lazy" className="w-full rounded-lg border border-ac-light-gray shadow-card" />
    </a>
  );
}

function Fields({ rows }) {
  return (
    <div className="mt-3 overflow-hidden rounded-lg border border-ac-light-gray">
      <table className="w-full border-collapse text-[13.5px]">
        <tbody>
          {rows.map(([k, v]) => (
            <tr key={k} className="border-b border-ac-light-gray last:border-0">
              <th className="w-[38%] bg-ac-warm-white px-3.5 py-2.5 text-left align-top font-medium text-ac-dark">{k}</th>
              <td className="px-3.5 py-2.5 align-top">
                <div className="flex items-start justify-between gap-2">
                  <span className={cn('min-w-0 break-words', v.startsWith('http') ? 'font-mono text-[12.5px] text-ac-dark' : 'text-ac-dark-secondary')}>{v}</span>
                  {v.startsWith('http') && <CopyButton text={v} className="shrink-0" />}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Code({ label, text }) {
  return (
    <div className="mt-3 overflow-hidden rounded-lg border border-ac-light-gray">
      <div className="flex items-center justify-between gap-2 border-b border-ac-light-gray bg-ac-warm-white px-3.5 py-1.5">
        <span className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.1em] text-ac-med-gray">{label}</span>
        <CopyButton text={text} />
      </div>
      <pre className="max-h-56 overflow-auto bg-white px-3.5 py-3 font-mono text-[12px] leading-5 text-ac-dark">{text}</pre>
    </div>
  );
}

function StepItem({ n, step, last }) {
  return (
    <li className="relative pb-8 pl-12 last:pb-0">
      <span className="absolute left-0 top-0 grid h-8 w-8 place-items-center rounded-full bg-ac-coral font-mono text-[13px] font-bold text-white">{n}</span>
      {!last && <span className="absolute bottom-1 left-[15.5px] top-10 w-px bg-ac-light-gray" />}
      <h3 className="pt-1 font-display text-[16px] font-bold">{step.title}</h3>
      <p className="mt-1.5 text-[14px] leading-6 text-ac-dark-secondary">{step.body}</p>
      {step.fields && <Fields rows={step.fields} />}
      {step.code?.map((c) => <Code key={c.label} {...c} />)}
      {step.image && <Shot src={step.image} alt={step.title} narrow={step.narrow} />}
    </li>
  );
}

// Row of platform pills, so readers can jump between guides.
export function PlatformSwitcher({ current }) {
  return (
    <nav aria-label="Choose your assistant" className="flex flex-wrap gap-2">
      {GUIDES.map((g) => (
        <Link
          key={g.id}
          to={`/use-it/connect/${g.id}`}
          aria-current={g.id === current ? 'page' : undefined}
          className={cn(
            'inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[13.5px] font-medium no-underline transition-colors',
            g.id === current ? 'border-ac-coral bg-ac-coral/10 text-ac-coral-dark' : 'border-ac-light-gray bg-white text-ac-dark hover:border-ac-coral',
          )}
        >
          <PlatformLogo guide={g} className="h-4 w-4" />
          {g.name}
        </Link>
      ))}
    </nav>
  );
}

export function ConnectGuide() {
  const { platform } = useParams();
  const g = findGuide(platform);
  if (!g) return <Navigate to="/use-it#connect" replace />;

  return (
    <div className="container-page">
      <SectionHero eyebrow="03 · Use it · Connect" title={`Connect Backstory to ${g.name}`} subtitle={g.summary} image="bg-04.jpg">
        <div className="mt-5 flex flex-wrap gap-2 font-mono text-[11px] uppercase tracking-[0.1em] text-white/85">
          <span className="inline-flex items-center gap-1.5 rounded-md bg-white/10 px-2.5 py-1"><UserRound size={12} /> {g.setup}</span>
          <span className="inline-flex items-center gap-1.5 rounded-md bg-white/10 px-2.5 py-1"><Clock size={12} /> {g.time}</span>
        </div>
      </SectionHero>

      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link to="/use-it#connect" className="inline-flex items-center gap-1.5 text-[13.5px] font-medium text-ac-coral-dark no-underline hover:underline">
            <ArrowLeft size={14} /> Back to your first 15 minutes
          </Link>
          <PlatformSwitcher current={g.id} />
        </div>

        <section className="surface-card p-6">
          <div className="mb-3 flex items-center gap-3">
            <PlatformLogo guide={g} className="h-7 w-7" />
            <h2 className="font-display text-[17px] font-bold">You&rsquo;ll need</h2>
          </div>
          <Checklist items={g.need} />
        </section>

        <section className="surface-card p-6">
          <h2 className="mb-6 font-display text-[19px] font-bold">Steps</h2>
          <ol>
            {g.steps.map((s, i) => <StepItem key={s.title} n={i + 1} step={s} last={i === g.steps.length - 1} />)}
          </ol>
          <p className="mt-8 rounded-lg border border-ac-success/30 bg-ac-success/5 px-4 py-3 text-[14px] leading-6 text-ac-dark">
            <strong>Check it works:</strong> ask &ldquo;What&rsquo;s the current status of [one of your accounts]?&rdquo; and look for a
            Backstory tool call in the answer.
          </p>
        </section>

        <section>
          <h2 className="eyebrow mb-3">If something goes wrong</h2>
          <Accordion items={g.troubleshooting.map(([q, a]) => ({ value: q, title: q, content: a }))} />
        </section>

        <NextStep text="Connected? Run three prompts that prove it's working." to="/use-it#confirm" label="Confirm it works" />
      </div>
    </div>
  );
}
