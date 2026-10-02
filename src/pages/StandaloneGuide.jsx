import { useEffect } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowRight, Clock, ExternalLink, FileText, UserRound } from 'lucide-react';
import { TooltipProvider } from '../components/ui/Tooltip';
import { BrandMark } from '../components/BrandMark';
import { CopyButton } from '../components/ui/CopyButton';
import { HelpLink } from '../components/HelpLink';
import { GUIDES, findGuide, guideUrl } from '../data/connectGuides';
import { downloads } from '../lib/content';
import { assetUrl } from '../lib/cn';
import { GuideContent, PlatformLogo, PlatformSwitcher } from './ConnectGuide';

// Standalone setup guides: the same steps as /use-it/connect/<platform>, on a page with no
// site navigation, so the Help Center and internal docs can link straight to one guide.
const pdfUrl = (id) => assetUrl(`assets/downloads/${downloads[id].file}`);

function PdfLink({ id, label = 'PDF version' }) {
  return (
    <a href={pdfUrl(id)} target="_blank" rel="noopener" className="inline-flex items-center gap-1.5 text-[13.5px] font-medium text-ac-coral-dark hover:underline">
      <FileText size={14} /> {label}
    </a>
  );
}

function Shell({ children }) {
  useEffect(() => window.scrollTo(0, 0), []);
  return (
    <TooltipProvider>
      <header className="border-b border-ac-light-gray bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-4 sm:px-8">
          <span className="flex items-center gap-2 text-[15px] font-bold text-ac-dark">
            <BrandMark /> Backstory MCP
          </span>
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-ac-med-gray">Setup guide</span>
        </div>
      </header>
      <main className="mx-auto max-w-4xl space-y-6 px-4 py-8 sm:px-8">{children}</main>
      <footer className="mt-6 border-t border-ac-light-gray">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-6 text-[13px] sm:px-8">
          <HelpLink k="connect" label="Help Center: Backstory MCP" />
          <Link to="/" className="inline-flex items-center gap-1.5 font-medium text-ac-coral-dark hover:underline">
            Prompts, examples, and more guides <ArrowRight size={13} />
          </Link>
        </div>
      </footer>
    </TooltipProvider>
  );
}

export function StandaloneGuide() {
  const { platform } = useParams();
  const g = findGuide(platform);
  if (!g) return <Navigate to="/guides" replace />;

  return (
    <Shell key={g.id}>
      <div>
        <h1 className="font-display text-[28px] font-bold leading-tight tracking-[-0.01em] text-ac-dark">Connect Backstory to {g.name}</h1>
        <p className="mt-2 max-w-2xl text-[15px] leading-7 text-ac-dark-secondary">{g.summary}</p>
        <div className="mt-4 flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-[0.1em] text-ac-dark-secondary">
          <span className="inline-flex items-center gap-1.5 rounded-md bg-ac-cream px-2.5 py-1"><UserRound size={12} /> {g.setup}</span>
          <span className="inline-flex items-center gap-1.5 rounded-md bg-ac-cream px-2.5 py-1"><Clock size={12} /> {g.time}</span>
          <CopyButton text={guideUrl(g.id)} label="Copy link to this guide" className="normal-case tracking-normal" />
        </div>
      </div>

      <GuideContent g={g} pdfAction={g.pdf && <PdfLink id={g.pdf} />} />

      <section>
        <h2 className="eyebrow mb-3">Using a different assistant?</h2>
        <PlatformSwitcher current={g.id} base="/guides" />
      </section>
    </Shell>
  );
}

// Every guide on one page, each with its standalone link and its PDF.
export function GuideIndex() {
  return (
    <Shell>
      <div>
        <h1 className="font-display text-[28px] font-bold leading-tight tracking-[-0.01em] text-ac-dark">Connect Backstory to your AI assistant</h1>
        <p className="mt-2 max-w-2xl text-[15px] leading-7 text-ac-dark-secondary">
          One step-by-step guide per assistant. Each has its own link you can share, bookmark, or add to your team&rsquo;s documentation.
        </p>
      </div>
      <div className="surface-card divide-y divide-ac-light-gray">
        {GUIDES.map((g) => (
          <div key={g.id} className="flex flex-wrap items-center gap-x-4 gap-y-3 p-5">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-ac-light-gray bg-ac-warm-white">
              <PlatformLogo guide={g} className="h-6 w-6" />
            </span>
            <div className="min-w-0 flex-1 basis-[220px]">
              <Link to={`/guides/${g.id}`} className="font-display text-[16px] font-bold text-ac-dark no-underline hover:text-ac-coral-dark">
                {g.name}
              </Link>
              <p className="text-[13px] leading-5 text-ac-dark-secondary">{g.setup} · {g.time.toLowerCase()} · {g.steps.length} steps</p>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              {g.pdf && <PdfLink id={g.pdf} label="PDF" />}
              <CopyButton text={guideUrl(g.id)} label="Copy link" />
              <Link to={`/guides/${g.id}`} className="inline-flex items-center gap-1.5 text-[13.5px] font-medium text-ac-coral-dark hover:underline">
                Open guide <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        ))}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-3 p-5">
          <div className="min-w-0 flex-1 basis-[220px]">
            <span className="font-display text-[16px] font-bold text-ac-dark">Gemini CLI</span>
            <p className="text-[13px] leading-5 text-ac-dark-secondary">For developers · PDF guide only</p>
          </div>
          <a href={pdfUrl('connectGeminiCli')} target="_blank" rel="noopener" className="inline-flex items-center gap-1.5 text-[13.5px] font-medium text-ac-coral-dark hover:underline">
            Open the PDF <ExternalLink size={13} />
          </a>
        </div>
      </div>
    </Shell>
  );
}
