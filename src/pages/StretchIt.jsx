import { ArrowRight, ExternalLink, FileText, Layers, Repeat } from 'lucide-react';
import { SectionHero } from '../components/SectionHero';
import { Button } from '../components/ui/Button';
import { Tabs } from '../components/ui/Tabs';
import { CopyButton } from '../components/ui/CopyButton';
import { examples, site, stories } from '../lib/content';
import { cn } from '../lib/cn';

const LIB = 'https://backstory-workflows.vercel.app/#/workflow/';

const PLAYBOOKS = [
  {
    value: 'rep',
    label: 'Rep',
    title: 'Morning prep, chained into your Win the Day routine',
    intro: 'Three prompts, run in order each morning, turn “what’s on today?” into a plan.',
    steps: [
      'Use Backstory. For each of these accounts I’m meeting today: Nimbus Robotics, Vantage Retail. Give me where things stand and the open risks.',
      'Which of those accounts has anyone gone quiet in the last 30 days?',
      'Turn that into my top three actions for today, in priority order.',
    ],
    automate: { label: 'Sales Digest', href: `${LIB}01-sales-digest` },
  },
  {
    value: 'manager',
    label: 'Manager',
    title: '1:1 prep and forecast-call prep',
    intro: 'Walk into each 1:1 with the deal context already in hand, instead of asking the rep to recap it.',
    steps: [
      'Use Backstory. Review my top deals owned by Alex Chen: open risks, missing next steps, and scorecard gaps.',
      'Which of those deals have no executive engaged in the last 30 days?',
      'Give me three coaching questions for my 1:1 with Alex, based on that.',
    ],
    before: '“So, how are your deals looking?” The rep recaps from memory, and the first 20 minutes go to status.',
    after: 'You open with: “Acme has no economic buyer engaged and Globex is single-threaded. What’s your plan for each?”',
    automate: { label: 'Manager Coaching Brief', href: `${LIB}34-manager-coaching-brief` },
  },
  {
    value: 'vp',
    label: 'VP',
    title: 'A QBR narrative built from account activity',
    intro: 'Build the story of the quarter for a key account from what actually happened, not from memory.',
    steps: [
      'Use Backstory. For Nimbus Robotics, summarize engagement over the last 30 days: who we’re talking to, how often, and about what.',
      'What risks and agreed next steps are open, and how do they compare with similar deals we’ve seen before?',
      'Draft a one-page QBR narrative for their executive sponsor: what went well, what’s at risk, and what we propose next.',
    ],
    automate: { label: 'QBR Auto-Prep', href: `${LIB}15-qbr-auto-prep` },
  },
];

const DID_YOU_KNOW = [
  {
    icon: Layers,
    title: 'Stack connectors',
    body: 'Combine Backstory with your calendar and email connectors in a single prompt.',
    prompt: 'Prep me for tomorrow’s meetings using Backstory history and the latest email thread with each attendee.',
    note: 'Needs your calendar and email connectors turned on too.',
  },
  {
    icon: Repeat,
    title: 'Standing instructions',
    body: 'Put “always check Backstory for account questions” in a Claude Project, so you stop re-explaining context.',
    prompt: 'For any question about a customer, account, or deal, always check Backstory first and tell me which records you used.',
    note: 'Paste into a Claude Project’s instructions.',
  },
  {
    icon: FileText,
    title: 'Output as the deliverable',
    body: 'Don’t stop at a summary. Turn it straight into the doc or brief you were going to write anyway.',
    prompt: 'Turn that account summary into a formatted one-page brief for the executive sponsor.',
  },
];

const STATUS_TONE = {
  Pilot: 'bg-ac-coral/12 text-ac-coral-dark',
  'Running end to end': 'bg-ac-success/12 text-ac-success',
  'Awaiting IT approval': 'bg-ac-warning/12 text-ac-warning',
  Scoping: 'bg-ac-cream text-ac-dark-secondary',
};

