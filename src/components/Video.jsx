import { useState } from 'react';
import { PlayCircle } from 'lucide-react';

// Zight share links play as a native <video> straight from the MP4, so the frame
// hugs the recording with no player chrome or padding around it.
function source(url) {
  if (!url) return null;
  let m;
  if ((m = url.match(/share\.zight\.com\/([\w-]+)/))) return { kind: 'file', src: `https://share.zight.com/items/${m[1]}/content_link#t=0.1` };
  if ((m = url.match(/youtube\.com\/watch\?v=([\w-]+)/)) || (m = url.match(/youtu\.be\/([\w-]+)/)))
    return { kind: 'embed', src: `https://www.youtube-nocookie.com/embed/${m[1]}` };
  if ((m = url.match(/loom\.com\/share\/(\w+)/))) return { kind: 'embed', src: `https://www.loom.com/embed/${m[1]}` };
  if ((m = url.match(/vimeo\.com\/(\d+)/)) && !/player\.vimeo/.test(url)) return { kind: 'embed', src: `https://player.vimeo.com/video/${m[1]}` };
  if (/\.(mp4|webm|mov)(\?|#|$)/i.test(url)) return { kind: 'file', src: url };
  return { kind: 'embed', src: url };
}

export function Video({ url, title, tone = 'light' }) {
  const s = source(url);
  // Hold a 16:9 box until metadata arrives, then match the recording exactly.
  const [ratio, setRatio] = useState(null);

  if (s?.kind === 'file') {
    return (
      <video
        src={s.src}
        title={title}
        controls
        playsInline
        preload="metadata"
        onLoadedMetadata={(ev) => {
          const v = ev.currentTarget;
          if (v.videoWidth && v.videoHeight) setRatio(`${v.videoWidth} / ${v.videoHeight}`);
        }}
        style={{ aspectRatio: ratio || '16 / 9' }}
        className="block h-auto w-full rounded-xl bg-ac-horizon-900 object-cover shadow-card"
      />
    );
  }

  if (s?.kind === 'embed') {
    return (
      <div className="relative aspect-video overflow-hidden rounded-xl shadow-card">
        <iframe
          src={s.src}
          title={title}
          loading="lazy"
          allow="fullscreen; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
        />
      </div>
    );
  }

  const dark = tone === 'dark';
  return (
    <div
      role="img"
      aria-label="Video coming soon"
      className={
        dark
          ? 'grid aspect-video place-items-center rounded-xl border border-white/20 bg-ac-horizon-900/40 text-white/80'
          : 'grid aspect-video place-items-center rounded-xl border border-ac-light-gray bg-ac-warm-white text-ac-dark-secondary'
      }
    >
      <div className="px-4 text-center">
        <PlayCircle size={44} strokeWidth={1.25} className="mx-auto mb-2 opacity-70" />
        <div className="text-[15px] font-medium">Video coming soon</div>
        <div className={dark ? 'mt-0.5 text-[12.5px] text-white/60' : 'mt-0.5 text-[12.5px] text-ac-med-gray'}>{title}</div>
      </div>
    </div>
  );
}
