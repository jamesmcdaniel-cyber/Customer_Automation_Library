import { Code2, MessageSquare, Plug, Archive } from 'lucide-react';
import { SectionHero } from '../components/SectionHero';
import { Accordion } from '../components/ui/Accordion';
import { NextStep } from '../components/NextStep';
import { AfterDiagram, BeforeDiagram } from '../components/IntegrationDiagram';

// Each drawer is one group of Backstory tools.
const DRAWERS = [
  ['Find', 'Look up an account or deal by name or Salesforce ID.'],
  ['Lists', 'Pull up to 1,000 accounts or deals from a plain-language filter, like “deals closing this quarter”.'],
  ['Activity', 'Emails, calls, and meetings from the last 30 days, matched to your CRM.'],
  ['Deal context', 'Risks, agreed next steps, topics, and scorecard coverage.'],
  ['People', 'Who is engaged on the customer’s side, and how active they are.'],
  ['Analysis', 'Ask Backstory’s Sales AI a harder question about an account or deal, and get a synthesized answer.'],
  ['News', 'Recent news and filings for publicly traded companies.'],
  ['Precedents', 'Similar past deals, and how they turned out. In beta, and your organization turns it on.'],
];

const GLOSSARY = [
  ['MCP', 'Model Context Protocol. An open standard that lets AI assistants connect to other tools and use them, without a custom integration for every pairing.'],
  ['Connector', 'The link between your AI assistant and Backstory. You add it once, in your assistant’s settings.'],
  ['Tool', 'One specific thing the assistant can do through the connector, such as “find an account” or “get recent activity”. In the filing-cabinet picture, each tool is one drawer.'],
  ['Tool call', 'The moment the assistant actually opens a drawer. You can see it happen in the conversation, which is how you know the answer came from Backstory and not from general knowledge.'],
  ['Prompt', 'What you type to the assistant. Plain English works; naming the account helps.'],
  ['API', 'A way for software to talk to Backstory directly, with exact requests and exact outputs. Built for code, not for conversation.'],
];

function Analogy({ icon: Icon, tag, title, children }) {
  return (
    <div className="surface-card flex flex-col p-6">
      <div className="mb-3 flex items-center gap-2">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-ac-coral/12 text-ac-coral-dark">
          <Icon size={16} />
        </span>
        <span className="font-mono text-[10.5px] font-medium uppercase tracking-[0.12em] text-ac-coral-dark">{tag}</span>
      </div>
      <h3 className="font-display text-[17px] font-bold leading-snug">{title}</h3>
      <div className="mt-2 text-[14px] leading-6 text-ac-dark-secondary">{children}</div>
    </div>
  );
}

function BeforeAfter() {
  return (
    <div className="mt-4 space-y-3 font-mono text-[10.5px] uppercase tracking-[0.06em]">
      <div className="rounded-lg border border-ac-light-gray bg-ac-warm-white p-3">
        <div className="mb-1 text-ac-med-gray">Before MCP</div>
        <p className="mb-2.5 font-sans text-[13px] normal-case tracking-normal text-ac-dark-secondary">
          Every AI assistant needed its own custom integration to every tool.
        </p>
        <BeforeDiagram />
      </div>
      <div className="rounded-lg border border-ac-coral/40 bg-ac-horizon-50 p-3">
        <div className="mb-1 text-ac-coral-dark">Now</div>
        <p className="mb-2.5 font-sans text-[13px] normal-case tracking-normal text-ac-dark-secondary">
          Each assistant connects once, to the Backstory MCP server. Backstory already captures your CRM, email, and calls.
        </p>
        <AfterDiagram />
      </div>
    </div>
  );
}

export function GetIt() {
  return (
    <div className="container-page">
      <SectionHero
        eyebrow="01 · Get it"
        title="MCP in plain English"
        subtitle="MCP is one of the most common words in GTM right now, and it's rarely explained simply. It's a standard that lets AI assistants like Claude or ChatGPT connect to tools and use them, without every integration being built from scratch."
        image="bg-01.jpg"
      />
      <div className="mx-auto max-w-5xl space-y-8">
        <section>
          <h2 className="eyebrow mb-3">Two ways to picture it</h2>
          <div className="grid items-start gap-4 md:grid-cols-2">
            <Analogy icon={Archive} tag="The filing cabinet" title="Backstory is the filing cabinet. Claude is the analyst.">
              <p>
                MCP is the badge that opens specific drawers, and each Backstory tool is one drawer. The analyst can only open
                the drawers your badge allows, and only when your question needs them.
              </p>
              <div className="mt-4 space-y-1.5">
                {DRAWERS.map(([name, desc]) => (
                  <div key={name} className="flex gap-3 rounded-lg border border-ac-light-gray bg-ac-warm-white px-3 py-2">
                    <span className="w-24 shrink-0 font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-ac-coral-dark">{name}</span>
                    <span className="text-[13px] leading-5">{desc}</span>
                  </div>
                ))}
              </div>
            </Analogy>
            <Analogy icon={Plug} tag="The standard plug" title="One standard plug. Every appliance. Every wall.">
              <p>
                Before standard plugs, every device needed its own custom connection to your wall. With one standard plug, any
                appliance works anywhere.
              </p>
              <p className="mt-3">
                MCP does the same for AI: any assistant that supports MCP can plug into any tool that supports it, including
                Backstory.
              </p>
              <BeforeAfter />
            </Analogy>
          </div>
        </section>

        <section>
          <h2 className="eyebrow mb-3">MCP vs API</h2>
          <p className="mb-4 max-w-3xl text-[15px] leading-7 text-ac-dark-secondary">
            APIs and MCP both expose what a tool can do, but they&rsquo;re designed for different users. MCP doesn&rsquo;t replace
            the API. It sits on top of it and gives AI a standard way to use it.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <Analogy icon={Code2} tag="API · built for code" title="You fill out the form yourself.">
              A developer sends a request to an exact endpoint, with exact parameters, in an exact format.
            </Analogy>
            <Analogy icon={MessageSquare} tag="MCP · built for AI" title="You say what you want, and someone else fills out the form.">
              The AI sees which tools are available, decides which ones are relevant, and uses them based on what you asked. You
              don&rsquo;t handle every field yourself.
            </Analogy>
          </div>
        </section>

        <section className="rounded-xl border border-ac-horizon-100 bg-ac-horizon-50 p-6">
          <h2 className="font-display text-[19px] font-bold">Why this matters for GTM</h2>
          <p className="mt-2 text-[15px] leading-7 text-ac-dark-secondary">
            GTM stacks are fragmented: CRM, sales intelligence, email, content, enrichment, analytics. MCP lets AI stop being one
            more tab in that stack and become the layer that works across it. Instead of only generating content, your assistant
            can understand your GTM system and pull from each part of it, and the chat you type into starts to work like an
            operating system for your GTM team.
          </p>
        </section>

        <section>
          <h2 className="eyebrow mb-3">Words to know</h2>
          <Accordion items={GLOSSARY.map(([t, d]) => ({ value: t, title: t, content: d }))} defaultValue={['MCP']} />
        </section>

        <NextStep text="Next: what moves, who can see it, and where it's still rough." to="/trust-it" label="Trust it" />
      </div>
    </div>
  );
}
