import { ArrowRight, ExternalLink, Eye, KeyRound, Lock } from 'lucide-react';
import { SectionHero } from '../components/SectionHero';
import { Accordion } from '../components/ui/Accordion';
import { Checklist } from '../components/Checklist';
import { NextStep } from '../components/NextStep';
import { HelpLink } from '../components/HelpLink';
import { ResourceKit, ResourceKitLink } from '../components/ResourceKit';
import { TocLayout } from '../components/PageToc';
import { SectionHeading } from '../components/SectionHeading';
import { site } from '../lib/content';

const PILLARS = [
  [KeyRound, 'Sign-in', 'You sign in yourself', 'Connecting opens the standard Backstory sign-in (OAuth 2.0), with the login you already use. Your password is never shared with the AI assistant, and you can disconnect at any time.'],
  [Eye, 'Access', 'Your permissions, not more', 'Each person sees what their Backstory user sees. That follows Backstory’s visibility settings, which can differ from Salesforce sharing.'],
  [Lock, 'Read-only', 'It can look, not change', 'The connector can only read. It cannot update your CRM, send email, or change anything in Backstory.'],
];

const ROUGH = [
  {
    problem: 'Claude skips the tool',
    what: 'It answers from general knowledge instead of opening Backstory, so the answer sounds plausible but isn’t about your account.',
    fix: 'Say “use Backstory”, or name the account explicitly.',
  },
  {
    problem: 'Short names match the wrong account',
    what: '“Box” can pull up Mapbox. The answer looks right, but it’s about a different company.',
    fix: 'Use the full company name, and check it in the first answer.',
  },
  {
    problem: 'Big judgment calls don’t land',
    what: '“Rank my pipeline by risk”, “which reps are struggling” or “which deals will close” come back shallow or not at all.',
    fix: 'Pull a list, then ask about the risks on each deal that matters.',
  },
  {
    problem: 'Missing data looks like a confident “nothing”',
    what: 'If meetings weren’t captured, your AI tool reports only what exists and may not tell you something is missing.',
    fix: 'Ask “What dates and people is that based on?”',
  },
  {
    problem: 'Long history comes back as 30 days',
    what: 'Ask about the last 90 days and your AI tool often answers from the last 30. Engagement numbers stay at 30 days either way.',
    fix: 'Start with “Ask Backstory’s assistant”, e.g. “Ask Backstory’s assistant what the big themes have been with Acme Corp over the last 90 days.”',
  },
  {
    problem: '“My team” comes back empty',
    what: 'Team questions use the team set up for you in Backstory. If none is set up, they return nothing, even though your reps have deals.',
    fix: 'Name the rep (“deals owned by Alex Chen”), or ask your admin to set up your team in Backstory.',
  },
  {
    problem: 'Some list filters don’t exist yet',
    what: 'Renewals, commit, stage words like “late-stage” and groupings like “by owner” can be dropped without a word. Lists that look back, like “no activity in two weeks”, can be read as upcoming meetings.',
    fix: 'Stick to whose deals, close date, engagement and what’s on the calendar ahead (“nothing on the calendar in the next 30 days”). Check how it read your request before you confirm the list.',
  },
  {
    problem: 'Won deals and past quarters are out of reach',
    what: 'Lists of won or lost deals come back empty. Backstory can’t see past quarters, forecast data, or changes like stage moves.',
    fix: 'Ask “Have we had a deal like the Acme Corp renewal before?” and treat the matches as examples. For forecast, use Backstory Forecasting in the app.',
  },
  {
    problem: 'Long chats drift',
    what: 'An AI tool can only hold so much of a conversation. The longer a chat runs, the more likely it is to make mistakes.',
    fix: 'Start a new chat for each question that doesn’t build on the last one.',
  },
];

