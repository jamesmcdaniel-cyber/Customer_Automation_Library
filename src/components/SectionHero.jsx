import { assetUrl } from '../lib/cn';
import { sectionBackground } from '../lib/backgrounds';
import { BrandMark } from './BrandMark';
import { BackLink } from './BackLink';

// Section header: a brand painterly image under a deep-petrol Horizon scrim —
// the brand's "looking out at the horizon" metaphor. The eyebrow leads with the
// Backstory symbol mark (white variant, on the dark scrim). `section` picks the image:
// each section gets its own, shuffled per visit (see lib/backgrounds.js).
//
// Every banner is the same height from sm up, so moving between pages doesn't shift the
// content: the eyebrow and title stay at the top and `children` (one row of buttons or
// chips) is pinned to the bottom. Keep to a one-line title, at most three lines of
// subtitle and a single action row, or this banner grows taller than the others.
// `back` ({ to, label }) puts the back link inside the banner rather than above it.
export function SectionHero({ eyebrow, title, subtitle, section, back, children }) {
  const img = section ? `url('${assetUrl('assets/backgrounds/' + sectionBackground(section))}')` : 'none';
  return (
    <div
      data-hero
      className="relative mb-6 flex flex-col overflow-hidden rounded-3xl border border-ac-light-gray px-6 py-9 text-white shadow-card sm:min-h-[328px] sm:px-11 sm:py-10 lg:min-h-[304px]"
      style={{
        backgroundImage: `linear-gradient(95deg, rgba(2,24,33,0.92) 0%, rgba(10,47,63,0.66) 50%, rgba(24,72,92,0.32) 100%), ${img}, linear-gradient(180deg, #18485C 0%, #021821 100%)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {(eyebrow || back) && (
        <div className="mb-3 flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
          {eyebrow && (
            <div className="flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-white/70">
              <BrandMark tone="dark" />
              {eyebrow}
            </div>
          )}
          {back && (
            <BackLink
              to={back.to}
              label={back.label}
              className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-white/80 transition-colors hover:text-white"
            />
          )}
        </div>
      )}
      <h1 className="max-w-3xl font-display text-[23px] font-bold leading-[1.2] tracking-[-0.01em] sm:text-[27px]">
        {title}
      </h1>
      {subtitle && <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-white/85">{subtitle}</p>}
      {children && <div className="mt-auto pt-6">{children}</div>}
    </div>
  );
}
