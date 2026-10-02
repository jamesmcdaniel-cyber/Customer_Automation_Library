import { useState } from 'react';
import { Description, Title } from '@radix-ui/react-dialog';
import { Eye, Maximize2, Minimize2, X } from 'lucide-react';
import { Dialog, DialogClose, DialogContent, DialogTrigger } from './ui/Dialog';
import { Button } from './ui/Button';
import { downloads, pages, site } from '../lib/content';
import { assetUrl, cn } from '../lib/cn';

// Leave-behind resources open in a small window on the page, never as a download. A PDF shows
// as its pages, pre-rendered to images in public/assets/resources/<id>/ (p01.jpg, ... plus
// thumb.jpg for cards), sized from src/data/pages.json. The tour shows as its live embed.
const TOUR = 'tour';

export const thumbUrl = (id) => assetUrl(`assets/resources/${id}/thumb.jpg`);
const pageUrl = (id, i) => assetUrl(`assets/resources/${id}/p${String(i + 1).padStart(2, '0')}.jpg`);
const pageCount = (id) => {
  const n = pages[id].count;
  return `${n} page${n === 1 ? '' : 's'}`;
};

export function resourceTitle(id) {
  return id === TOUR ? 'A day in the life with Backstory MCP' : downloads[id].title;
}

// Window sizes: compact by default, enlargeable to nearly the full screen. The tour keeps its
// 16:9 shape, so its width is also capped by the height available for it.
const SIZES = {
  pdf: { small: 'w-[min(760px,calc(100vw-32px))] max-h-[88vh]', large: 'w-[min(1400px,calc(100vw-32px))] max-h-[94vh]' },
  tour: {
    small: 'w-[min(960px,calc(100vw-32px),calc((88vh-64px)*1.7778))] max-h-[88vh]',
    large: 'w-[min(calc(100vw-32px),calc((94vh-64px)*1.7778))] max-h-[94vh]',
  },
};

export function ResourceDialog({ id, children }) {
  const tour = id === TOUR;
  const title = resourceTitle(id);
  const [large, setLarge] = useState(false);
  return (
    <Dialog onOpenChange={(open) => !open && setLarge(false)}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent padded={false} hideClose size={SIZES[tour ? 'tour' : 'pdf'][large ? 'large' : 'small']}>
        <div className="sticky top-0 z-10 flex items-center justify-between gap-3 rounded-t-2xl border-b border-ac-light-gray bg-ac-card px-5 py-3.5">
          <div className="min-w-0">
            <Title className="truncate font-display text-[15px] font-bold text-ac-dark">{title}</Title>
            <Description className="font-mono text-[11px] text-ac-med-gray">
              {tour ? 'Interactive tour · click through at your own pace' : pageCount(id)}
            </Description>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={() => setLarge((v) => !v)}
              className="hidden h-8 w-8 place-items-center rounded-lg text-ac-med-gray hover:bg-ac-cream hover:text-ac-dark sm:grid"
              aria-label={large ? 'Make the window smaller' : 'Enlarge the window'}
              title={large ? 'Smaller' : 'Enlarge'}
            >
              {large ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
            <DialogClose
              className="grid h-8 w-8 place-items-center rounded-lg text-ac-med-gray hover:bg-ac-cream hover:text-ac-dark"
              aria-label="Close"
            >
              <X size={18} />
            </DialogClose>
          </div>
        </div>
        {tour ? (
          <div className="aspect-video w-full overflow-hidden rounded-b-2xl">
            <iframe src={site.tourUrl} title={title} allow="fullscreen" className="h-full w-full border-0" />
          </div>
        ) : (
          <div className="space-y-3 rounded-b-2xl bg-ac-warm-white p-4">
            {Array.from({ length: pages[id].count }, (_, i) => (
              <img
                key={i}
                src={pageUrl(id, i)}
                width={pages[id].w}
                height={pages[id].h}
                loading={i < 2 ? 'eager' : 'lazy'}
                alt={`${title}, page ${i + 1}`}
                className="block h-auto w-full rounded-md border border-ac-light-gray bg-white shadow-card"
              />
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// A button or inline link that opens one resource in the window.
export function ResourceButton({ id, label, tone, inline = false, className }) {
  const meta = id === TOUR ? null : pageCount(id);
  if (inline) {
    return (
      <ResourceDialog id={id}>
        <button type="button" className={cn('inline-flex items-center gap-1.5 font-medium text-ac-coral-dark hover:underline', className)}>
          {label} {meta && <span className="font-normal text-ac-med-gray">({meta})</span>} <Eye size={13} />
        </button>
      </ResourceDialog>
    );
  }
  return (
    <ResourceDialog id={id}>
      <Button
        type="button"
        variant="secondary"
        size="sm"
        className={cn('shrink-0', tone === 'dark' && 'border-white/30 bg-transparent text-white hover:border-white', className)}
      >
        <Eye size={14} /> {label}
        {meta && <span className="font-mono text-[10.5px] font-medium opacity-70">{meta}</span>}
      </Button>
    </ResourceDialog>
  );
}

// A first-page thumbnail that opens the resource.
export function ResourceThumb({ id, label, aspect = 'aspect-[16/9]' }) {
  return (
    <ResourceDialog id={id}>
      <button type="button" className="group block w-full text-left" aria-label={`Open ${resourceTitle(id)}`}>
        <span className={cn('block overflow-hidden rounded-lg border border-ac-light-gray bg-ac-warm-white transition-all duration-200 group-hover:border-ac-coral group-hover:shadow-cardhover', aspect)}>
          <img src={thumbUrl(id)} alt="" loading="lazy" className="h-full w-full object-cover object-left-top" />
        </span>
        {label && <span className="mt-1.5 block text-[12.5px] font-medium leading-4 text-ac-dark group-hover:text-ac-coral-dark">{label}</span>}
      </button>
    </ResourceDialog>
  );
}
