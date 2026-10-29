import { sql, ensureSchema } from './_lib/db.js';
import { body, clientIp, geo, json, text, validId } from './_lib/http.js';
import { classifyChannel, deviceOf, isBot } from './_lib/classify.js';
import { lookupOrg } from './_lib/org.js';
import { identityCode, verifyIdentity } from './_lib/identity.js';

// Visit tracking from src/lib/track.js. Four message kinds:
//   session  a visit starts (where it came from, which shared link or signed identity, if any)
//   pv       a page view starts
//   dur      the active time on a page view so far (sent as it grows and on leave)
//   ev       an action: download, resource opened, video played
// They can arrive out of order (each is sent at once), so none depends on another existing.
// The live site, this project's Vercel addresses, and local development.
const ORIGIN = /^https:\/\/([a-z0-9-]+\.)?customerforlife\.ai$|^https:\/\/customer-automation-library[a-z0-9-]*\.vercel\.app$|^http:\/\/localhost(:\d+)?$/i;
const EVENT_TYPES = new Set(['download', 'open', 'video_play']);
const MAX_DURATION = 4 * 3600 * 1000;

export default async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { error: 'POST only' });
  const origin = req.headers.origin;
  if (origin && !ORIGIN.test(origin)) return json(res, 403, { error: 'origin' });
  const ua = req.headers['user-agent'] || '';
  if (isBot(ua)) return res.status(204).end();

  const m = body(req);
  if (!validId(m.vid)) return json(res, 400, { error: 'vid' });
  await ensureSchema();

  if (m.t === 'session') {
    if (!validId(m.sid)) return json(res, 400, { error: 'sid' });
    const code = text(m.ref, 64);
    const [link] = code ? await sql`select code, csm from links where code = ${code} and kind = 'shared'` : [];
    // A signed identity link names the person outright, and wins over an earlier shared link
    // (which may have been forwarded). Anything that fails to verify is ignored.
    const identity = verifyIdentity(m.id, process.env.IDENTITY_LINK_SECRET);
    let identityLink = null;
    if (identity) {
      [identityLink] = await sql`
        insert into links (code, name, email, company, note, kind)
        values (${identityCode(identity.email)}, ${identity.name || identity.email}, ${identity.email}, ${identity.company},
          ${`Backstory ${identity.src}`}, 'identity')
        on conflict (code) do update set
          name = coalesce(${identity.name}, links.name), company = coalesce(${identity.company}, links.company)
        returning code`;
    }
    const utm = { source: text(m.utm?.source, 100), medium: text(m.utm?.medium, 100), campaign: text(m.utm?.campaign, 100) };
    const { channel, source } = classifyChannel({ link, identity, referrer: m.referrer, utm, host: req.headers.host });
    const where = geo(req);
    const org = await lookupOrg(clientIp(req));
    const tagCode = identityLink?.code || link?.code || null;
    await sql`insert into visitors (id, link_code) values (${m.vid}, ${tagCode})
      on conflict (id) do update set last_seen = now(),
        link_code = case when ${!!identityLink} then excluded.link_code else coalesce(visitors.link_code, excluded.link_code) end`;
    await sql`insert into sessions (id, visitor_id, channel, source, landing, link_code, utm_source, utm_medium, utm_campaign,
        country, region, city, org, org_kind, device)
      values (${m.sid}, ${m.vid}, ${channel}, ${source}, ${text(m.landing)}, ${tagCode}, ${utm.source}, ${utm.medium},
        ${utm.campaign}, ${where.country}, ${where.region}, ${where.city}, ${org.name}, ${org.kind}, ${deviceOf(ua)})
      on conflict (id) do nothing`;
    return res.status(204).end();
  }

  if (m.t === 'pv') {
    if (!validId(m.sid) || !validId(m.pid)) return json(res, 400, { error: 'ids' });
    const path = text(m.path);
    if (!path) return json(res, 400, { error: 'path' });
    await sql`insert into pageviews (id, session_id, visitor_id, path, title)
      values (${m.pid}, ${m.sid}, ${m.vid}, ${path}, ${text(m.title)}) on conflict (id) do nothing`;
    await sql`update sessions set last_at = now() where id = ${m.sid}`;
    await sql`update visitors set last_seen = now() where id = ${m.vid}`;
    return res.status(204).end();
  }

  if (m.t === 'dur') {
    if (!validId(m.pid) || !validId(m.sid)) return json(res, 400, { error: 'ids' });
    const ms = Math.max(0, Math.min(MAX_DURATION, Math.round(Number(m.ms) || 0)));
    const path = text(m.path);
    if (!path) return json(res, 400, { error: 'path' });
    // Upsert: the time can arrive before its page view when a tab closes.
    await sql`insert into pageviews (id, session_id, visitor_id, path, title, duration_ms)
      values (${m.pid}, ${m.sid}, ${m.vid}, ${path}, ${text(m.title)}, ${ms})
      on conflict (id) do update set duration_ms = greatest(pageviews.duration_ms, excluded.duration_ms)
      where pageviews.visitor_id = excluded.visitor_id`;
    return res.status(204).end();
  }

  if (m.t === 'ev') {
    if (!EVENT_TYPES.has(m.type)) return json(res, 400, { error: 'type' });
    await sql`insert into events (session_id, visitor_id, type, target, label, path)
      values (${validId(m.sid) ? m.sid : null}, ${m.vid}, ${m.type}, ${text(m.target, 200)}, ${text(m.label, 200)}, ${text(m.path)})`;
    if (validId(m.sid)) await sql`update sessions set last_at = now() where id = ${m.sid}`;
    return res.status(204).end();
  }

  return json(res, 400, { error: 't' });
}
