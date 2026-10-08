import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { SectionHero } from '../components/SectionHero';
import { Button } from '../components/ui/Button';
import { Tabs } from '../components/ui/Tabs';
import { TocLayout } from '../components/PageToc';
import { SectionHeading } from '../components/SectionHeading';
import { ResourceCard } from '../components/ResourceKit';
import { HelpLink } from '../components/HelpLink';
import { NextStep } from '../components/NextStep';
import { questions, resources, site, swaps } from '../lib/content';
import { STAGES } from '../lib/stages';
import { KindCard, questionCount } from './Questions';
import { PatternBars, SwapCard, swapCount } from './Swaps';
import { GuideCards } from './ConnectGuide';

// One card per pattern, from the account executive set.
const previewSwaps = swaps.roles[0].groups.flatMap((g) => g.swaps).slice(0, 3);

const JUMPS = [
  ['questions', 'Questions that work'],
  ['swaps', 'Swap cards'],
  ['guides', 'Connect guides'],
  ['library', 'Leave-behinds'],
  ['help', 'Help'],
];

// A card that links to a page on this site.
export function LinkCard({ to, kicker, title, body }) {
  return (
    <Link
      to={to}
      className="group flex flex-col rounded-xl border border-ac-light-gray bg-ac-card p-5 shadow-card no-underline transition-all duration-200 hover:-translate-y-0.5 hover:border-ac-coral hover:shadow-cardhover"
    >
      <span className="mb-2.5 self-start rounded-md bg-ac-coral/12 px-2 py-0.5 font-mono text-[10.5px] font-medium uppercase tracking-[0.12em] text-ac-coral-dark">
        {kicker}
      </span>
      <h3 className="font-display text-[17px] font-bold leading-snug text-ac-dark">{title}</h3>
      <p className="mt-1.5 flex-1 text-[14px] leading-6 text-ac-dark-secondary">{body}</p>
      <span className="mt-4 inline-flex items-center gap-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.1em] text-ac-coral-dark">
        Open <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}

function ExtLink({ href, children }) {
  return (
    <a href={href} target="_blank" rel="noopener" className="inline-flex items-center gap-1.5 font-medium text-ac-coral-dark hover:underline">
      {children} <ExternalLink size={13} />
    </a>
  );
}

export function Resources() {
  return (
    <div className="container-page">
      <SectionHero
        eyebrow="Go deeper"
        title="Additional resources"
        subtitle="The references people come back to: tested prompts, swap cards, setup guides, and every leave-behind from the four stages, in one place."
        section="resources"
      >
        <div className="flex flex-wrap gap-2">
          {JUMPS.map(([id, label]) => (
            <a
              key={id}
              href={`#${id}`}
              className="rounded-lg border border-white/25 bg-ac-horizon-900/40 px-3 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.1em] text-white no-underline transition-colors hover:border-white/60"
            >
              {label}
            </a>
          ))}
        </div>
      </SectionHero>

      <TocLayout className="space-y-16">
        <section id="questions" data-toc="Three kinds of questions">
          <SectionHeading
            title="Three kinds of questions"
            intro="You never pick a Backstory tool. Your AI tool does that. What helps is knowing which questions work, and where each one stops."
            action={
              <Button as={Link} to="/resources/questions" variant="secondary" size="sm">
                See all {questionCount} tested prompts <ArrowRight size={14} />
              </Button>
            }
          />
          <div className="grid gap-4 md:grid-cols-3">
            {questions.kinds.map((k, i) => (
              <KindCard key={k.id} kind={k} n={i + 1} />
            ))}
          </div>
        </section>

        <section id="swaps" data-toc="Instead of this, do this">
          <SectionHeading
            title="Instead of this, do this"
            intro="People keep their old habits and bolt Claude onto the end of them. Every swap applies one of three shifts."
            action={
              <Button as={Link} to="/resources/swaps" variant="secondary" size="sm">
                See all {swapCount} swaps <ArrowRight size={14} />
              </Button>
            }
          />
          <div className="surface-card p-6">
            <PatternBars />
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {previewSwaps.map((s) => (
              <SwapCard key={s.title} s={s} />
            ))}
          </div>
        </section>

        <section id="guides" data-toc="Connect guides">
          <SectionHeading
            title="Connect guides"
            intro="Step-by-step setup for each AI tool, with screenshots. Every guide also has a standalone page to share with whoever sets it up."
            action={
              <Button as="a" href="/guides" target="_blank" rel="noopener" variant="secondary" size="sm">
                Standalone guides <ExternalLink size={13} />
              </Button>
            }
          />
          <GuideCards />
        </section>

        <section id="library" data-toc="Leave-behind library">
          <SectionHeading
            title="Leave-behind library"
            intro="Every guide, deck, and tour from the four stages, for training, refreshers, and adoption. Select any one to open it right here."
          />
          <div className="rounded-xl border border-ac-horizon-100 bg-ac-horizon-50 p-6">
            <Tabs
              tabs={STAGES.map((s) => ({
                value: s.id,
                label: `${s.num} · ${s.label} · ${resources[s.id].length}`,
                content: (
                  <div className="grid gap-4 md:grid-cols-2">
                    {resources[s.id].map((r) => (
                      <ResourceCard key={r.title} r={r} />
                    ))}
                  </div>
                ),
              }))}
            />
          </div>
        </section>

        <section id="help" data-toc="Help and support">
          <SectionHeading title="Help and support" />
          <ul className="surface-card space-y-2.5 p-6 text-[14px]">
            <li><HelpLink k="connect" label="Connecting the Backstory MCP" /></li>
            <li><ExtLink href={site.support.helpCenter}>Backstory Help Center</ExtLink></li>
            <li><ExtLink href={site.mcpReferenceUrl}>Technical reference: MCP tools and limits</ExtLink></li>
            <li><ExtLink href={site.apiDocsUrl}>API reference</ExtLink></li>
            <li><ExtLink href={site.fullLibraryUrl}>The full automation library</ExtLink></li>
            <li>
              Technical support:{' '}
              <a href={`mailto:${site.support.email}`} className="font-medium text-ac-coral-dark hover:underline">{site.support.email}</a>
              <span className="text-ac-dark-secondary">, or your Backstory CSM for rollout and new use cases</span>
            </li>
          </ul>
        </section>

        <NextStep text="New here? Start at the beginning." to="/get-it" label="Get it" variant="secondary" />
      </TocLayout>
    </div>
  );
}
