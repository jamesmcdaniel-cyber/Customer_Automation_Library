import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowRight, Clock, UserRound } from 'lucide-react';
import { SectionHero } from '../components/SectionHero';
import { BackLink } from '../components/BackLink';
import { Accordion } from '../components/ui/Accordion';
import { CopyButton } from '../components/ui/CopyButton';
import { HelpLink } from '../components/HelpLink';
import { Checklist } from '../components/Checklist';
import { NextStep } from '../components/NextStep';
import { ResourceButton } from '../components/Resource';
import { GUIDES, findGuide, guideUrl } from '../data/connectGuides';
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

export function Code({ label, text }) {
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

// One card per connect guide: logo, who sets it up, how long, and how many steps.
export function GuideCards() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {GUIDES.map((g) => (
        <Link
          key={g.id}
          to={`/use-it/connect/${g.id}`}
          className="group flex items-start gap-3.5 rounded-xl border border-ac-light-gray bg-white p-4 no-underline transition-all duration-200 hover:-translate-y-0.5 hover:border-ac-coral hover:shadow-cardhover"
        >
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-ac-light-gray bg-ac-warm-white">
            <PlatformLogo guide={g} className="h-6 w-6" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="flex items-center justify-between gap-2">
              <span className="font-display text-[15px] font-bold text-ac-dark">{g.name}</span>
              <ArrowRight size={15} className="shrink-0 text-ac-coral-dark transition-transform group-hover:translate-x-0.5" />
            </span>
            <span className="mt-0.5 block text-[13px] leading-5 text-ac-dark-secondary">{g.setup} · {g.time.toLowerCase()} · {g.steps.length} steps</span>
          </span>
        </Link>
      ))}
    </div>
  );
}

// Row of platform pills, so readers can jump between guides.
export function PlatformSwitcher({ current, base = '/use-it/connect' }) {
  return (
    <nav aria-label="Choose your assistant" className="flex flex-wrap gap-2">
      {GUIDES.map((g) => (
        <Link
          key={g.id}
          to={`${base}/${g.id}`}
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

// What you need, the steps, and troubleshooting: shared by the site page and the standalone page.
// `pdfAction` is how the PDF version opens: in the resource window on the site, as a file elsewhere.
export function GuideContent({ g, pdfAction }) {
  return (
    <>
      <section className="surface-card p-6">
        <div className="mb-3 flex items-center gap-3">
          <PlatformLogo guide={g} className="h-7 w-7" />
          <h2 className="font-display text-[17px] font-bold">You&rsquo;ll need</h2>
        </div>
        <Checklist items={g.need} />
      </section>

      <section className="surface-card p-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-display text-[19px] font-bold">Steps</h2>
          {pdfAction}
        </div>
        <ol>
          {g.steps.map((s, i) => <StepItem key={s.title} n={i + 1} step={s} last={i === g.steps.length - 1} />)}
        </ol>
        <p className="mt-8 rounded-lg border border-ac-success/30 bg-ac-success/5 px-4 py-3 text-[14px] leading-6 text-ac-dark">
          <strong>Check it works:</strong> ask &ldquo;What&rsquo;s the current status of [one of your accounts]?&rdquo; and look for a
          Backstory tool call in the answer.
        </p>
      </section>

      <section>
        <h2 className="mb-4 font-display text-[19px] font-bold">If something goes wrong</h2>
        <Accordion items={g.troubleshooting.map(([q, a]) => ({ value: q, title: q, content: a }))} />
      </section>
    </>
  );
}

export function ConnectGuide() {
  const { platform } = useParams();
  const g = findGuide(platform);
  if (!g) return <Navigate to="/use-it#connect" replace />;

  return (
    <div className="container-page">
      <SectionHero eyebrow="03 · Use it · Connect" title={`Connect Backstory to ${g.name}`} subtitle={g.summary} image="bg-04.jpg">
        <div className="flex flex-wrap gap-2 font-mono text-[11px] uppercase tracking-[0.1em] text-white/85">
          <span className="inline-flex items-center gap-1.5 rounded-md bg-white/10 px-2.5 py-1"><UserRound size={12} /> {g.setup}</span>
          <span className="inline-flex items-center gap-1.5 rounded-md bg-white/10 px-2.5 py-1"><Clock size={12} /> {g.time}</span>
        </div>
      </SectionHero>

      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <BackLink to="/use-it#connect" label="Back to your first 15 minutes" className="text-[13.5px] font-medium text-ac-coral-dark hover:underline" />
          <PlatformSwitcher current={g.id} />
        </div>

        <GuideContent g={g} pdfAction={g.pdf && <ResourceButton id={g.pdf} label="Open the PDF guide" />} />

        <p className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[13.5px] text-ac-dark-secondary">
          <strong className="text-ac-dark">Share this guide:</strong>
          <a href={`/guides/${g.id}`} target="_blank" rel="noopener" className="font-medium text-ac-coral-dark hover:underline">Standalone page</a>
          <CopyButton text={guideUrl(g.id)} label="Copy link" />
          <HelpLink k="connect" label="Help Center article" />
        </p>

        <NextStep text="Connected? Run three prompts that prove it's working." to="/use-it#confirm" label="Confirm it works" />
      </div>
    </div>
  );
}
