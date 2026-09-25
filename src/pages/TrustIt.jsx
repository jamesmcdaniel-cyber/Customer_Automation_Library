import { ArrowRight, ExternalLink, Eye, KeyRound, Lock } from 'lucide-react';
import { SectionHero } from '../components/SectionHero';
import { Accordion } from '../components/ui/Accordion';
import { Checklist } from '../components/Checklist';
import { NextStep } from '../components/NextStep';
import { HelpLink } from '../components/HelpLink';
import { site } from '../lib/content';

const PILLARS = [
  [KeyRound, 'Sign-in', 'You sign in yourself', 'Connecting opens a standard Backstory sign-in (OAuth 2.0). Your password is never shared with the AI assistant, and you can disconnect at any time.'],
  [Eye, 'Access', 'Your permissions, not more', 'Permissions mirror each user’s Backstory access. A rep sees their book; a manager sees their team. No one gets extra visibility.'],
  [Lock, 'Read-only', 'It can look, not change', 'The connector can only read. It cannot update your CRM, send email, or change anything in Backstory.'],
];

const ROUGH = [
  {
    problem: 'Claude skips the tool',
    what: 'It answers from general knowledge instead of opening Backstory, so the answer sounds plausible but isn’t about your account.',
    fix: 'Say “use Backstory”, or name the account explicitly.',
  },
  {
    problem: 'Broad asks fall apart',
    what: '“Summarize my whole pipeline” hits output limits or comes back shallow.',
    fix: 'Scope it: by segment, by stage, by time window, or by a named account.',
  },
  {
    problem: 'Missing data looks like a confident “nothing”',
    what: 'If meetings weren’t captured, the assistant reports only what exists and may not tell you something is missing.',
    fix: 'Ask it to list the records it used.',
  },
];

function PolicyLink({ href, children }) {
  return (
    <a href={href} target="_blank" rel="noopener" className="inline-flex items-center gap-1 font-medium text-ac-coral-dark hover:underline">
      {children} <ExternalLink size={12} />
    </a>
  );
}