const TROUBLESHOOTING = [
  {
    value: 'not-found',
    title: 'Account not found',
    content: 'The account name has to match your CRM closely. Abbreviations, punctuation, and spacing can cause a miss. Use the full company name as it appears in your CRM, or paste the Salesforce record ID instead.',
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
          Every request runs as the signed-in user, so your AI tool can only return accounts and deals that person could
          already see in Backstory. That follows Backstory&rsquo;s visibility settings, which can differ from Salesforce sharing.
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
      value: 'agents',
      title: 'Do agents get more access than people?',
      content: (
        <>
          <p>
            No. An agent reaches Backstory through the same sign-in as chat, so it can only return what the signed-in Backstory
            user can see.
          </p>
          <ul className="mt-2 list-disc space-y-1.5 pl-5">
            <li>
              <strong className="text-ac-dark">Copilot Studio:</strong> each person signs in with their own Backstory login the first
              time they use the agent, so answers follow their permissions.
            </li>
            <li>
              <strong className="text-ac-dark">n8n:</strong> a workflow runs on the credential of whoever connected it. It sees what
              that person can see, and its output goes wherever the workflow sends it, such as a shared Slack channel. Connect it
              with a login whose access suits everyone who will see that output.
            </li>
          </ul>
          <p className="mt-2">For any other tool, check how it handles sign-in before you share an agent with your team.</p>
        </>
      ),
    },
    {
      value: 'api',
      title: 'How does API access work?',
      content: (
        <>
          <p>
            The API uses an API key and secret instead of a person&rsquo;s sign-in. Code trades them for an access token that
            lasts two hours, then sends that token with each request. An API key sees your whole organization&rsquo;s data. MCP
            sees only what each signed-in person can see. That&rsquo;s why API integrations are usually set up by an admin.
            Confirm with your Backstory team how API access works for your workspace.
          </p>
          <p className="mt-2">
            Most of the API only reads data. The exceptions start a bulk export or add an email activity to Backstory. Keep the
            key and secret in a secrets manager, never in code or a shared document.
          </p>
        </>
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
          <p className="mt-2">Using Copilot, Gemini, or another AI tool? Its own data policies apply.</p>
        </>
      ),
    },
    {
      value: 'can-see',
      title: 'What can your AI tool see through Backstory?',
      content: (
        <Checklist
          items={[
            'Accounts and opportunities the user has access to in Backstory, including lists of up to 1,000 at a time',
            'Summaries of emails, calls, and meetings from the last 30 days, matched to those records',
            'Deal risks, next steps, engaged contacts, and scorecard coverage',
            'Answers from Backstory’s own assistant, up to 90 days back',
            'Similar deals at other customers, where your organization has turned this on (beta)',
            'Filings and earnings news about publicly traded companies',
          ]}
        />
      ),
    },
    {
      value: 'thirty-days',
      title: 'Why do some answers cover 30 days and others go further?',
      content: (
        <>
          <p>
            Backstory prepares its quick summaries in advance: account and deal status, engaged people, and recent activity
            (get_account_status, get_engaged_people, get_recent_account_activity, and their deal-level versions). They cover
            the last 30 days. Because they&rsquo;re prepared ahead, they come back fast and use fewer of your AI tool&rsquo;s
            tokens. For a general summary, 30 days is usually enough.
          </p>
          <p className="mt-2">
            For anything outside that, Backstory&rsquo;s assistant tools take over: ask_sales_ai_about_account and
            ask_sales_ai_about_opportunity. Use them for more than 30 days of context, product- or topic-specific questions, or
            the reasoning behind a risk. They look back up to 90 days. Big themes hold up well; details get thinner past about
            60 days, so check key dates. Questions? Your Backstory CSM can help.
          </p>
        </>
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
            'Look up your calendar ahead or a single email, such as “my next meeting” (Backstory captures meetings by account; add your calendar or email connector to the same AI tool for these)',
            'Read full call transcripts',
            'Give a quick summary of activity older than 30 days (for older context, up to 90 days, ask Backstory’s assistant)',
            'Compare before and now, such as stage changes or engagement trends',
            'Read forecast data or the commit category (use Backstory Forecasting in the app)',
            'List won or lost deals, or look at past quarters',
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
      >
        <div className="mt-6">
          <ResourceKitLink stage="trust-it" />
        </div>
      </SectionHero>
      <TocLayout className="space-y-16">
        <section id="basics" data-toc="At a glance" className="grid gap-4 md:grid-cols-3">
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
        </section>

        <section id="faq" data-toc="Security & data FAQ">
          <SectionHeading kicker="For admins · share with your champion" title="Security & data FAQ" />
          <Accordion items={faq} defaultValue={['moves']} />
        </section>

        <section id="rough" data-toc="Where it’s still rough">
          <SectionHeading
            title="Where it’s still rough"
            intro="You’ll find these on your own eventually, so here they are up front, each with its fix."
          />
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

        <section id="troubleshooting" data-toc="Troubleshooting">
          <SectionHeading title="Troubleshooting" />
          <Accordion items={TROUBLESHOOTING} />
        </section>

        <section id="help" data-toc="More detail and help">
          <SectionHeading title="More detail and help" />
          <ul className="surface-card space-y-2.5 p-6 text-[14px]">
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

        <ResourceKit stage="trust-it" />

        <NextStep text="Next: your first 15 minutes." to="/use-it" label="Use it" />
      </TocLayout>
    </div>
  );
}
