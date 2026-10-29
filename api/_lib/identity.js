import { createHash, createHmac, timingSafeEqual } from 'node:crypto';

// Signed identity links: a place that already knows the signed-in person (the Backstory app,
// a Backstory email) links here with ?bsid=<token>, where the token is an HS256 JWT signed with
// IDENTITY_LINK_SECRET. Claims: email (required), exp (required, seconds), and optionally
// name, company, and src (where the link sits, e.g. "app" or "email"). See docs/identity-links.md.

const b64 = (v) => Buffer.from(JSON.stringify(v)).toString('base64url');
const str = (v, max = 120) => (typeof v === 'string' && v.trim() ? v.trim().slice(0, max) : null);
const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export function signIdentity(claims, secret) {
  const head = `${b64({ alg: 'HS256', typ: 'JWT' })}.${b64(claims)}`;
  return `${head}.${createHmac('sha256', secret).update(head).digest('base64url')}`;
}

export function verifyIdentity(token, secret, now = Date.now()) {
  if (!secret || typeof token !== 'string' || token.length > 2048) return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [h, p, s] = parts;
  let header;
  let claims;
  try {
    header = JSON.parse(Buffer.from(h, 'base64url').toString());
    claims = JSON.parse(Buffer.from(p, 'base64url').toString());
  } catch {
    return null;
  }
  if (header?.alg !== 'HS256') return null;
  const expected = createHmac('sha256', secret).update(`${h}.${p}`).digest();
  const actual = Buffer.from(s, 'base64url');
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return null;
  if (typeof claims.exp !== 'number' || claims.exp * 1000 < now) return null;
  const email = typeof claims.email === 'string' ? claims.email.trim().toLowerCase() : '';
  if (!EMAIL.test(email) || email.length > 200) return null;
  return { email, name: str(claims.name), company: str(claims.company), src: str(claims.src, 40) || 'app' };
}

// Identified people share the contacts table with CSM shared links, under a code derived from
// the email, so every view of the admin panel picks them up the same way.
export const identityCode = (email) => `id_${createHash('sha256').update(email).digest('hex').slice(0, 16)}`;
