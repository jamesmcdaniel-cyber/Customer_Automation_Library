import { Link } from 'react-router-dom';
import { ArrowRight, Check, Clock, X } from 'lucide-react';
import { SectionHero } from '../components/SectionHero';
import { CopyButton } from '../components/ui/CopyButton';
import { Button } from '../components/ui/Button';
import { NextStep } from '../components/NextStep';
import { HelpLink } from '../components/HelpLink';
import { ResourceButton } from '../components/Resource';
import { Video } from '../components/Video';
import { ResourceKit, ResourceKitLink } from '../components/ResourceKit';
import { TocLayout } from '../components/PageToc';
import { SectionHeading } from '../components/SectionHeading';
import { examples, site } from '../lib/content';
import { Habits, questionCount } from './Questions';
import { swapCount } from './Swaps';
import { GuideCards } from './ConnectGuide';
import { LinkCard } from './Resources';

const PHASES = [
  { id: 'connect', time: '0–5 min', label: 'Connect', toc: 'Connect your AI tool' },
  { id: 'confirm', time: '5–8 min', label: 'Confirm', toc: 'Prove it’s working' },
  { id: 'tell', time: '8–10 min', label: 'Tell', toc: 'Real answer or guess?' },
  { id: 'decide', time: '10–15 min', label: 'Decide', toc: 'Questions to decisions' },
];

const CONFIRM = [
  { prompt: 'Catch me up on Nimbus Robotics.', proves: 'It can see the last 30 days of captured activity.', outcome: 'Meeting prep' },
  { prompt: 'Using Backstory, who have we been talking to at Nimbus Robotics in the last 30 days, and when?', proves: 'It knows the people, not just the account.', outcome: 'Relationship coverage' },
  { prompt: 'Any risks on the Nimbus Robotics renewal deal?', proves: 'It reads deal context you’d otherwise dig for.', outcome: 'Deal risk' },
];

const REAL = [
  'A tool step appears in the conversation, such as “Used Backstory” or a named tool like get_account_status. You can expand it to see what came back.',
  'The answer names specific people, dates, and meetings from your account.',
  'Ask “What dates and people is that based on?” and it can tell you.',
];
const GUESS = [
  'No tool step appears; the answer arrives instantly.',
  'Generic advice that would fit any company (“build rapport with stakeholders”).',
  'No names, dates, or numbers you recognize.',
];


