import { ExternalLink, Eye, KeyRound, Lock } from 'lucide-react';
import { SectionHero } from '../components/SectionHero';
import { Checklist } from '../components/Checklist';
import { NextStep } from '../components/NextStep';
import { HelpLink } from '../components/HelpLink';
import { site } from '../lib/content';

const PILLARS = [
  [KeyRound, 'Sign-in', 'You sign in yourself', 'Connecting opens a standard Backstory sign-in (OAuth 2.0). Your password is never shared with the AI assistant, and you can disconnect at any time.'],
  [Eye, 'Access', 'Your permissions, not more', 'The assistant sees only the accounts and deals your Backstory login can already see. A rep sees their book; a manager sees their team.'],
  [Lock, 'Read-only', 'It can look, not change', 'The connector can only read. It cannot update your CRM, send email, or change anything in Backstory.'],
];

export function TrustIt() {
  return (
    <div className="container-page">
      <SectionHero
        eyebrow="02 · Trust it"
        title="Safe by design"
        subtitle="The Backstory MCP can only read, only shows you what you are already allowed to see, and asks you to sign in yourself."
        image="bg-02.jpg"
      />
      <div className="mx-auto max-w-4xl space-y-6">
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

        <div className="grid gap-4 md:grid-cols-2">
          <section className="surface-card p-6">
            <h2 className="eyebrow mb-4">What it can see</h2>
            <Checklist
              items={[
                'Accounts and opportunities you have access to in Backstory',
                'Summaries of emails, calls, and meetings from the last 30 days, matched to those records',
                'Deal risks, next steps, engaged contacts, and scorecard coverage',
                'Public news about publicly traded companies',
              ]}
            />
          </section>
          <section className="surface-card p-6">
            <h2 className="eyebrow mb-4">What it can&rsquo;t do</h2>
            <Checklist
              negative
              items={[
                'Change CRM records or anything else in Backstory',
                'Read your calendar or full call transcripts',
                'Report metrics, historical roll-ups, or trends older than 30 days',
                'See accounts or deals outside your own permissions',
              ]}
            />
          </section>
        </div>

        <div className="rounded-xl border border-ac-horizon-100 bg-ac-horizon-50 px-5 py-4 text-[14px] leading-6 text-ac-dark">
          <strong>Good habit:</strong> treat answers like a well-briefed colleague&rsquo;s notes. They&rsquo;re grounded in your data,
          but check key details before you send anything to a customer.
        </div>

        <section className="surface-card p-6">
          <h2 className="eyebrow mb-4">More detail</h2>
          <ul className="space-y-2.5 text-[14px]">
            <li><HelpLink k="security" label="Backstory MCP security overview" /></li>
            <li><HelpLink k="permissions" label="How Backstory permissions work" /></li>
            <li><HelpLink k="troubleshooting" label="Troubleshooting the connector" /></li>
            <li>
              <a href={site.mcpReferenceUrl} target="_blank" rel="noopener" className="inline-flex items-center gap-1.5 font-medium text-ac-coral-dark hover:underline">
                Technical reference: MCP tools and limits <ExternalLink size={13} />
              </a>
            </li>
          </ul>
        </section>

        <NextStep text="Next: your first 15 minutes." to="/use-it" label="Use it" />
      </div>
    </div>
  );
}