function Playbook({ p }) {
  return (
    <div>
      <h3 className="font-display text-[17px] font-bold">{p.title}</h3>
      <p className="mt-1 text-[14px] leading-6 text-ac-dark-secondary">{p.intro}</p>
      <ol className="mt-4 space-y-2">
        {p.steps.map((s, i) => (
          <li key={i} className="flex items-start gap-3 rounded-lg border border-ac-light-gray bg-ac-warm-white px-4 py-3">
            <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-ac-coral/12 font-mono text-[11px] font-bold text-ac-coral-dark">{i + 1}</span>
            <span className="min-w-0 flex-1 text-[14px] leading-6 text-ac-dark">{s}</span>
            <CopyButton text={s} className="shrink-0" />
          </li>
        ))}
      </ol>
      {p.before && (
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="rounded-lg border border-ac-light-gray px-4 py-3">
            <div className="mb-1 font-mono text-[10.5px] font-semibold uppercase tracking-[0.12em] text-ac-med-gray">Before</div>
            <p className="text-[13.5px] leading-6 text-ac-dark-secondary">{p.before}</p>
          </div>
          <div className="rounded-lg border border-ac-coral/40 bg-ac-coral/5 px-4 py-3">
            <div className="mb-1 font-mono text-[10.5px] font-semibold uppercase tracking-[0.12em] text-ac-coral-dark">After</div>
            <p className="text-[13.5px] leading-6 text-ac-dark">{p.after}</p>
          </div>
        </div>
      )}
      <a href={p.automate.href} target="_blank" rel="noopener" className="mt-4 inline-flex items-center gap-1.5 text-[13.5px] font-medium text-ac-coral-dark hover:underline">
        Run it automatically: {p.automate.label} <ExternalLink size={12} />
      </a>
    </div>
  );
}

