import { ExternalLink } from 'lucide-react';
import { site } from '../lib/content';

// An Intercom article link, or a quiet placeholder until the URL is set in site.json.
export function HelpLink({ k, label }) {
  const url = site.intercom?.[k];
  if (!url) return <span className="text-ac-med-gray">{label} (help article coming soon)</span>;
  return (
    <a href={url} target="_blank" rel="noopener" className="inline-flex items-center gap-1.5 font-medium text-ac-coral-dark hover:underline">
      {label} <ExternalLink size={13} />
    </a>
  );
}
