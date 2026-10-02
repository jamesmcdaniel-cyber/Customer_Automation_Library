import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { SectionHero } from '../components/SectionHero';
import { Video } from '../components/Video';
import { Button } from '../components/ui/Button';
import { ExampleCard } from '../components/ExampleCard';
import { examples, site } from '../lib/content';
import { cn } from '../lib/cn';
import { STAGES } from '../lib/stages';

function Plug() {
  return (
    <div
      className="mt-6 flex flex-wrap items-center gap-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.12em]"
      aria-label="Your AI assistant connects to Backstory through MCP"
    >
      <span className="rounded-lg border border-white/30 px-3 py-2">Claude / ChatGPT</span>
      <span className="h-px w-6 bg-white/50" />
      <span className="rounded-lg bg-white px-3 py-2 text-ac-horizon-900">MCP</span>
      <span className="h-px w-6 bg-white/50" />
      <span className="rounded-lg border border-white/30 px-3 py-2">Backstory</span>
    </div>
  );
}

export function Home() {
  return (
    <div className="container-page">
      <SectionHero
        eyebrow="Backstory MCP"
        title="Ask your AI assistant about your customers, and get answers from Backstory."
        subtitle="MCP is a standard plug. It lets assistants like Claude and ChatGPT safely look things up in Backstory, so you can prep for meetings, check deal health, and draft follow-ups just by asking."
        image="meeting-bg-01.jpg"
      >
        <Plug />
        <div className="mt-7 flex flex-wrap gap-3">
          <Button as={Link} to="/get-it">
            Start here: Get it <ArrowRight size={15} />
          </Button>
          <Button as="a" href="#tour" variant="secondary" className="border-white/30 bg-transparent text-white hover:border-white">
            Take the tour
          </Button>
        </div>
      </SectionHero>

      <section id="tour" className="mb-8 scroll-mt-24">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3 px-1">
          <div>
            <div className="eyebrow mb-2">Ready to take a tour?</div>
            <h2 className="font-display text-[22px] font-bold leading-tight tracking-[-0.01em]">This is what a day in the life looks like</h2>
            <p className="mt-2 max-w-3xl text-[15px] leading-7 text-ac-dark-secondary">
              Click through an interactive tour at your own pace. When you&rsquo;re ready, there&rsquo;s a{' '}
              <Link to="/use-it#connect" className="font-medium text-ac-coral-dark hover:underline">step-by-step guide</Link> to connect
              your own assistant.
            </p>
          </div>
          <a href={site.tourUrl} target="_blank" rel="noopener" className="hidden items-center gap-1.5 text-[13.5px] font-medium text-ac-coral-dark hover:underline sm:inline-flex">
            Open the tour in a new tab <ExternalLink size={13} />
          </a>
        </div>
        {/* The tour needs room to click through, so phones get a button instead of a tiny embed. */}
        <div className="hidden sm:block">
          <Video url={site.tourUrl} title="A day in the life with Backstory MCP" />
        </div>
        <Button as="a" href={site.tourUrl} target="_blank" rel="noopener" className="sm:hidden">
          Take the tour <ExternalLink size={14} />
        </Button>
      </section>

      <section className="mb-8">
        <div className="eyebrow mb-3">Four steps, at your own pace</div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STAGES.map((s) => (
            <Link
              key={s.id}
              to={`/${s.id}`}
              className={cn(
                'group flex flex-col rounded-xl border bg-ac-card p-5 shadow-card no-underline transition-all duration-200 hover:-translate-y-0.5 hover:border-ac-coral hover:shadow-cardhover',
                s.id === 'get-it' ? 'border-ac-coral ring-1 ring-ac-coral' : 'border-ac-light-gray',
              )}
            >
              <span
                className={cn(
                  'mb-2.5 self-start rounded-md px-2 py-0.5 font-mono text-[10.5px] font-medium uppercase tracking-[0.12em]',
                  s.id === 'get-it' ? 'bg-ac-coral text-white' : 'bg-ac-coral/12 text-ac-coral-dark',
                )}
              >
                {s.id === 'get-it' ? `${s.num} · Start here` : s.num}
              </span>
              <h3 className="font-display text-[15px] font-bold leading-snug tracking-[-0.01em] text-ac-dark">{s.label}</h3>
              <p className="mt-2 flex-1 text-[13.5px] leading-6 text-ac-dark-secondary">{s.blurb}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.1em] text-ac-coral-dark">
                Go <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="eyebrow mb-3">Try it today: four prompts</div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {examples.map((e) => (
            <ExampleCard key={e.id} example={e} />
          ))}
        </div>
      </section>
    </div>
  );
}
