import { ArrowRight, ExternalLink } from 'lucide-react';
import { SectionHero } from '../components/SectionHero';
import { Button } from '../components/ui/Button';
import { examples, site } from '../lib/content';

export function StretchIt() {
  return (
    <div className="container-page">
      <SectionHero
        eyebrow="04 · Stretch it"
        title="From a prompt to an automation"
        subtitle="Everything so far happens when you ask. The next step is having it happen on its own: a brief before every meeting, a risk review every Monday, delivered to Slack, Teams, or email."
        image="bg-05.jpg"
      />
      <div className="mx-auto max-w-4xl space-y-6">
        <section>
          <h2 className="eyebrow mb-3">Each prompt has an automated version</h2>
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
            <Button as="a" href={site.mcpReferenceUrl} target="_blank" rel="noopener" variant="secondary">
              MCP technical reference
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