function Phase({ id, time, label, toc, title, children }) {
  return (
    <section id={id} data-toc={toc} className="surface-card p-6 sm:p-7">
      <div className="mb-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="rounded-md bg-ac-coral px-2 py-0.5 font-mono text-[11px] font-semibold text-white">{time}</span>
        <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-ac-coral-dark">{label}</span>
      </div>
      <h2 className="mb-4 font-display text-[22px] font-bold leading-tight tracking-[-0.01em] sm:text-[25px]">{title}</h2>
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
  return (
    <div className="container-page">
      <SectionHero
        eyebrow="03 · Use it"
        title="Your first 15 minutes"
        subtitle="By minute 15 you'll have an answer in 30 seconds that you couldn't have gotten without Backstory. Connect, confirm it's working, learn to tell a real answer from a guess, then move from questions to decisions."
        section="use-it"
      >
        <ResourceKitLink stage="use-it" />
      </SectionHero>

      <TocLayout className="space-y-12">
        {/* The 15-minute timeline lives here, not in the banner, so the banner matches every other page. */}
        <nav aria-label="Your first 15 minutes" className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {PHASES.map((p) => (
            <a key={p.id} href={`#${p.id}`} className="rounded-xl border border-ac-light-gray bg-ac-card px-4 py-3 no-underline shadow-card transition-colors hover:border-ac-coral">
              <div className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ac-coral-dark">{p.time}</div>
              <div className="mt-0.5 font-display text-[15px] font-bold text-ac-dark">{p.label}</div>
            </a>
          ))}
        </nav>
        <Phase {...PHASES[0]} title="Connect Backstory to your AI tool">
          <p className="text-[14px] leading-6 text-ac-dark-secondary">
            Pick your AI tool for a step-by-step guide with screenshots. Every setup points at the same Backstory address, and
            everyone signs in with their own Backstory login, so they only see what they can already see in Backstory.
          </p>
          <div className="mt-4 flex items-center justify-between gap-3 rounded-lg border border-ac-light-gray bg-ac-warm-white px-4 py-3">
            <code className="min-w-0 break-all font-mono text-[13px] text-ac-dark">{site.mcpUrl}</code>
            <CopyButton text={site.mcpUrl} />
          </div>
          <div className="mt-4">
            <GuideCards />
          </div>
          <div className="mt-5 max-w-2xl">
            <p className="mb-2.5 text-[13px] leading-6 text-ac-dark-secondary">
              <strong className="text-ac-dark">Prefer to watch?</strong> Here&rsquo;s a walkthrough of connecting Claude and ChatGPT,
              signing in, and asking a first question.
            </p>
            <Video url={site.overviewVideoUrl} title="Connect Backstory to Claude and ChatGPT" />
          </div>
          <p className="mt-4 text-[13px] leading-6 text-ac-dark-secondary">
            <strong className="text-ac-dark">Something else?</strong> Cursor and Gemini CLI work too, for developers:{' '}
            <ResourceButton id="connectGeminiCli" inline label="Gemini CLI setup guide" />. Perplexity and Grok aren&rsquo;t supported
            yet. For anything else, ask your Backstory CSM.
          </p>
          <p className="mt-2 text-[13px] leading-6 text-ac-dark-secondary">
            <strong className="text-ac-dark">Connected?</strong> Ask <em>&ldquo;What Backstory tools do you have access to?&rdquo;</em> to
            see every drawer it can open. Stuck? <HelpLink k="connect" label="Connecting the Backstory MCP" />.
          </p>
        </Phase>

        <Phase {...PHASES[1]} title="Three prompts that prove it's working">
          <p className="mb-4 text-[14px] leading-6 text-ac-dark-secondary">
            Swap in one of your own accounts and deals for Nimbus Robotics. Use the full company name, and check it in the first answer.
          </p>
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
            More fixes are under <Link to="/trust-it#rough" className="font-medium text-ac-coral-dark hover:underline">where it&rsquo;s still rough</Link>.
          </p>
          <div className="mt-5 rounded-xl border border-ac-horizon-100 bg-ac-horizon-50 p-5">
            <h3 className="mb-3 font-display text-[15px] font-bold">Three habits that catch most wrong answers</h3>
            <Habits />
          </div>
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
                  </div>
                  <p className="mt-1 text-[13.5px] leading-6 text-ac-dark-secondary">{e.helpsYou}</p>
                  <div className="mt-1 flex flex-wrap gap-3 font-mono text-[11px] text-ac-med-gray">
                    <span>For {e.whoFor.join(', ')}</span>
                    <span className="inline-flex items-center gap-1"><Clock size={11} /> {e.timeToTry}</span>
                  </div>
                </div>
                <Button as={Link} to={`/example/${e.id}`} size="sm" variant="secondary" className="shrink-0 self-start sm:self-center">
                  Try it <ArrowRight size={14} />
                </Button>
              </div>
            ))}
          </div>
        </Phase>

        <section id="go-deeper" data-toc="Go deeper">
          <SectionHeading
            title="Go deeper"
            intro="Two references to keep open while you practice. You’ll find them, and more, under Additional resources."
            action={
              <Button as={Link} to="/resources" variant="secondary" size="sm">
                All additional resources <ArrowRight size={14} />
              </Button>
            }
          />
          <div className="grid gap-4 md:grid-cols-2">
            <LinkCard
              to="/resources/questions"
              kicker={`${questionCount} tested prompts`}
              title="Three kinds of questions"
              body="Which questions work as worded, which need a check, and where each kind stops."
            />
            <LinkCard
              to="/resources/swaps"
              kicker={`${swapCount} swaps · 3 roles`}
              title="Instead of this, do this"
              body="Trade the habits that hold your AI tool back for prompts that work, by role."
            />
          </div>
        </section>

        <ResourceKit stage="use-it" />

        <NextStep text="Got your first answer? See what else is possible." to="/stretch-it" label="Stretch it" variant="secondary" />
      </TocLayout>
    </div>
  );
}
