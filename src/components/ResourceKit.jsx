import { ArrowDown, ExternalLink, FolderDown } from 'lucide-react';
import { resources, site } from '../lib/content';
import { Button } from './ui/Button';
import { Download } from './Download';

// The leave-behind resources for one stage (src/data/resources.json): PDFs and articles
// customers can share with their teams for training, refreshers, and rollout.
export function ResourceKit({ stage }) {
  return (
    <section id="resources" className="scroll-mt-24 rounded-xl border border-ac-horizon-100 bg-ac-horizon-50 p-6">
      <div className="eyebrow mb-2 !text-ac-coral-dark">Take it to your team</div>
      <h2 className="font-display text-[19px] font-bold">Leave-behind resources</h2>
      <p className="mt-1.5 max-w-3xl text-[14px] leading-6 text-ac-dark-secondary">
        We built these for you to share with your team. Use them for training, refreshers, and adoption: download, print,
        or forward them.
      </p>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {resources[stage].map((r) => (
          <div key={r.title} className="surface-card flex flex-col p-5">
            <span className="mb-2 self-start rounded-md bg-ac-coral/12 px-2 py-0.5 font-mono text-[10.5px] font-medium uppercase tracking-[0.1em] text-ac-coral-dark">
              For {r.audience.toLowerCase()}
            </span>
            <h3 className="font-display text-[15px] font-bold">{r.title}</h3>
            <p className="mt-1 flex-1 text-[13.5px] leading-6 text-ac-dark-secondary">{r.body}</p>
            <ul className="mt-3 space-y-1.5 border-t border-ac-light-gray pt-3 text-[13.5px]">
              {r.items.map((item) => (
                <li key={item.label}>
                  {item.pdf ? (
                    <Download id={item.pdf} inline label={item.label} />
                  ) : (
                    <a href={site.intercom[item.help]} target="_blank" rel="noopener" className="inline-flex items-center gap-1.5 font-medium text-ac-coral-dark hover:underline">
                      {item.label} <ExternalLink size={13} />
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

// Hero link down to the stage's resources, so the PDFs read as a kit, not "this page as a PDF".
export function ResourceKitLink({ stage }) {
  const n = resources[stage].length;
  return (
    <Button as="a" href="#resources" variant="secondary" size="sm" className="border-white/30 bg-transparent text-white hover:border-white">
      <FolderDown size={14} /> {n} leave-behind resource{n === 1 ? '' : 's'}
      <span className="-ml-1.5 hidden sm:inline">for your team</span> <ArrowDown size={13} />
    </Button>
  );
}
