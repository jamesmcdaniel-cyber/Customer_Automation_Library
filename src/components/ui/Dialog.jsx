import * as RD from '@radix-ui/react-dialog';
import { X } from 'lucide-react';

export const Dialog = RD.Root;
export const DialogTrigger = RD.Trigger;
export const DialogClose = RD.Close;

// `padded` and `hideClose` are props rather than something a caller overrides
// through `className`: this content element is the scroll container, so a
// caller passing `p-0` on top of the default `p-7` gets whichever utility the
// stylesheet defines last, and any leftover padding pushes a sticky child down
// and leaves a gap that scrolling content shows through. Content that manages
// its own chrome (sticky headers, in-header close buttons) opts out instead.
// `size` sets width and max height the same way, so a caller can resize the window.
export function DialogContent({ children, className = '', padded = true, hideClose = false, size = 'w-[min(720px,calc(100vw-32px))] max-h-[88vh]' }) {
  return (
    <RD.Portal>
      <RD.Overlay className="fixed inset-0 z-50 bg-ac-dark/40 animate-overlay-in" />
      <RD.Content
        className={
          'fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 ' +
          size +
          ' ' +
          'overflow-y-auto rounded-2xl border border-ac-light-gray bg-ac-card shadow-menu animate-content-in ' +
          (padded ? 'p-7 ' : '') +
          className
        }
      >
        {children}
        {hideClose ? null : (
          <RD.Close
            className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-lg text-ac-med-gray hover:bg-ac-cream hover:text-ac-dark"
            aria-label="Close"
          >
            <X size={18} />
          </RD.Close>
        )}
      </RD.Content>
    </RD.Portal>
  );
}
