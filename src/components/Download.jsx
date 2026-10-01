import { Download as DownloadIcon } from 'lucide-react';
import { downloads } from '../lib/content';
import { assetUrl, cn } from '../lib/cn';
import { Button } from './ui/Button';

// A take-away PDF from the MCP 101 series, attached to the section it supports. The page
// carries the content; the PDF is the version people print or forward. Files live in
// public/assets/downloads/, listed in src/data/downloads.json.
export function Download({ id, label = 'Download PDF', tone, inline = false, className }) {
  const d = downloads[id];
  const pages = `${d.pages} page${d.pages === 1 ? '' : 's'}`;
  const link = {
    href: assetUrl(`assets/downloads/${d.file}`),
    download: `Backstory - ${d.title}.pdf`,
    title: `${d.title} (PDF, ${pages})`,
  };

  if (inline) {
    return (
      <a {...link} className={cn('inline-flex items-center gap-1.5 font-medium text-ac-coral-dark hover:underline', className)}>
        {label} <span className="font-normal text-ac-med-gray">(PDF, {pages})</span> <DownloadIcon size={13} />
      </a>
    );
  }

  return (
    <Button
      as="a"
      {...link}
      variant="secondary"
      size="sm"
      className={cn('shrink-0', tone === 'dark' && 'border-white/30 bg-transparent text-white hover:border-white', className)}
    >
      <DownloadIcon size={14} /> {label}
      <span className="font-mono text-[10.5px] font-medium opacity-70">{pages}</span>
    </Button>
  );
}
