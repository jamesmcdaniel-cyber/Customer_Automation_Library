// Multi-touch attribution. Each conversion (a download) is credited to the visits that led to
// it: the visitor's sessions that started on or before the conversion, inside the lookback
// window. First touch and last touch each take full credit; linear splits it evenly.
const DAY = 86400000;

export function attribute(sessions, conversions, { lookbackDays = 90 } = {}) {
  const byVisitor = new Map();
  for (const s of sessions) {
    if (!byVisitor.has(s.visitor_id)) byVisitor.set(s.visitor_id, []);
    byVisitor.get(s.visitor_id).push({ ...s, t: Date.parse(s.started_at) });
  }
  for (const list of byVisitor.values()) list.sort((a, b) => a.t - b.t);

  const channels = {};
  const csms = {};
  const paths = new Map();
  let total = 0;
  const credit = (bucket, key, field, amount) => {
    if (!key) return;
    bucket[key] ||= { first: 0, last: 0, linear: 0 };
    bucket[key][field] += amount;
  };

  for (const c of conversions) {
    const at = Date.parse(c.at);
    const touches = (byVisitor.get(c.visitor_id) || []).filter((s) => s.t <= at && at - s.t <= lookbackDays * DAY);
    if (!touches.length) continue;
    total += 1;
    const first = touches[0];
    const last = touches[touches.length - 1];
    credit(channels, first.channel, 'first', 1);
    credit(channels, last.channel, 'last', 1);
    credit(csms, first.csm, 'first', 1);
    credit(csms, last.csm, 'last', 1);
    for (const s of touches) {
      credit(channels, s.channel, 'linear', 1 / touches.length);
      credit(csms, s.csm, 'linear', 1 / touches.length);
    }
    const path = touches.map((s) => s.channel).filter((ch, i, arr) => ch !== arr[i - 1]);
    const key = path.join('>');
    paths.set(key, { path, conversions: (paths.get(key)?.conversions || 0) + 1 });
  }

  return {
    total,
    channels,
    csms,
    paths: [...paths.values()].sort((a, b) => b.conversions - a.conversions),
  };
}
