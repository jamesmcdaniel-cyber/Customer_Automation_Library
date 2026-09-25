import { Link } from 'react-router-dom';
import { ArrowRight, Check, Clock, X } from 'lucide-react';
import { SectionHero } from '../components/SectionHero';
import { CopyButton } from '../components/ui/CopyButton';
import { Button } from '../components/ui/Button';
import { NextStep } from '../components/NextStep';
import { HelpLink } from '../components/HelpLink';
import { Screenshot } from '../components/Screenshot';
import { examples, site, swaps } from '../lib/content';
import { PatternBars, SwapCard } from './Swaps';

// One card per pattern, from the account executive set.
const previewSwaps = swaps.roles[0].groups.flatMap((g) => g.swaps).slice(0, 3);
const swapCount = swaps.roles.reduce((a, r) => a + r.groups.reduce((b, g) => b + g.swaps.length, 0), 0);

const PHASES = [
  { id: 'connect', time: '0–5 min', label: 'Connect' },
  { id: 'confirm', time: '5–8 min', label: 'Confirm' },
  { id: 'tell', time: '8–10 min', label: 'Tell' },
  { id: 'decide', time: '10–15 min', label: 'Decide' },
];

const CONFIRM = [
  { prompt: 'What meetings did I have with Nimbus Robotics in the last 30 days?', proves: 'It can see your captured activity.', outcome: 'Meeting prep' },
  { prompt: 'Who at Nimbus Robotics is most engaged with us right now, and who has gone quiet?', proves: 'It knows the people, not just the account.', outcome: 'Relationship coverage' },
  { prompt: 'What are the open risks and agreed next steps on the Nimbus Robotics deal?', proves: 'It reads deal context you’d otherwise dig for.', outcome: 'Deal risk' },
];

const REAL = [
  'A tool step appears in the conversation, such as “Used Backstory” or a named tool like get_account_status. You can expand it to see what came back.',
  'The answer names specific people, dates, and meetings from your account.',
  'Ask “which records did you use?” and it can list them.',
];
const GUESS = [
  'No tool step appears; the answer arrives instantly.',
  'Generic advice that would fit any company (“build rapport with stakeholders”).',
  'No names, dates, or numbers you recognize.',
];


