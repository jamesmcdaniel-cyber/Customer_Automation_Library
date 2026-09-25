import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { SectionHero } from '../components/SectionHero';
import { Video } from '../components/Video';
import { Button } from '../components/ui/Button';
import { ExampleCard } from '../components/ExampleCard';
import { examples, site, startHere } from '../lib/content';
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
          <Button as={Link} to={`/example/${startHere.id}`}>
            Start here: {startHere.title} <ArrowRight size={15} />
          </Button>
          <Button as={Link} to="/get-it" variant="secondary" className="border-white/30 bg-transparent text-white hover:border-white">
            What is MCP?
          </Button>
        </div>
      </SectionHero>

      <div className="mb-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-center">
        <div className="px-1">
          <div className="eyebrow mb-2">Watch first</div>
          <h2 className="font-display text-[22px] font-bold leading-tight tracking-[-0.01em]">Connect Backstory to Claude and ChatGPT</h2>
          <p className="mt-3 text-[15px] leading-7 text-ac-dark-secondary">
            A walkthrough of adding the Backstory MCP to Claude and ChatGPT, signing in, and asking your first question. Using
            Copilot, Gemini, or n8n? There&rsquo;s a <Link to="/use-it#connect" className="font-medium text-ac-coral-dark hover:underline">step-by-step guide for each</Link>.
          </p>
        </div>
        <Video url={site.overviewVideoUrl} title="Connect Backstory to Claude and ChatGPT" />
      </div>

      <section className="mb-8">
        <div className="eyebrow mb-3">Four steps, at your own pace</div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STAGES.map((s) => (
            <Link
              key={s.id}
              to={`/${s.id}`}
              className="group flex flex-col rounded-xl border border-ac-light-gray bg-ac-card p-5 shadow-card no-underline transition-all duration-200 hover:-translate-y-0.5 hover:border-ac-coral hover:shadow-cardhover"
            >
              <span className="mb-2.5 self-start rounded-md bg-ac-coral/12 px-2 py-0.5 font-mono text-[10.5px] font-medium uppercase tracking-[0.12em] text-ac-coral-dark">
                {s.num}
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
