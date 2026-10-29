import { sql } from './db.js';
import { attribute } from './attribution.js';

const LOOKBACK_DAYS = 90;
const n = (v) => Number(v || 0);

// Everything the admin dashboard shows for the last `days` days.
export async function stats(days) {
  const since = new Date(Date.now() - days * 86400000).toISOString();
  const touchSince = new Date(Date.parse(since) - LOOKBACK_DAYS * 86400000).toISOString();

  const [kpi] = await sql`
    with s as (
      select s.*, coalesce(l.company, case when s.org_kind = 'company' then s.org end) as company,
        (select coalesce(sum(p.duration_ms), 0) from pageviews p where p.session_id = s.id) as ms
      from sessions s join visitors v on v.id = s.visitor_id left join links l on l.code = v.link_code
      where s.started_at >= ${since})
    select count(distinct visitor_id) as visitors, count(*) as sessions,
      count(distinct visitor_id) filter (where visitor_id in (select id from visitors where link_code is not null)) as identified,
      count(distinct company) as companies, coalesce(avg(ms), 0) as avg_visit_ms,
      (select count(*) from events where type = 'download' and at >= ${since}) as downloads
    from s`;

  const channels = await sql`
    select channel, count(*) as sessions, count(distinct visitor_id) as visitors
    from sessions where started_at >= ${since} group by channel order by sessions desc`;

  const conversions = await sql`select visitor_id, at from events where type = 'download' and at >= ${since}`;
  const touches = await sql`
    select s.visitor_id, s.started_at, s.channel, l.csm
    from sessions s left join links l on l.code = s.link_code
    where s.started_at >= ${touchSince}
      and s.visitor_id in (select visitor_id from events where type = 'download' and at >= ${since})`;
  const attribution = attribute(
    touches.map((t) => ({ ...t, started_at: new Date(t.started_at).toISOString() })),
    conversions.map((c) => ({ ...c, at: new Date(c.at).toISOString() })),
    { lookbackDays: LOOKBACK_DAYS },
  );

  const pages = await sql`
    select path, count(*) as views, count(distinct visitor_id) as visitors,
      coalesce(avg(duration_ms) filter (where duration_ms > 0), 0) as avg_ms, sum(duration_ms) as total_ms
    from pageviews where started_at >= ${since} group by path order by views desc limit 60`;

  const resources = await sql`
    select target, type, count(*) as count, count(distinct visitor_id) as people
    from events where at >= ${since} group by target, type`;

  const csms = await sql`
    select coalesce(l.csm, '(no CSM)') as csm, count(distinct l.code) as links,
      count(distinct s.visitor_id) as people, count(distinct s.id) as sessions,
      count(distinct e.id) as downloads
    from links l
      left join visitors v on v.link_code = l.code
      left join sessions s on s.visitor_id = v.id and s.started_at >= ${since}
      left join events e on e.visitor_id = v.id and e.type = 'download' and e.at >= ${since}
    where l.kind = 'shared'
    group by 1 order by people desc, links desc`;

  const people = await sql`
    select v.id, v.first_seen, v.last_seen, l.code as link_code, l.kind as link_kind, l.name, l.email, l.company as link_company, l.csm,
      first_s.channel as first_channel, first_s.source as first_source,
      last_s.country, last_s.city, last_s.org, last_s.org_kind,
      (select count(*) from sessions s where s.visitor_id = v.id and s.started_at >= ${since}) as sessions,
      pv.pages, pv.ms,
      (select count(*) from events e where e.visitor_id = v.id and e.type = 'download' and e.at >= ${since}) as downloads
    from visitors v
      left join links l on l.code = v.link_code
      left join lateral (select channel, source from sessions s where s.visitor_id = v.id order by started_at asc limit 1) first_s on true
      left join lateral (select country, city, org, org_kind from sessions s where s.visitor_id = v.id order by started_at desc limit 1) last_s on true
      left join lateral (select count(*) as pages, coalesce(sum(duration_ms), 0) as ms from pageviews p
                         where p.visitor_id = v.id and p.started_at >= ${since}) pv on true
    where exists (select 1 from sessions s where s.visitor_id = v.id and s.started_at >= ${since})
    order by v.last_seen desc limit 500`;

  const daily = await sql`
    select to_char(date_trunc('day', started_at), 'YYYY-MM-DD') as day, count(distinct visitor_id) as visitors
    from sessions where started_at >= ${since} group by 1 order by 1`;

  const peopleRows = people.map((p) => ({
    ...p,
    company: p.link_company || (p.org_kind === 'company' ? p.org : null),
    sessions: n(p.sessions),
    pages: n(p.pages),
    ms: n(p.ms),
    downloads: n(p.downloads),
  }));

  const companies = new Map();
  for (const p of peopleRows) {
    if (!p.company) continue;
    const c = companies.get(p.company) || { company: p.company, visitors: 0, people: [], sessions: 0, ms: 0, downloads: 0, last_seen: p.last_seen };
    c.visitors += 1;
    if (p.name) c.people.push(p.name);
    c.sessions += p.sessions;
    c.ms += p.ms;
    c.downloads += p.downloads;
    if (p.last_seen > c.last_seen) c.last_seen = p.last_seen;
    companies.set(p.company, c);
  }

  return {
    days,
    kpi: {
      visitors: n(kpi.visitors),
      sessions: n(kpi.sessions),
      identified: n(kpi.identified),
      companies: n(kpi.companies),
      downloads: n(kpi.downloads),
      avgVisitMs: Math.round(n(kpi.avg_visit_ms)),
    },
    channels: channels.map((c) => ({ channel: c.channel, sessions: n(c.sessions), visitors: n(c.visitors) })),
    attribution,
    pages: pages.map((p) => ({ path: p.path, views: n(p.views), visitors: n(p.visitors), avgMs: Math.round(n(p.avg_ms)), totalMs: n(p.total_ms) })),
    resources: resources.map((r) => ({ target: r.target, type: r.type, count: n(r.count), people: n(r.people) })),
    csms: csms.map((c) => ({ csm: c.csm, links: n(c.links), people: n(c.people), sessions: n(c.sessions), downloads: n(c.downloads) })),
    people: peopleRows,
    companies: [...companies.values()].sort((a, b) => (a.last_seen < b.last_seen ? 1 : -1)),
    daily: daily.map((d) => ({ day: d.day, visitors: n(d.visitors) })),
  };
}

// One visitor's full history: who they are, then each visit with its pages and actions.
export async function visitor(id) {
  const [v] = await sql`
    select v.*, l.name, l.email, l.company, l.csm from visitors v left join links l on l.code = v.link_code where v.id = ${id}`;
  if (!v) return null;
  const sessions = await sql`select * from sessions where visitor_id = ${id} order by started_at desc limit 200`;
  const pages = await sql`select session_id, path, title, started_at, duration_ms from pageviews where visitor_id = ${id} order by started_at`;
  const events = await sql`select session_id, type, target, label, path, at from events where visitor_id = ${id} order by at`;
  return {
    visitor: v,
    sessions: sessions.map((s) => ({
      ...s,
      pages: pages.filter((p) => p.session_id === s.id),
      events: events.filter((e) => e.session_id === s.id),
    })),
  };
}
