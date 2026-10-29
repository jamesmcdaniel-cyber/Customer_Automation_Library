import { test } from 'node:test';
import assert from 'node:assert/strict';
import { classifyChannel, classifyOrg, deviceOf } from '../api/_lib/classify.js';

const SITE = 'www.customerforlife.ai';

test('a valid shared-link code wins over everything else', () => {
  const c = classifyChannel({ link: { code: 'k7x2', csm: 'Sam' }, referrer: 'https://www.google.com/', utm: { source: 'newsletter' }, host: SITE });
  assert.deepEqual(c, { channel: 'shared_link', source: 'Sam' });
});

test('a verified Backstory identity marks the Backstory app channel, after a CSM link', () => {
  assert.deepEqual(classifyChannel({ identity: { src: 'app' }, referrer: 'https://www.google.com/', host: SITE }), { channel: 'backstory_app', source: 'app' });
  assert.deepEqual(classifyChannel({ link: { code: 'k7x2', csm: 'Sam' }, identity: { src: 'app' }, host: SITE }), { channel: 'shared_link', source: 'Sam' });
});

test('utm parameters mark a campaign, and email mediums mark email', () => {
  assert.deepEqual(classifyChannel({ utm: { source: 'linkedin', medium: 'paid' }, host: SITE }), { channel: 'campaign', source: 'linkedin' });
  assert.deepEqual(classifyChannel({ utm: { source: 'hubspot', medium: 'email' }, host: SITE }), { channel: 'email', source: 'hubspot' });
});

test('no referrer, or our own site, is direct', () => {
  assert.deepEqual(classifyChannel({ referrer: '', host: SITE }), { channel: 'direct', source: null });
  assert.deepEqual(classifyChannel({ referrer: 'https://www.customerforlife.ai/get-it', host: SITE }), { channel: 'direct', source: null });
  assert.deepEqual(classifyChannel({ referrer: 'http://localhost:3311/get-it', host: 'localhost:3311' }), { channel: 'direct', source: null });
});

test('referrers are grouped by kind', () => {
  const ch = (referrer) => classifyChannel({ referrer, host: SITE });
  assert.deepEqual(ch('https://www.google.com/'), { channel: 'search', source: 'google.com' });
  assert.deepEqual(ch('https://duckduckgo.com/'), { channel: 'search', source: 'duckduckgo.com' });
  assert.deepEqual(ch('https://chatgpt.com/'), { channel: 'ai_assistant', source: 'chatgpt.com' });
  assert.deepEqual(ch('https://claude.ai/chat/1'), { channel: 'ai_assistant', source: 'claude.ai' });
  assert.deepEqual(ch('https://www.linkedin.com/feed/'), { channel: 'social', source: 'linkedin.com' });
  assert.deepEqual(ch('https://app.slack.com/client/T1'), { channel: 'slack', source: 'slack.com' });
  assert.deepEqual(ch('https://help.backstory.ai/en/articles/1'), { channel: 'help_center', source: 'help.backstory.ai' });
  assert.deepEqual(ch('https://backstory.ai/'), { channel: 'backstory_site', source: 'backstory.ai' });
  assert.deepEqual(ch('https://example.org/post'), { channel: 'referral', source: 'example.org' });
});

test('home and mobile ISPs and clouds are not companies', () => {
  assert.equal(classifyOrg('AS7922 Comcast Cable Communications, LLC').kind, 'isp');
  assert.equal(classifyOrg('Verizon Business').kind, 'isp');
  assert.equal(classifyOrg('T-Mobile USA, Inc.').kind, 'isp');
  assert.equal(classifyOrg('Deutsche Telekom AG').kind, 'isp');
  assert.equal(classifyOrg('AS16509 Amazon.com, Inc.').kind, 'cloud');
  assert.equal(classifyOrg('Google LLC').kind, 'cloud');
  assert.equal(classifyOrg('Cloudflare, Inc.').kind, 'cloud');
});

test('anything else is a company, with the AS number stripped', () => {
  assert.deepEqual(classifyOrg('AS12345 Acme Robotics Inc.'), { name: 'Acme Robotics Inc.', kind: 'company' });
  assert.deepEqual(classifyOrg(null), { name: null, kind: null });
});

test('device type from the user agent', () => {
  assert.equal(deviceOf('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) Mobile/15E148'), 'mobile');
  assert.equal(deviceOf('Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X)'), 'tablet');
  assert.equal(deviceOf('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/130'), 'desktop');
});
