import { randomBytes } from 'node:crypto';
import { sql, ensureSchema } from '../_lib/db.js';
import { body, clientIp, json, text } from '../_lib/http.js';
import { COOKIE, SESSION_DAYS, isAdmin, signSession, verifyPassword } from '../_lib/auth.js';
import { stats, visitor } from '../_lib/stats.js';

// The /admin panel's API: /api/admin/<action>. Everything except login needs the admin cookie.
const LOGIN_LIMIT = 8;
const LOGIN_WINDOW_MIN = 15;

function cookie(res, value, maxAge, req) {
  const secure = /^localhost(:\d+)?$/.test(req.headers.host || '') ? '' : ' Secure;';
  res.setHeader('set-cookie', `${COOKIE}=${value}; Path=/api/admin; HttpOnly;${secure} SameSite=Strict; Max-Age=${maxAge}`);
}

async function login(req, res) {
  const key = `ip:${clientIp(req) || 'unknown'}`;
  const [attempt] = await sql`
    insert into login_attempts (key, count, window_start) values (${key}, 1, now())
    on conflict (key) do update set
      count = case when login_attempts.window_start < now() - make_interval(mins => ${LOGIN_WINDOW_MIN}) then 1 else login_attempts.count + 1 end,
      window_start = case when login_attempts.window_start < now() - make_interval(mins => ${LOGIN_WINDOW_MIN}) then now() else login_attempts.window_start end
    returning count`;
  if (attempt.count > LOGIN_LIMIT) return json(res, 429, { error: 'Too many attempts. Try again in 15 minutes.' });

  const { email, password } = body(req);
  const okEmail = String(email || '').trim().toLowerCase() === String(process.env.ADMIN_EMAIL || '').toLowerCase();
  const okPassword = verifyPassword(password, process.env.ADMIN_PASSWORD_HASH);
  if (!okEmail || !okPassword || !process.env.ADMIN_SESSION_SECRET) return json(res, 401, { error: 'Wrong email or password.' });

  await sql`delete from login_attempts where key = ${key}`;
  const exp = Date.now() + SESSION_DAYS * 86400000;
  cookie(res, signSession(process.env.ADMIN_SESSION_SECRET, exp), SESSION_DAYS * 86400, req);
  return json(res, 200, { ok: true });
}

const CODE_CHARS = 'abcdefghijkmnpqrstuvwxyz23456789';
const newCode = () => Array.from(randomBytes(6), (b) => CODE_CHARS[b % CODE_CHARS.length]).join('');

async function createLink(req, res) {
  const b = body(req);
  const name = text(b.name, 120);
  if (!name) return json(res, 400, { error: 'A name is required.' });
  for (let i = 0; i < 5; i += 1) {
    const code = newCode();
    const rows = await sql`
      insert into links (code, name, email, company, csm, note)
      values (${code}, ${name}, ${text(b.email, 200)}, ${text(b.company, 120)}, ${text(b.csm, 120)}, ${text(b.note, 300)})
      on conflict (code) do nothing returning *`;
    if (rows.length) return json(res, 200, { link: rows[0] });
  }
  return json(res, 500, { error: 'Could not create a link code.' });
}

const links = () => sql`
  select l.*, count(distinct v.id) as visitors, max(v.last_seen) as last_seen,
    (select count(*) from events e join visitors v2 on v2.id = e.visitor_id where v2.link_code = l.code and e.type = 'download') as downloads
  from links l left join visitors v on v.link_code = l.code
  where l.kind = 'shared'
  group by l.code order by l.created_at desc`;

const DAYS = new Set([7, 30, 90, 365]);

export default async function handler(req, res) {
  const { action } = req.query;
  await ensureSchema();
  const post = req.method === 'POST';

  if (action === 'login' && post) return login(req, res);
  if (action === 'logout' && post) {
    cookie(res, '', 0, req);
    return json(res, 200, { ok: true });
  }
  if (!isAdmin(req)) return json(res, 401, { error: 'Sign in required.' });

  if (action === 'me') return json(res, 200, { email: process.env.ADMIN_EMAIL });
  if (action === 'stats') {
    const days = DAYS.has(Number(req.query.days)) ? Number(req.query.days) : 30;
    return json(res, 200, await stats(days));
  }
  if (action === 'visitor') {
    const data = await visitor(String(req.query.id || ''));
    return data ? json(res, 200, data) : json(res, 404, { error: 'Not found' });
  }
  if (action === 'links' && !post) return json(res, 200, { links: await links() });
  if (action === 'links' && post) return createLink(req, res);
  if (action === 'link-delete' && post) {
    await sql`delete from links where code = ${text(body(req).code, 64)} and kind = 'shared'`;
    return json(res, 200, { ok: true });
  }
  return json(res, 404, { error: 'Unknown action' });
}
