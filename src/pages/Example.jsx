import { Link, Navigate, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { AlertTriangle, ArrowLeft, Clock, ExternalLink } from 'lucide-react';
import { SectionHero } from '../components/SectionHero';
import { Video } from '../components/Video';
import { Tabs } from '../components/ui/Tabs';
import { CopyButton } from '../components/ui/CopyButton';
import { Checklist } from '../components/Checklist';
import { NextStep } from '../components/NextStep';
import { examples, findExample } from '../lib/content';

function PromptPanel({ e }) {
  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-xl border border-ac-light-gray">
        <div className="flex items-center justify-between gap-3 border-b border-ac-light-gray bg-ac-warm-white px-4 py-2.5">
          <span className="eyebrow">Paste into Claude or ChatGPT</span>
          <CopyButton text={e.prompt} variant="primary" label="Copy prompt" />
        </div>
        <p className="px-4 py-4 text-[16px] leading-7 text-ac-dark">{e.prompt}</p>
      </div>
      {e.caveat && (
        <div className="flex gap-2.5 rounded-xl border border-[#F3DDB0] bg-[#FFF7E6] px-4 py-3 text-[13.5px] leading-6 text-[#7A5200]">
          <AlertTriangle size={16} className="mt-1 shrink-0" />
          <span>{e.caveat}</span>
        </div>
      )}
    </div>
  );
}

function VariationsPanel({ e }) {
  return (
    <ul className="space-y-2">
      {e.variations.map((v) => (
        <li key={v} className="flex items-start justify-between gap-3 rounded-lg border border-ac-light-gray bg-ac-warm-white px-4 py-3">
          <span className="min-w-0 text-[14px] leading-6 text-ac-dark-secondary">{v}</span>
          <CopyButton text={v} className="shrink-0" />
        </li>
      ))}
    </ul>
  );
}

function ResponsePanel({ e }) {
  return (
    <div>
      <div className="relative rounded-xl border border-ac-light-gray bg-ac-warm-white p-5">
        <span className="absolute -top-2.5 left-4 rounded-md border border-ac-light-gray bg-white px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-ac-med-gray">
          Example response · fictional account
        </span>
        <div className="response-md overflow-x-auto pt-1">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{e.expectedOutput}</ReactMarkdown>
        </div>
      </div>
      <p className="mt-2.5 text-[13px] text-ac-med-gray">Your answer will reflect your own accounts, and the wording will vary each time.</p>
    </div>
  );
}

function Fact({ label, children }) {
  return (
    <div>
      <div className="eyebrow mb-1.5">{label}</div>
      <div className="text-[14px] text-ac-dark">{children}</div>
    </div>
  );
}

export function Example() {
  const { id } = useParams();
  const e = findExample(id);
  if (!e) return <Navigate to="/use-it" replace />;
  const idx = examples.indexOf(e);
  const next = examples[idx + 1];

  return (
    <div className="container-page">
      <Link to="/use-it" className="mb-4 inline-flex items-center gap-1.5 font-mono text-[12px] font-medium uppercase tracking-[0.08em] text-ac-coral-dark no-underline hover:text-ac-coral">
        <ArrowLeft size={14} /> All examples
      </Link>
      <SectionHero
        eyebrow={`03 · Use it · Example ${e.order} of ${examples.length}`}
        title={e.title}
        subtitle={e.helpsYou}
        image="meeting-bg-05.jpg"
      >
        <div className="mt-5 flex flex-wrap items-center gap-2">
          {e.startHere && (
            <span className="rounded-md bg-white px-2 py-0.5 font-mono text-[10.5px] font-medium uppercase tracking-[0.12em] text-ac-horizon-900">Start here</span>
          )}
          {e.whoFor.map((w) => (
            <span key={w} className="rounded-md border border-white/25 px-2 py-0.5 font-mono text-[10.5px] font-medium uppercase tracking-[0.12em] text-white/90">{w}</span>
          ))}
          <span className="inline-flex items-center gap-1 font-mono text-[11px] text-white/75"><Clock size={12} /> {e.timeToTry}</span>
        </div>
      </SectionHero>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 space-y-6">
          <Video url={e.videoUrl} title={`${e.title} walkthrough`} />
          <section className="surface-card p-6">
            <Tabs
              tabs={[
                { value: 'prompt', label: 'Prompt', content: <PromptPanel e={e} /> },
                { value: 'variations', label: 'Variations', content: <VariationsPanel e={e} /> },
                { value: 'response', label: 'Example response', content: <ResponsePanel e={e} /> },
              ]}
            />
          </section>
          {next ? (
            <NextStep text={<>Next: <strong>{next.title}</strong></>} to={`/example/${next.id}`} label="Next example" />
          ) : (
            <NextStep text="That's all four. Want this to run on its own?" to="/stretch-it" label="Stretch it" />
          )}
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="surface-card space-y-5 p-6">
            <Fact label="Who it's for">{e.whoFor.join(', ')}</Fact>
            <Fact label="Time to try">{e.timeToTry}</Fact>
          </div>
          <div className="surface-card p-6">
            <div className="eyebrow mb-4">Before you start</div>
            <Checklist items={e.checklist} />
            <Link to="/use-it" className="mt-4 inline-block text-[13.5px] font-medium text-ac-coral-dark hover:underline">
              Not connected yet? Connect in 5 minutes
            </Link>
          </div>
          <div className="surface-card p-6">
            <div className="eyebrow mb-2">Make it automatic</div>
            <a href={e.stretchLink} target="_blank" rel="noopener" className="inline-flex items-start gap-1.5 text-[14px] font-medium leading-6 text-ac-coral-dark hover:underline">
              {e.stretchLabel} <ExternalLink size={13} className="mt-1.5 shrink-0" />
            </a>
          </div>
        </aside>
      </div>
    </div>
  );
}
