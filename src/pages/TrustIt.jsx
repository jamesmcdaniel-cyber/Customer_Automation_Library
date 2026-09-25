import { ArrowRight, ExternalLink, Eye, KeyRound, Lock } from 'lucide-react';
import { SectionHero } from '../components/SectionHero';
import { Accordion } from '../components/ui/Accordion';
import { Checklist } from '../components/Checklist';
import { NextStep } from '../components/NextStep';
import { HelpLink } from '../components/HelpLink';
import { site } from '../lib/content';

const PILLARS = [
  [KeyRound, 'Sign-in', 'You sign in yourself', 'Connecting opens the standard Backstory sign-in (OAuth 2.0), with the login you already use. Your password is never shared with the AI assistant, and you can disconnect at any time.'],
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
  {
    problem: '“My team” comes back empty',
    what: 'Team questions use the team set up for you in Backstory. If none is set up, they return nothing, even though your reps have deals.',
    fix: 'Name the rep (“deals owned by Alex Chen”), or ask your admin to set up your team in Backstory.',
  },
  {
    problem: 'Some filters don’t exist yet',
    what: 'Lists can’t filter on forecast category, renewal date, or deal type yet. The assistant may drop that part of the question or read it as a stage name.',
    fix: 'Filter by owner, close date, stage, or amount, and check how it says it read your request before you confirm the list.',
  },
  {
    problem: 'Closed deals are hard to reach',
    what: 'Lists, activity, and engaged people focus on open deals, so “what did our won deals have in common?” comes back thin.',
    fix: 'Name an open deal and ask for similar past deals and what worked.',
  },
];

const TROUBLESHOOTING = [
  {
    value: 'not-found',
    title: 'Account not found',
    content: 'The account name has to match your CRM closely. Abbreviations, punctuation, and spacing can cause a miss. Try a shorter version of the name, or paste the Salesforce record ID instead.',
  },
  {
    value: 'no-news',
    title: 'Company news comes back empty',
    content: 'That’s expected for private companies. News and filings are only available for publicly traded companies.',
  },
  {
    value: 'connection',
    title: 'The connector won’t connect',
    content: 'Check that the connector address is exactly https://mcp.backstory.ai/mcp. If it worked before, your sign-in may have expired: disconnect and sign in again.',
  },
  {
    value: 'wrong-info',
    title: 'The answer has the wrong people or activity',
    content: 'Answers are only as good as the data behind them. Check the account’s domain and contact records in Salesforce, since that’s how activity gets matched to the right account.',
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
      value: 'secured',
      title: 'How is the connection secured, and how do people sign in?',
      content: (
        <>
          <p>
            All traffic uses HTTPS/TLS encryption, and every request made through the connector is audit-logged.
          </p>
          <p className="mt-2">
            Sign-in uses OAuth 2.0. By default, people log in through the Backstory app with Salesforce single sign-on, so
            they need to be able to log in to Backstory already. If your company uses another identity provider, such as Okta or
            Microsoft Entra ID, your Backstory account team can set up an alternative sign-in.
          </p>
        </>
      ),
    },
    {
      value: 'who-adds',
      title: 'Who can add the connector?',
      content: (
        <p>
          Adding Backstory as a custom connector needs admin access in your AI assistant (for example, a Claude or ChatGPT
          workspace admin). Microsoft Copilot is set up by an agent builder in Copilot Studio, and Gemini Enterprise by a Google
          Cloud admin. Once it&rsquo;s added, each person signs
          in with their own Backstory login.
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
            'Answers from Backstory’s Sales AI, built from the same data',
            'Similar past deals and how they turned out, where your organization has turned this on (beta)',
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
            'Summarize activity older than 30 days (lists can count meetings up to 90 days back, but not summarize them)',
            'Compare before and now, such as stage changes or engagement trends',
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

        <section>
          <h2 className="eyebrow mb-3">Troubleshooting</h2>
          <Accordion items={TROUBLESHOOTING} />
        </section>

        <section className="surface-card p-6">
          <h2 className="eyebrow mb-4">More detail and help</h2>
          <ul className="space-y-2.5 text-[14px]">
            <li><HelpLink k="security" label="Backstory MCP security overview" /></li>
            <li><HelpLink k="permissions" label="How Backstory permissions work" /></li>
            <li><HelpLink k="troubleshooting" label="Troubleshooting the connector" /></li>
            <li><PolicyLink href={site.mcpReferenceUrl}>Technical reference: MCP tools and limits</PolicyLink></li>
            <li><PolicyLink href={site.support.helpCenter}>Backstory Help Center</PolicyLink></li>
            <li>
              Technical support:{' '}
              <a href={`mailto:${site.support.email}`} className="font-medium text-ac-coral-dark hover:underline">{site.support.email}</a>
              <span className="text-ac-dark-secondary">, or your Backstory CSM for rollout and new use cases</span>
            </li>
          </ul>
        </section>

        <NextStep text="Next: your first 15 minutes." to="/use-it" label="Use it" />
      </div>
    </div>
  );
}
