import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

// One admin. The password is never stored: ADMIN_PASSWORD_HASH holds
// "scrypt$<salt>$<hash>" (base64url), made with hashPassword (see scripts/admin-password.js).
// A login sets a cookie holding an expiry and its HMAC under ADMIN_SESSION_SECRET.

export const COOKIE = 'bs_admin';
export const SESSION_DAYS = 7;

export function hashPassword(password) {
  const salt = randomBytes(16);
  const hash = scryptSync(password, salt, 64);
  return `scrypt$${salt.toString('base64url')}$${hash.toString('base64url')}`;
}

export function verifyPassword(password, stored) {
  const [kind, salt, hash] = String(stored || '').split('$');
  if (kind !== 'scrypt' || !salt || !hash) return false;
  const expected = Buffer.from(hash, 'base64url');
  const actual = scryptSync(String(password), Buffer.from(salt, 'base64url'), expected.length);
  return timingSafeEqual(actual, expected);
}

const sign = (secret, exp) => createHmac('sha256', secret).update(`admin:${exp}`).digest('base64url');

export function signSession(secret, exp) {
  return `${exp}.${sign(secret, exp)}`;
}

export function verifySession(secret, token, now = Date.now()) {
  if (!secret || !token) return false;
  const [exp, sig] = String(token).split('.');
  if (!exp || !sig || Number(exp) < now) return false;
  const a = Buffer.from(sig);
  const b = Buffer.from(sign(secret, exp));
  return a.length === b.length && timingSafeEqual(a, b);
}

export function readCookie(req, name) {
  const m = (req.headers.cookie || '').match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`));
  if (!m) return undefined;
  try {
    return decodeURIComponent(m[1]);
  } catch {
    return undefined;
  }
}

export const isAdmin = (req) => verifySession(process.env.ADMIN_SESSION_SECRET, readCookie(req, COOKIE));
