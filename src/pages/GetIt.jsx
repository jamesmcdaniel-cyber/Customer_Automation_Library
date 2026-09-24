import { SectionHero } from '../components/SectionHero';
import { Accordion } from '../components/ui/Accordion';
import { NextStep } from '../components/NextStep';

const BRINGS = [
  ['Your customer activity', 'Emails, calls, and meetings from the last 30 days, matched to the right account and deal in your CRM.'],
  ['Deal context', 'Risks, agreed next steps, topics under discussion, and scorecard coverage (MEDDIC, MEDDPICC, SPICED).'],
  ['The people involved', 'Who is engaged on the customer’s side, their titles, and how active they’ve been.'],
  ['Lessons from similar deals', 'Past deals with similar situations, and how they turned out.'],
];

const GLOSSARY = [
  ['MCP', 'Model Context Protocol. An open standard that lets AI assistants connect to other software, the way USB lets any device plug into any computer.'],
  ['Connector', 'The link between your AI assistant and Backstory. You add it once, in your assistant’s settings.'],
  ['Tool', 'One specific thing the assistant can look up through the connector, such as “find an account” or “get recent activity”. The assistant picks the right tools for your question.'],
  ['Prompt', 'What you type to the assistant. Plain English works; naming the account helps.'],
  ['Account / opportunity', 'The same customers and deals you see in your CRM. Backstory matches your emails, calls, and meetings to them.'],
];

export function GetIt() {
  return (
    <div className="container-page">
      <SectionHero
        eyebrow="01 · Get it"
        title="What is MCP, and why should I care?"
        subtitle="You already use an AI assistant. MCP lets it look things up in Backstory for you, so its answers are about your real customers instead of guesses."
        image="bg-01.jpg"
      />
      <div className="mx-auto max-w-4xl space-y-6">
        <section className="surface-card p-6">
          <h2 className="eyebrow mb-3">The standard plug</h2>
          <div className="prose-ac">
            <p>
              Before standard plugs, every appliance needed its own kind of socket. MCP does for AI what the standard plug did
              for electricity: any assistant that supports MCP can connect to any tool that supports it, including Backstory.
            </p>
            <p className="!mb-0">
              Once connected, you don&rsquo;t need to learn new software. You ask a question in plain English; the assistant
              fetches what it needs from Backstory and answers.
            </p>
          </div>
        </section>

        <section>
          <h2 className="eyebrow mb-3">What Backstory brings</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {BRINGS.map(([t, d]) => (
              <div key={t} className="surface-card p-5">
                <h3 className="font-display text-[15px] font-bold">{t}</h3>
                <p className="mt-1.5 text-[13.5px] leading-6 text-ac-dark-secondary">{d}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="surface-card p-6">
          <h2 className="eyebrow mb-3">Which assistants work with it?</h2>
          <p className="text-[15px] leading-7 text-ac-dark-secondary">
            Any assistant that supports MCP connectors. The guides here use <strong className="text-ac-dark">Claude</strong> and{' '}
            <strong className="text-ac-dark">ChatGPT</strong>, which both let you add Backstory from their settings screen in about
            five minutes.
          </p>
        </section>

        <section>
          <h2 className="eyebrow mb-3">Five words to know</h2>
          <Accordion items={GLOSSARY.map(([t, d]) => ({ value: t, title: t, content: d }))} defaultValue={['MCP']} />
        </section>

        <NextStep text="Next: how Backstory keeps your data safe." to="/trust-it" label="Trust it" />
      </div>
    </div>
  );
}
