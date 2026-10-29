// First-party visit tracking for the /admin panel (server side: api/t.js).
// - A random visitor id lives in localStorage; a visit (session) ends after 30 idle minutes.
// - ?r=<code> is a shared link from the admin panel: it ties this browser to that contact and
//   starts a new visit. utm_* also start a new visit. Both are removed from the address bar.
// - Time on a page counts only while the tab is visible.
// Skipped for the admin pages, the admin's own browser, automated browsers, and visitors who
// send Global Privacy Control.
const ENDPOINT = '/api/t';
const IDLE_MS = 30 * 60 * 1000;
const HEARTBEAT_MS = 10000;

const store = {
  get(k) {
    try {
      return localStorage.getItem(k);
    } catch {
      return null;
    }
  },
  set(k, v) {
    try {
      localStorage.setItem(k, v);
    } catch {
      /* private mode: track this page view only */
    }
  },
};

const rid = () =>
  (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`).replace(/[^A-Za-z0-9]/g, '').slice(0, 24);

const disabled = () =>
  typeof window === 'undefined' ||
  navigator.webdriver ||
  navigator.globalPrivacyControl ||
  location.pathname.startsWith('/admin') ||
  store.get('bs_internal') === '1';

// Marks this browser as the admin's, so your own browsing isn't counted.
export const markInternal = () => store.set('bs_internal', '1');

// Each message goes out at once (keepalive survives navigation); the server doesn't need
// them in order. Beacons use text/plain, the type browsers allow without a preflight.
function send(msg) {
  const payload = JSON.stringify({ vid, sid, ...msg });
  fetch(ENDPOINT, { method: 'POST', headers: { 'content-type': 'application/json' }, body: payload, keepalive: true }).catch(() => {});
}
// On leaving the page, send both ways: some browsers and proxies drop one of them during a
// navigation. The server keeps the larger time, so a duplicate is harmless.
function beacon(msg) {
  const payload = JSON.stringify({ vid, sid, ...msg });
  try {
    navigator.sendBeacon?.(ENDPOINT, new Blob([payload], { type: 'text/plain' }));
  } catch {
    /* fall through to fetch */
  }
  send(msg);
}

let vid;
let sid;
let started = false;
let page = null; // { pid, activeMs, since, sentMs }

function startVisit() {
  vid = store.get('bs_vid');
  if (!vid) {
    vid = rid();
    store.set('bs_vid', vid);
  }
  const params = new URLSearchParams(location.search);
  const ref = params.get('r');
  const utm = { source: params.get('utm_source'), medium: params.get('utm_medium'), campaign: params.get('utm_campaign') };
  const fresh = ref || utm.source || utm.medium || utm.campaign;

  let session = null;
  try {
    session = JSON.parse(store.get('bs_session') || 'null');
  } catch {
    session = null;
  }
  if (session && !fresh && Date.now() - session.last < IDLE_MS) {
    sid = session.id;
  } else {
    sid = rid();
    send({ t: 'session', ref, utm, referrer: document.referrer, landing: location.pathname });
  }
  touch();

  // Recorded once, then removed, so a reload or a restored tab isn't counted as a new visit.
  if (fresh) {
    for (const k of ['r', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content']) params.delete(k);
    const q = params.toString();
    history.replaceState(history.state, '', `${location.pathname}${q ? `?${q}` : ''}${location.hash}`);
  }
}

function touch() {
  store.set('bs_session', JSON.stringify({ id: sid, last: Date.now() }));
}

const activeMs = () => (page ? page.activeMs + (page.since ? Date.now() - page.since : 0) : 0);

function flush(useBeacon) {
  if (!page) return;
  const ms = activeMs();
  if (ms - page.sentMs < 1000) return;
  page.sentMs = ms;
  // Carries the page too, so the time lands even if it arrives before the page view.
  (useBeacon ? beacon : send)({ t: 'dur', pid: page.pid, path: page.path, title: page.title, ms });
}

function init() {
  started = true;
  startVisit();
  document.addEventListener('visibilitychange', () => {
    if (!page) return;
    if (document.visibilityState === 'hidden') {
      page.activeMs = activeMs();
      page.since = null;
      flush(true);
    } else {
      page.since = Date.now();
      // Coming back after a long break is a new visit.
      try {
        const s = JSON.parse(store.get('bs_session') || 'null');
        if (!s || Date.now() - s.last > IDLE_MS) {
          sid = rid();
          send({ t: 'session', referrer: '', landing: location.pathname });
          const { path, title } = page;
          page = null;
          trackPage(path, title);
        }
      } catch {
        /* ignore */
      }
      touch();
    }
  });
  addEventListener('pagehide', () => flush(true));
  setInterval(() => {
    if (document.visibilityState === 'visible') {
      flush(false);
      touch();
    }
  }, HEARTBEAT_MS);

  // Any PDF download link on the site counts as a download, wherever it sits.
  document.addEventListener(
    'click',
    (e) => {
      const a = e.target.closest?.('a[href]');
      if (!a) return;
      const href = a.getAttribute('href');
      if (a.hasAttribute('download') || /\/assets\/downloads\/[^/]+\.pdf$/i.test(href)) {
        trackEvent('download', href.split('/').pop(), a.getAttribute('aria-label') || a.textContent.trim());
      }
    },
    true,
  );
}

export function trackPage(path, title = document.title) {
  if (disabled()) {
    // Leaving a public page for /admin: send that page's time before going quiet.
    if (page) {
      page.activeMs = activeMs();
      page.since = null;
      flush(false);
      page = null;
    }
    return;
  }
  if (!started) init();
  // React runs effects twice in development; one route change is one page view.
  if (page && page.path === path && Date.now() - page.startedAt < 1000) return;
  if (page) {
    page.activeMs = activeMs();
    page.since = null;
    flush(false);
  }
  page = { pid: rid(), path, title, startedAt: Date.now(), activeMs: 0, since: document.visibilityState === 'visible' ? Date.now() : null, sentMs: 0 };
  touch();
  send({ t: 'pv', pid: page.pid, path, title });
}

export function trackEvent(type, target, label) {
  if (disabled() || !started) return;
  touch();
  send({ t: 'ev', type, target, label, path: location.pathname });
}