export function StretchIt() {
  return (
    <div className="container-page">
      <SectionHero
        eyebrow="04 · Stretch it"
        title="From prompt to playbook"
        subtitle="A single prompt impresses people once. Workflows are what keep them coming back. Chain prompts into routines, try what nobody thinks to try, and know when to hand the job to an automation."
        image="bg-05.jpg"
      />
      <div className="mx-auto max-w-5xl space-y-10">
        <section>
          <h2 className="eyebrow mb-3">Playbooks by role</h2>
          <div className="surface-card p-6">
            <Tabs tabs={PLAYBOOKS.map((p) => ({ value: p.value, label: p.label, content: <Playbook p={p} /> }))} />
          </div>
        </section>

        <section>
          <h2 className="eyebrow mb-1">Did you know?</h2>
          <p className="mb-4 text-[14px] text-ac-dark-secondary">The most valuable capabilities are the ones nobody thinks to try.</p>
          <div className="grid gap-4 md:grid-cols-3">
            {DID_YOU_KNOW.map(({ icon: Icon, ...d }) => (
              <div key={d.title} className="surface-card flex flex-col p-5">
                <span className="mb-3 grid h-8 w-8 place-items-center rounded-lg bg-ac-coral/12 text-ac-coral-dark"><Icon size={16} /></span>
                <h3 className="font-display text-[15px] font-bold">{d.title}</h3>
                <p className="mt-1.5 text-[13.5px] leading-6 text-ac-dark-secondary">{d.body}</p>
                <div className="mt-3 flex-1 rounded-lg border border-ac-light-gray bg-ac-warm-white px-3 py-2.5 text-[13px] italic leading-5 text-ac-dark">&ldquo;{d.prompt}&rdquo;</div>
                {d.note && <p className="mt-2 text-[12px] text-ac-med-gray">{d.note}</p>}
                <CopyButton text={d.prompt} className="mt-3 self-start" />
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="eyebrow mb-1">What customers are building</h2>
          <p className="mb-4 max-w-3xl text-[14px] leading-6 text-ac-dark-secondary">
            A bird&rsquo;s-eye view of how MCP use varies with the tools and outcomes each team cares about. Company names are
            withheld, and most of these are pilots or builds in progress.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            {stories.map((s) => (
              <div key={s.id} className="surface-card flex flex-col p-5">
                <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
                  <span className="font-mono text-[10.5px] font-medium uppercase tracking-[0.12em] text-ac-med-gray">{s.company}</span>
                  <span className={cn('rounded-md px-2 py-0.5 font-mono text-[10.5px] font-medium', STATUS_TONE[s.status] || STATUS_TONE.Scoping)}>{s.status}</span>
                </div>
                <h3 className="font-display text-[15px] font-bold leading-snug">{s.headline}</h3>
                <p className="mt-2 text-[13.5px] leading-6 text-ac-dark-secondary">{s.summary}</p>
                <p className="mt-2 flex-1 text-[13.5px] leading-6 text-ac-dark">{s.next}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {s.tools.map((t) => <span key={t} className="rounded-md border border-ac-light-gray px-2 py-0.5 font-mono text-[10.5px] text-ac-dark-secondary">{t}</span>)}
                  {s.outcomes.map((o) => <span key={o} className="rounded-md bg-ac-coral/12 px-2 py-0.5 font-mono text-[10.5px] text-ac-coral-dark">{o}</span>)}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="eyebrow mb-1">MCP or API?</h2>
          <p className="mb-4 text-[14px] text-ac-dark-secondary">Admins ask this and usually get vague answers. Here&rsquo;s the rule.</p>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="surface-card border-ac-coral/40 p-5">
              <div className="mb-2 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-ac-coral-dark">Use MCP</div>
              <p className="text-[14px] leading-6 text-ac-dark">When a person is in the loop and the question changes each time.</p>
            </div>
            <div className="surface-card p-5">
              <div className="mb-2 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-ac-dark">Use the API</div>
              <p className="text-[14px] leading-6 text-ac-dark">When the same job runs on a schedule, needs exact output, or feeds another system.</p>
            </div>
            <div className="surface-card p-5">
              <div className="mb-2 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-ac-med-gray">The gray zone</div>
              <p className="text-[14px] leading-6 text-ac-dark">Recurring reports a person still reviews. Start with MCP, and move to the API once the format stops changing.</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="eyebrow mb-1">Ready to automate? Each starter prompt has an automated version</h2>
          <p className="mb-4 text-[14px] text-ac-dark-secondary">These run on a schedule and deliver to Slack, Teams, or email.</p>
          <div className="grid gap-4 sm:grid-cols-2">
            {examples.map((e) => {
              const [name, desc] = e.stretchLabel.split(' — ');
              return (
                <a
                  key={e.id}
                  href={e.stretchLink}
                  target="_blank"
                  rel="noopener"
                  className="group flex flex-col rounded-xl border border-ac-light-gray bg-ac-card p-5 shadow-card no-underline transition-all duration-200 hover:-translate-y-0.5 hover:border-ac-coral hover:shadow-cardhover"
                >
                  <span className="mb-2.5 self-start rounded-md bg-ac-coral/12 px-2 py-0.5 font-mono text-[10.5px] font-medium uppercase tracking-[0.12em] text-ac-coral-dark">
                    From: {e.title}
                  </span>
                  <h3 className="font-display text-[15px] font-bold leading-snug text-ac-dark">{name}</h3>
                  <p className="mt-2 flex-1 text-[13.5px] leading-6 text-ac-dark-secondary">{desc}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.1em] text-ac-coral-dark">
                    View workflow <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
                  </span>
                </a>
              );
            })}
          </div>
        </section>

        <section className="surface-card p-6">
          <h2 className="font-display text-[19px] font-bold">The full automation library</h2>
          <p className="mt-2 text-[15px] leading-7 text-ac-dark-secondary">
            Nearly 40 ready-made workflows for tools like n8n, Zapier, Workato, and Power Automate, covering daily digests, churn
            risk, renewals, QBR prep, forecasting, and more. These take some technical setup, usually by an admin or RevOps.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button as="a" href={site.fullLibraryUrl} target="_blank" rel="noopener">
              Open the full library <ExternalLink size={14} />
            </Button>
            <Button as="a" href={site.apiDocsUrl} target="_blank" rel="noopener" variant="secondary">
              API docs
            </Button>
            <Button as="a" href={site.mcpReferenceUrl} target="_blank" rel="noopener" variant="secondary">
              MCP technical reference
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