export function TrustIt() {
  const p = site.policies;
  const faq = [
    {
      value: 'moves',
      title: 'What moves? Which data leaves Backstory, where it goes, and who can see it',
      content: (
        <>
          <p>
            Nothing is copied or synced in bulk. When a user asks a question, the assistant calls a Backstory tool, and Backstory
            returns only the results for that question, such as an account summary, recent activity, or deal status.
          </p>
          <p className="mt-2">
            Those results go to the AI assistant the user connected (for example Claude or ChatGPT) and appear in that
            user&rsquo;s conversation. From there, the AI provider&rsquo;s own data policies apply, along with your
            organization&rsquo;s settings for that assistant.
          </p>
        </>
      ),
    },
    {
      value: 'access',
      title: 'Access: who can see what?',
      content: (
        <p>
          Permissions mirror each user&rsquo;s Backstory access. Every request runs as the signed-in user, so the assistant can
          only return accounts and deals that person could already see in Backstory. No one gets extra visibility.
        </p>
      ),
    },
    {
      value: 'retention',
      title: 'Retention and training: is our data used to train models?',
      content: (
        <>
          <p>We point you to the official policies rather than paraphrasing them:</p>
          <ul className="mt-2 space-y-1.5">
            <li><PolicyLink href={p.anthropicCommercial}>Anthropic commercial terms</PolicyLink> (Claude for Work, Team, and Enterprise)</li>
            <li><PolicyLink href={p.anthropicPrivacy}>Anthropic Privacy Center</PolicyLink> and <PolicyLink href={p.anthropicTrust}>Trust Center</PolicyLink></li>
            <li><PolicyLink href={p.openaiEnterprise}>OpenAI enterprise privacy</PolicyLink> (ChatGPT Team and Enterprise)</li>
            <li><PolicyLink href={p.backstoryPrivacy}>Backstory privacy policy</PolicyLink> and <PolicyLink href={p.backstorySecurity}>Backstory trust &amp; security</PolicyLink></li>
          </ul>
        </>
      ),
    },
    {
      value: 'can-see',
      title: 'What can the assistant see through Backstory?',
      content: (
        <Checklist
          items={[
            'Accounts and opportunities the user has access to in Backstory, including lists of up to 1,000 at a time',
            'Summaries of emails, calls, and meetings from the last 30 days, matched to those records',
            'Deal risks, next steps, engaged contacts, and scorecard coverage',
            'Public news about publicly traded companies',
          ]}
        />
      ),
    },
    {
      value: 'cant-do',
      title: 'What can’t it do?',
      content: (
        <Checklist
          negative
          items={[
            'Change CRM records or anything else in Backstory',
            'Read calendars or full call transcripts',
            'Report metrics, historical roll-ups, or trends older than 30 days',
            'See accounts or deals outside the user’s own permissions',
          ]}
        />
      ),
    },
  ];

  return (
    <div className="container-page">
      <SectionHero
        eyebrow="02 · Trust it"
        title="Security, data, and the honest limits"
        subtitle="Read-only, permission-scoped, and you sign in yourself. Written for admins, and meant to be shared with your champion before the IT meeting gets booked."
        image="bg-02.jpg"
      />
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="grid gap-4 md:grid-cols-3">
          {PILLARS.map(([Icon, tag, title, body]) => (
            <div key={tag} className="surface-card p-5">
              <div className="mb-3 flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-ac-coral/12 text-ac-coral-dark">
                  <Icon size={16} />
                </span>
                <span className="font-mono text-[10.5px] font-medium uppercase tracking-[0.12em] text-ac-coral-dark">{tag}</span>
              </div>
              <h3 className="font-display text-[15px] font-bold">{title}</h3>
              <p className="mt-1.5 text-[13.5px] leading-6 text-ac-dark-secondary">{body}</p>
            </div>
          ))}
        </div>

        <section>
          <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="eyebrow">Security &amp; data FAQ</h2>
            <span className="font-mono text-[11px] text-ac-med-gray">For admins · share with your champion</span>
          </div>
          <Accordion items={faq} defaultValue={['moves']} />
        </section>

        <section>
          <h2 className="eyebrow mb-1">Where it&rsquo;s still rough</h2>
          <p className="mb-4 max-w-3xl text-[14px] leading-6 text-ac-dark-secondary">
            You&rsquo;ll find these on your own eventually, so here they are up front, each with its fix.
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            {ROUGH.map((r) => (
              <div key={r.problem} className="surface-card flex flex-col p-5">
                <h3 className="font-display text-[15px] font-bold">{r.problem}</h3>
                <p className="mt-1.5 flex-1 text-[13.5px] leading-6 text-ac-dark-secondary">{r.what}</p>
                <div className="mt-4 flex gap-2 rounded-lg border border-ac-coral/30 bg-ac-coral/5 px-3 py-2.5 text-[13.5px] leading-5 text-ac-dark">
                  <ArrowRight size={14} className="mt-0.5 shrink-0 text-ac-coral-dark" />
                  <span><strong className="text-ac-coral-dark">Fix:</strong> {r.fix}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="surface-card p-6">
          <h2 className="eyebrow mb-4">More detail</h2>
          <ul className="space-y-2.5 text-[14px]">
            <li><HelpLink k="security" label="Backstory MCP security overview" /></li>
            <li><HelpLink k="permissions" label="How Backstory permissions work" /></li>
            <li><HelpLink k="troubleshooting" label="Troubleshooting the connector" /></li>
            <li><PolicyLink href={site.mcpReferenceUrl}>Technical reference: MCP tools and limits</PolicyLink></li>
          </ul>
        </section>

        <NextStep text="Next: your first 15 minutes." to="/use-it" label="Use it" />
      </div>
    </div>
  );
}
