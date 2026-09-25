import { ImageIcon } from 'lucide-react';

// A screenshot from site.json, or a labelled slot until one is added.
export function Screenshot({ src, alt }) {
  if (src) return <img src={src} alt={alt} className="mt-3 w-full rounded-lg border border-ac-light-gray shadow-card" loading="lazy" />;
  return (
    <div className="mt-3 flex items-center gap-2.5 rounded-lg border border-dashed border-ac-light-gray bg-ac-warm-white px-4 py-3 text-[12.5px] text-ac-med-gray">
      <ImageIcon size={15} className="shrink-0" />
      <span>Screenshot coming soon: {alt}</span>
    </div>
  );
}
