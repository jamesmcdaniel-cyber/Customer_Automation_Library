import { useEffect, useRef, useState } from 'react';
import { PlayCircle, Volume2, VolumeX } from 'lucide-react';
import { trackEvent } from '../lib/track';

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

// A native video. With `autoPlay` it starts once half of it is on screen and pauses when
// scrolled away, until the viewer takes over. Browsers only allow autoplay with sound after
// the visitor has interacted with the site, so it tries with sound first and falls back to
// muted. While it plays muted, a click anywhere above the control bar turns the sound on and
// restarts it from the top (a plain click on a video would only pause it).
// `silent` marks a recording with no audio track, where the browser greys out the speaker:
// it autoplays muted, never offers sound, and says "No sound" so nobody hunts for a setting.
function FileVideo({ src, title, poster, autoPlay, silent }) {
  const ref = useRef(null);
  // Hold a 16:9 box until metadata arrives, then match the recording exactly.
  const [ratio, setRatio] = useState(null);
  const [auto, setAuto] = useState(autoPlay);
  const [muted, setMuted] = useState(false);
  const played = useRef(false);

  useEffect(() => {
    const v = ref.current;
    if (!auto || !v || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const playMuted = () => {
      v.muted = true;
      if (!silent) setMuted(true);
      v.play().catch(() => {});
    };
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return v.pause();
        if (!v.paused) return;
        if (silent) return playMuted();
        v.play().catch(playMuted);
      },
      { threshold: 0.5 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, [auto, silent]);

  const soundOn = () => {
    const v = ref.current;
    setAuto(false);
    setMuted(false);
    v.muted = false;
    v.volume = 1;
    v.currentTime = 0;
    v.play().catch(() => {});
  };

  return (
    <div className="relative">
      <video
        ref={ref}
        src={src}
        title={title}
        poster={poster}
        controls
        playsInline
        preload={autoPlay ? 'auto' : 'metadata'}
        onPointerDown={() => setAuto(false)}
        onTimeUpdate={(ev) => {
          // Counted as watched once 10 seconds have played, however it started (autoplay
          // included), once per page view.
          if (played.current || ev.currentTarget.currentTime < 10) return;
          played.current = true;
          trackEvent('video_play', src.split('/').pop().split(/[?#]/)[0], title);
        }}
        onVolumeChange={(ev) => !ev.currentTarget.muted && setMuted(false)}
        onLoadedMetadata={(ev) => {
          const v = ev.currentTarget;
          if (v.videoWidth && v.videoHeight) setRatio(`${v.videoWidth} / ${v.videoHeight}`);
        }}
        style={{ aspectRatio: ratio || '16 / 9' }}
        className="block h-auto w-full rounded-xl bg-ac-horizon-900 object-cover shadow-card"
      />
      {silent && (
        <span className="pointer-events-none absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-ac-horizon-900/75 px-3 py-1.5 text-[12px] font-medium text-white backdrop-blur">
          <VolumeX size={14} /> No sound
        </span>
      )}
      {muted && (
        // Covers the picture but not the bottom control bar, so seeking and fullscreen still work.
        <button
          type="button"
          onClick={soundOn}
          aria-label="Play with sound from the beginning"
          className="group absolute inset-x-0 top-0 bottom-14 grid cursor-pointer place-items-center rounded-t-xl"
        >
          <span className="inline-flex items-center gap-2.5 rounded-full bg-ac-horizon-900/85 px-5 py-3 text-[15px] font-semibold text-white shadow-card backdrop-blur transition-colors group-hover:bg-ac-horizon-900">
            <Volume2 size={20} /> Click for sound
          </span>
        </button>
      )}
    </div>
  );
}

export function Video({ url, title, poster, autoPlay = false, silent = false, tone = 'light' }) {
  const s = source(url);
  if (s?.kind === 'file') return <FileVideo src={s.src} title={title} poster={poster} autoPlay={autoPlay} silent={silent} />;

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
