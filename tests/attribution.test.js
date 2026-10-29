import { test } from 'node:test';
import assert from 'node:assert/strict';
import { attribute } from '../api/_lib/attribution.js';

const day = (n) => new Date(Date.UTC(2026, 9, n)).toISOString();

test('first, last, and linear credit for a two-touch path', () => {
  const sessions = [
    { visitor_id: 'v1', started_at: day(1), channel: 'shared_link', csm: 'Sam' },
    { visitor_id: 'v1', started_at: day(3), channel: 'search', csm: null },
  ];
  const conversions = [{ visitor_id: 'v1', at: day(3) }];
  const r = attribute(sessions, conversions);
  assert.deepEqual(r.channels.shared_link, { first: 1, last: 0, linear: 0.5 });
  assert.deepEqual(r.channels.search, { first: 0, last: 1, linear: 0.5 });
  assert.deepEqual(r.paths, [{ path: ['shared_link', 'search'], conversions: 1 }]);
  assert.deepEqual(r.csms.Sam, { first: 1, last: 0, linear: 0.5 });
});

test('only touches before the conversion count', () => {
  const sessions = [
    { visitor_id: 'v1', started_at: day(1), channel: 'direct' },
    { visitor_id: 'v1', started_at: day(5), channel: 'search' },
  ];
  const r = attribute(sessions, [{ visitor_id: 'v1', at: day(2) }]);
  assert.deepEqual(r.channels, { direct: { first: 1, last: 1, linear: 1 } });
});

test('touches older than the lookback window are dropped', () => {
  const sessions = [
    { visitor_id: 'v1', started_at: new Date(Date.UTC(2026, 0, 1)).toISOString(), channel: 'email' },
    { visitor_id: 'v1', started_at: day(10), channel: 'direct' },
  ];
  const r = attribute(sessions, [{ visitor_id: 'v1', at: day(10) }], { lookbackDays: 90 });
  assert.deepEqual(Object.keys(r.channels), ['direct']);
});

test('repeated channels in a row collapse in the path but each touch still shares linear credit', () => {
  const sessions = [
    { visitor_id: 'v1', started_at: day(1), channel: 'direct' },
    { visitor_id: 'v1', started_at: day(2), channel: 'direct' },
    { visitor_id: 'v1', started_at: day(3), channel: 'search' },
  ];
  const r = attribute(sessions, [{ visitor_id: 'v1', at: day(3) }]);
  assert.deepEqual(r.paths, [{ path: ['direct', 'search'], conversions: 1 }]);
  assert.equal(r.channels.direct.linear.toFixed(3), '0.667');
});

test('a conversion with no touches is ignored, and visitors are kept apart', () => {
  const sessions = [{ visitor_id: 'v2', started_at: day(1), channel: 'search' }];
  const r = attribute(sessions, [{ visitor_id: 'v1', at: day(2) }, { visitor_id: 'v2', at: day(2) }]);
  assert.equal(r.total, 1);
  assert.deepEqual(r.channels, { search: { first: 1, last: 1, linear: 1 } });
});
