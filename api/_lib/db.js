import { neon } from '@neondatabase/serverless';

// Neon Postgres, attached to the Vercel project (DATABASE_URL). Tables are created on first
// use, so a fresh database needs no separate migration step.
export const sql = neon(process.env.DATABASE_URL);

const SCHEMA = [
  `create table if not exists links (
     code text primary key, name text not null, email text, company text, csm text, note text,
     created_at timestamptz not null default now())`,
  `create table if not exists visitors (
     id text primary key, link_code text references links(code) on delete set null,
     first_seen timestamptz not null default now(), last_seen timestamptz not null default now())`,
  `create table if not exists sessions (
     id text primary key, visitor_id text not null, started_at timestamptz not null default now(),
     last_at timestamptz not null default now(), channel text not null, source text, landing text,
     link_code text, utm_source text, utm_medium text, utm_campaign text,
     country text, region text, city text, org text, org_kind text, device text)`,
  `create index if not exists sessions_visitor_idx on sessions (visitor_id)`,
  `create index if not exists sessions_started_idx on sessions (started_at)`,
  `create table if not exists pageviews (
     id text primary key, session_id text not null, visitor_id text not null, path text not null,
     title text, started_at timestamptz not null default now(), duration_ms integer not null default 0)`,
  `create index if not exists pageviews_session_idx on pageviews (session_id)`,
  `create index if not exists pageviews_started_idx on pageviews (started_at)`,
  `create table if not exists events (
     id bigserial primary key, session_id text, visitor_id text not null, type text not null,
     target text, label text, path text, at timestamptz not null default now())`,
  `create index if not exists events_at_idx on events (at)`,
  `create table if not exists login_attempts (
     key text primary key, count integer not null, window_start timestamptz not null)`,
];

let ready;
export function ensureSchema() {
  ready ||= (async () => {
    for (const stmt of SCHEMA) await sql.query(stmt);
  })().catch((err) => {
    ready = undefined;
    throw err;
  });
  return ready;
}
