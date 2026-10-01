import { ArrowDown, ExternalLink, FolderDown } from 'lucide-react';
import { resources, site } from '../lib/content';
import { Button } from './ui/Button';
import { ResourceButton, ResourceThumb } from './Resource';

// An item opens in the resource window when it's a PDF or the tour; help articles open in a
// new tab, because the Help Center can't be shown inside another page.
const viewId = (item) => item.pdf || (item.url === 'tour' ? 'tour' : null);
const actionLabel = (item) => (item.url ? item.label : `Open the ${item.label.toLowerCase()}`);

function HelpLinks({ items }) {
  return items
    .filter((i) => i.help)
    .map((i) => (
      <a key={i.label} href={site.intercom[i.help]} target="_blank" rel="noopener" className="inline-flex items-center gap-1.5 font-medium text-ac-coral-dark hover:underline">
        {i.label} <ExternalLink size={13} />
      </a>
    ));
}

function ResourceCard({ r }) {
  const views = r.items.filter(viewId);
  const header = (
    <>
      <span className="mb-2 self-start rounded-md bg-ac-coral/12 px-2 py-0.5 font-mono text-[10.5px] font-medium uppercase tracking-[0.1em] text-ac-coral-dark">
        For {r.audience.toLowerCase()}
      </span>
      <h3 className="font-display text-[15px] font-bold">{r.title}</h3>
      <p className="mt-1 text-[13.5px] leading-6 text-ac-dark-secondary">{r.body}</p>
    </>
  );

  // A series (several files) shows a thumbnail per file; anything else leads with its one thumbnail.
  if (views.length > 1) {
    return (
      <div className="surface-card flex flex-col p-5">
        {header}
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {views.map((item) => (
            <ResourceThumb key={item.label} id={viewId(item)} label={item.label} aspect="aspect-[4/3]" />
          ))}
        </div>
      </div>
    );
  }
  const item = views[0];
  return (
    <div className="surface-card flex flex-col p-5">
      {item && (
        <div className="mb-4">
          <ResourceThumb id={viewId(item)} />
        </div>
      )}
      {header}
      <div className="mt-auto flex flex-wrap gap-x-4 gap-y-1.5 border-t border-ac-light-gray pt-3 text-[13.5px]">
        {item && <ResourceButton id={viewId(item)} inline label={actionLabel(item)} />}
        <HelpLinks items={r.items} />
      </div>
    </div>
  );
}

// The leave-behind resources for one stage (src/data/resources.json): PDFs, the tour, and
// articles customers can share with their teams for training, refreshers, and adoption.
export function ResourceKit({ stage }) {
  return (
    <section id="resources" className="scroll-mt-24 rounded-xl border border-ac-horizon-100 bg-ac-horizon-50 p-6">
      <div className="eyebrow mb-2 !text-ac-coral-dark">Take it to your team</div>
      <h2 className="font-display text-[19px] font-bold">Leave-behind resources</h2>
      <p className="mt-1.5 max-w-3xl text-[14px] leading-6 text-ac-dark-secondary">
        We built these for you to share with your team. Use them for training, refreshers, and adoption. Select any one to
        open it right here.
      </p>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {resources[stage].map((r) => (
          <ResourceCard key={r.title} r={r} />
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