function Phase({ id, time, label, title, children }) {
  return (
    <section id={id} className="surface-card scroll-mt-24 p-6">
      <div className="mb-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="rounded-md bg-ac-coral px-2 py-0.5 font-mono text-[11px] font-semibold text-white">{time}</span>
        <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-ac-coral-dark">{label}</span>
      </div>
      <h2 className="mb-4 font-display text-[19px] font-bold">{title}</h2>
      {children}
    </section>
  );
}

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
  const shots = site.connectScreenshots || [];
  return (
    <div className="container-page">
      <SectionHero
        eyebrow="03 · Use it"
        title="Your first 15 minutes"
        subtitle="By minute 15 you'll have an answer in 30 seconds that you couldn't have gotten without Backstory. Connect, confirm it's working, learn to tell a real answer from a guess, then move from questions to decisions."
        image="bg-04.jpg"
      >
        <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {PHASES.map((p) => (
            <a key={p.id} href={`#${p.id}`} className="rounded-xl border border-white/20 bg-ac-horizon-900/40 px-4 py-3 text-white no-underline transition-colors hover:border-white/50">
              <div className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-white/70">{p.time}</div>
              <div className="mt-0.5 font-display text-[15px] font-bold">{p.label}</div>
            </a>
          ))}
        </div>
      </SectionHero>

      <div className="mx-auto max-w-4xl space-y-6">
        <Phase {...PHASES[0]} title="Connect Backstory to your assistant">
          <ol>
            <Step n={1} title="Open your AI assistant's connector settings">
              In Claude or ChatGPT, go to <strong className="text-ac-dark">Settings → Connectors → Add custom connector</strong>.
              <Screenshot src={shots[0]} alt="the connector settings screen" />
            </Step>
            <Step n={2} title="Add Backstory">
              Name it <code className="rounded-md bg-ac-cream px-1.5 py-0.5 font-mono text-[0.86em] text-ac-coral-dark">Backstory</code> and paste this address:
              <div className="mt-2.5 flex items-center justify-between gap-3 rounded-lg border border-ac-light-gray bg-ac-warm-white px-4 py-3">
                <code className="min-w-0 break-all font-mono text-[13px] text-ac-dark">{site.mcpUrl}</code>
                <CopyButton text={site.mcpUrl} />
              </div>
              <Screenshot src={shots[1]} alt="the Add connector form filled in" />
            </Step>
            <Step n={3} title="Sign in">
              A Backstory sign-in window opens. Log in as you normally would. Your AI assistant never sees your password.
              <Screenshot src={shots[2]} alt="the Backstory sign-in window" />
            </Step>
            <Step n={4} title="See what it can pull" last>
              Ask: <em>&ldquo;What Backstory tools do you have access to?&rdquo;</em> You&rsquo;ll see the list of drawers it can
              open: accounts, activity, deal context, people, and precedents. Stuck? <HelpLink k="connect" label="Connecting the Backstory MCP" />.
              <Screenshot src={shots[3]} alt="the list of Backstory tools in the chat" />
            </Step>
          </ol>
        </Phase>

        <Phase {...PHASES[1]} title="Three prompts that prove it's working">
          <p className="mb-4 text-[14px] leading-6 text-ac-dark-secondary">Swap in one of your own accounts for Nimbus Robotics.</p>
          <div className="space-y-3">
            {CONFIRM.map((c, i) => (
              <div key={i} className="rounded-xl border border-ac-light-gray">
                <div className="flex items-start justify-between gap-3 px-4 py-3">
                  <p className="min-w-0 text-[15px] leading-6 text-ac-dark">{c.prompt}</p>
                  <CopyButton text={c.prompt} className="shrink-0" />
                </div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-ac-light-gray bg-ac-warm-white px-4 py-2 text-[12.5px] text-ac-dark-secondary">
                  <span className="rounded-md bg-ac-coral/12 px-2 py-0.5 font-mono text-[10.5px] font-medium uppercase tracking-[0.1em] text-ac-coral-dark">{c.outcome}</span>
                  {c.proves}
                </div>
              </div>
            ))}
          </div>
        </Phase>

        <Phase {...PHASES[2]} title="A real Backstory answer, or a guess?">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-ac-success/30 bg-ac-success/5 p-5">
              <div className="mb-3 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-ac-success">It used Backstory</div>
              <ul className="space-y-2.5">
                {REAL.map((t) => (
                  <li key={t} className="flex gap-2.5 text-[13.5px] leading-6 text-ac-dark"><Check size={15} className="mt-1 shrink-0 text-ac-success" />{t}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-ac-light-gray bg-ac-warm-white p-5">
              <div className="mb-3 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-ac-med-gray">It&rsquo;s guessing</div>
              <ul className="space-y-2.5">
                {GUESS.map((t) => (
                  <li key={t} className="flex gap-2.5 text-[13.5px] leading-6 text-ac-dark-secondary"><X size={15} className="mt-1 shrink-0 text-ac-med-gray" />{t}</li>
                ))}
              </ul>
            </div>
          </div>
          <p className="mt-4 text-[14px] leading-6 text-ac-dark-secondary">
            <strong className="text-ac-dark">If it guessed:</strong> ask again with &ldquo;use Backstory&rdquo; and the account name.
            More fixes are under <Link to="/trust-it" className="font-medium text-ac-coral-dark hover:underline">where it&rsquo;s still rough</Link>.
          </p>
        </Phase>

        <Phase {...PHASES[3]} title="From questions to decisions">
          <p className="mb-5 text-[14px] leading-6 text-ac-dark-secondary">
            Pick one and run it on a real account. Each has a short video, the prompt to copy, and what a good answer looks like.
          </p>
          <div className="divide-y divide-ac-light-gray">
            {examples.map((e) => (
              <div key={e.id} className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[11px] font-bold text-ac-coral-dark">0{e.order}</span>
                    <h3 className="font-display text-[15px] font-bold">{e.title}</h3>
                    {e.startHere && (
                      <span className="rounded-md bg-ac-coral px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-white">Start here</span>
                    )}
                  </div>
                  <p className="mt-1 text-[13.5px] leading-6 text-ac-dark-secondary">{e.helpsYou}</p>
                  <div className="mt-1 flex flex-wrap gap-3 font-mono text-[11px] text-ac-med-gray">
                    <span>For {e.whoFor.join(', ')}</span>
                    <span className="inline-flex items-center gap-1"><Clock size={11} /> {e.timeToTry}</span>
                  </div>
                </div>
                <Button as={Link} to={`/example/${e.id}`} size="sm" variant={e.startHere ? 'primary' : 'secondary'} className="shrink-0 self-start sm:self-center">
                  Try it <ArrowRight size={14} />
                </Button>
              </div>
            ))}
          </div>
        </Phase>

        <section className="pt-2">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="font-display text-[22px] font-bold tracking-[-0.01em]">Instead of this, do this</h2>
              <p className="mt-1.5 max-w-3xl text-[14px] leading-6 text-ac-dark-secondary">
                People keep their old habits and bolt Claude onto the end of them. Every swap applies one of three patterns.
              </p>
            </div>
            <Button as={Link} to="/use-it/swaps" variant="secondary" size="sm">
              See all {swapCount} swaps <ArrowRight size={14} />
            </Button>
          </div>
          <div className="surface-card mt-4 p-6">
            <PatternBars />
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {previewSwaps.map((s) => (
              <SwapCard key={s.title} s={s} />
            ))}
          </div>
        </section>

        <NextStep text="Got your first answer? See what else is possible." to="/stretch-it" label="Stretch it" variant="secondary" />
      </div>
    </div>
  );
}
