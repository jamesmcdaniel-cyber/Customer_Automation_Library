import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hashPassword, verifyPassword, signSession, verifySession } from '../api/_lib/auth.js';

test('a password verifies against its own hash only', () => {
  const stored = hashPassword('correct horse battery');
  assert.match(stored, /^scrypt\$/);
  assert.equal(verifyPassword('correct horse battery', stored), true);
  assert.equal(verifyPassword('wrong', stored), false);
  assert.equal(verifyPassword('anything', ''), false);
  assert.equal(verifyPassword('anything', 'garbage'), false);
});

test('two hashes of the same password differ (salted)', () => {
  assert.notEqual(hashPassword('same'), hashPassword('same'));
});

test('a signed session verifies until it expires, and tampering breaks it', () => {
  const secret = 's3cret';
  const now = 1_700_000_000_000;
  const token = signSession(secret, now + 60_000);
  assert.equal(verifySession(secret, token, now), true);
  assert.equal(verifySession(secret, token, now + 61_000), false);
  assert.equal(verifySession('other', token, now), false);
  const [exp, sig] = token.split('.');
  assert.equal(verifySession(secret, `${Number(exp) + 999999}.${sig}`, now), false);
  assert.equal(verifySession(secret, undefined, now), false);
});
