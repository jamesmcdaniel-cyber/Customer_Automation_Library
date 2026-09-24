import { Link } from 'react-router-dom';
import { ArrowRight, Clock } from 'lucide-react';
import { SectionHero } from '../components/SectionHero';
import { CopyButton } from '../components/ui/CopyButton';
import { Button } from '../components/ui/Button';
import { NextStep } from '../components/NextStep';
import { HelpLink } from '../components/HelpLink';
import { examples, site } from '../lib/content';
import { cn } from '../lib/cn';

function Step({ n, title, children, last }) {
  return (
    <li className="relative pb-6 pl-12 last:pb-0">
      <span className="absolute left-0 top-0 grid h-8 w-8 place-items-center rounded-full bg-ac-coral/12 font-mono text-[13px] font-bold text-ac-coral-dark">
        {n}
      </span>
      {!last && <span className="absolute bottom-1 left-[15.5px] top-10 w-px bg-ac-light-gray" />}
      <h3 className="pt-1 font-display text-[15px] font-bold">{title}</h3>
      <div className="mt-1.5 text-[14px] leading-6 text-ac-dark-secondary">{children}</div>
    </li>
  );
}

export function UseIt() {
  return (
    <div className="container-page">
      <SectionHero
        eyebrow="03 · Use it"
        title="Your first 15 minutes"
        subtitle="Connect once, then try four prompts. Each one takes a few minutes and works with the data you already have."
        image="bg-04.jpg"
      />
      <div className="mx-auto max-w-4xl space-y-6">
        <section className="surface-card p-6">
          <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="font-display text-[19px] font-bold">Step 1: connect Backstory</h2>
            <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-ac-med-gray">About 5 minutes · once</span>
          </div>
          <ol>
            <Step n={1} title="Open your AI assistant's connector settings">
              In Claude or ChatGPT, go to <strong className="text-ac-dark">Settings → Connectors → Add custom connector</strong>.
            </Step>
            <Step n={2} title="Add Backstory">
              Name it <code className="rounded-md bg-ac-cream px-1.5 py-0.5 font-mono text-[0.86em] text-ac-coral-dark">Backstory</code> and paste this address:
              <div className="mt-2.5 flex items-center justify-between gap-3 rounded-lg border border-ac-light-gray bg-ac-warm-white px-4 py-3">
                <code className="min-w-0 break-all font-mono text-[13px] text-ac-dark">{site.mcpUrl}</code>
                <CopyButton text={site.mcpUrl} />
              </div>
            </Step>
            <Step n={3} title="Sign in">
              A Backstory sign-in window opens. Log in as you normally would. Your AI assistant never sees your password.
            </Step>
            <Step n={4} title="Check it worked" last>
              Ask: <em>&ldquo;What Backstory tools do you have access to?&rdquo;</em> You should see a list of Backstory tools. Stuck?{' '}
              <HelpLink k="connect" label="Connecting the Backstory MCP" />.
            </Step>
          </ol>
        </section>

        <section className="surface-card p-6">
          <div className="mb-5">
            <h2 className="font-display text-[19px] font-bold">Step 2: try these prompts, in order</h2>
            <p className="mt-1 text-[14px] text-ac-dark-secondary">Not sure where to begin? Start with the first one.</p>
          </div>
          <div className="divide-y divide-ac-light-gray">
            {examples.map((e) => (
              <div key={e.id} className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[11px] font-bold text-ac-coral-dark">0{e.order}</span>
                    <h3 className="font-display text-[15px] font-bold">{e.title}</h3>
                    {e.startHere && (
                      <span className="rounded-md bg-ac-coral px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-white">
                        Start here
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-[13.5px] leading-6 text-ac-dark-secondary">{e.helpsYou}</p>
                  <div className="mt-1 flex flex-wrap gap-3 font-mono text-[11px] text-ac-med-gray">
                    <span>For {e.whoFor.join(', ')}</span>
                    <span className="inline-flex items-center gap-1"><Clock size={11} /> {e.timeToTry}</span>
                  </div>
                </div>
                <Button as={Link} to={`/example/${e.id}`} size="sm" variant={e.startHere ? 'primary' : 'secondary'} className={cn('shrink-0 self-start sm:self-center')}>
                  Try it <ArrowRight size={14} />
                </Button>
              </div>
            ))}
          </div>
        </section>

        <NextStep text="Done all four? See what else is possible." to="/stretch-it" label="Stretch it" variant="secondary" />
      </div>
    </div>
  );
}
