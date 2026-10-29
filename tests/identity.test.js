import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import { signIdentity, verifyIdentity, identityCode } from '../api/_lib/identity.js';

const SECRET = 'test-secret';
const NOW = 1_800_000_000_000;
const exp = (s) => Math.floor(NOW / 1000) + s;

test('a token signed with the secret verifies and normalizes the claims', () => {
  const t = signIdentity({ email: ' Jane@Acme.com ', name: 'Jane Doe', company: 'Acme', src: 'app', exp: exp(3600) }, SECRET);
  assert.deepEqual(verifyIdentity(t, SECRET, NOW), { email: 'jane@acme.com', name: 'Jane Doe', company: 'Acme', src: 'app' });
});

test('src defaults to app, and name and company are optional', () => {
  const t = signIdentity({ email: 'sam@acme.com', exp: exp(60) }, SECRET);
  assert.deepEqual(verifyIdentity(t, SECRET, NOW), { email: 'sam@acme.com', name: null, company: null, src: 'app' });
});

test('wrong secret, tampering, expiry, a missing exp, or a bad email are all rejected', () => {
  const good = signIdentity({ email: 'jane@acme.com', exp: exp(60) }, SECRET);
  assert.equal(verifyIdentity(good, 'other-secret', NOW), null);
  const [h, , s] = good.split('.');
  const forged = Buffer.from(JSON.stringify({ email: 'ceo@acme.com', exp: exp(60) })).toString('base64url');
  assert.equal(verifyIdentity(`${h}.${forged}.${s}`, SECRET, NOW), null);
  assert.equal(verifyIdentity(signIdentity({ email: 'jane@acme.com', exp: exp(-1) }, SECRET), SECRET, NOW), null);
  assert.equal(verifyIdentity(signIdentity({ email: 'jane@acme.com' }, SECRET), SECRET, NOW), null);
  assert.equal(verifyIdentity(signIdentity({ email: 'not-an-email', exp: exp(60) }, SECRET), SECRET, NOW), null);
  assert.equal(verifyIdentity('garbage', SECRET, NOW), null);
  assert.equal(verifyIdentity(good, '', NOW), null);
});

test('only HS256 is accepted (no alg=none)', () => {
  const header = Buffer.from(JSON.stringify({ alg: 'none', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({ email: 'jane@acme.com', exp: exp(60) })).toString('base64url');
  assert.equal(verifyIdentity(`${header}.${payload}.`, SECRET, NOW), null);
});

test('a token from a standard JWT library (HS256) verifies', () => {
  // Built by hand the way any JWT library does it.
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({ email: 'lee@acme.com', name: 'Lee', exp: exp(60) })).toString('base64url');
  const sig = createHmac('sha256', SECRET).update(`${header}.${payload}`).digest('base64url');
  assert.equal(verifyIdentity(`${header}.${payload}.${sig}`, SECRET, NOW).email, 'lee@acme.com');
});

test('the contact code is stable per email and never contains the email', () => {
  assert.equal(identityCode('jane@acme.com'), identityCode('jane@acme.com'));
  assert.notEqual(identityCode('jane@acme.com'), identityCode('sam@acme.com'));
  assert.match(identityCode('jane@acme.com'), /^id_[a-f0-9]{16}$/);
});
