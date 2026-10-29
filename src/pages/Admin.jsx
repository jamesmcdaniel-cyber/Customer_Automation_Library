import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link2, LogOut, Trash2, Users, LayoutDashboard } from 'lucide-react';
import { BrandMark } from '../components/BrandMark';
import { Button } from '../components/ui/Button';
import { CopyButton } from '../components/ui/CopyButton';
import { Dialog, DialogContent } from '../components/ui/Dialog';
import { downloads } from '../lib/content';
import { markInternal } from '../lib/track';
import { cn } from '../lib/cn';

// /admin: who visits the starter library, what they read, how long, what they download, and
// how they got here (a CSM's shared link or on their own). Data comes from api/admin/[action].js.

const api = async (action, { method = 'GET', body, query = '' } = {}) => {
  const res = await fetch(`/api/admin/${action}${query}`, {
    method,
    headers: body ? { 'content-type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
    credentials: 'same-origin',
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(data.error || 'Request failed'), { status: res.status });
  return data;
};

// ---- formatting -------------------------------------------------------------------------

const CHANNELS = {
  shared_link: 'CSM shared link',
  backstory_app: 'Backstory app (signed in)',
  direct: 'Direct (typed, bookmark, or app)',
  search: 'Search engine',
  ai_assistant: 'AI assistant',
  help_center: 'Help Center',
  backstory_site: 'backstory.ai',
  slack: 'Slack',
  social: 'Social',
  email: 'Email campaign',
  campaign: 'Campaign link (UTM)',
  referral: 'Other website',
};
const channelLabel = (c) => CHANNELS[c] || c;

const num = (v) => (v >= 10000 ? `${(v / 1000).toFixed(1)}K` : Math.round(v).toLocaleString());
const dur = (ms) => {
  const s = Math.round((ms || 0) / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ${String(s % 60).padStart(2, '0')}s`;
  return `${Math.floor(m / 60)}h ${String(m % 60).padStart(2, '0')}m`;
};
const when = (iso) => {
  if (!iso) return '';
  const d = new Date(iso);
  const mins = (Date.now() - d) / 60000;
  if (mins < 1) return 'just now';
  if (mins < 60) return `${Math.round(mins)}m ago`;
  if (mins < 1440) return `${Math.round(mins / 60)}h ago`;
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
};
const stamp = (iso) => new Date(iso).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
const place = (p) => [p.city, p.region && p.region !== p.city ? p.region : null, p.country].filter(Boolean).join(', ');

// Resource ids, PDF files, and video files all map to a readable title.
const BY_FILE = Object.fromEntries(Object.entries(downloads).map(([id, d]) => [d.file, d.title]));
const VIDEOS = {
  'mcp-intro.mp4': 'Video: Backstory MCP in 50 seconds',
  'day-in-the-life.mp4': 'Video: A day in the life',
  'gemini-enterprise.mp4': 'Video: Gemini Enterprise demo',
};
const resourceName = (target) =>
  target === 'tour' ? 'Interactive product tour' : downloads[target]?.title || BY_FILE[target] || VIDEOS[target] || target || 'Unknown';

const who = (p) => p.name || p.company || 'Anonymous visitor';

// ---- small pieces ----------------------------------------------------------------------

function Card({ title, intro, children, className, action }) {
  return (
    <section className={cn('surface-card p-5 sm:p-6', className)}>
      {(title || action) && (
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-[17px] font-bold text-ac-dark">{title}</h2>
            {intro && <p className="mt-1 max-w-3xl text-[13.5px] leading-6 text-ac-dark-secondary">{intro}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

function Stat({ label, value, note }) {
  return (
    <div className="surface-card p-4">
      <div className="text-[12.5px] text-ac-dark-secondary">{label}</div>
      <div className="mt-1 text-[26px] font-semibold leading-tight tracking-[-0.01em] text-ac-dark">{value}</div>
      {note && <div className="mt-0.5 text-[12px] text-ac-med-gray">{note}</div>}
    </div>
  );
}

// A horizontal meter: one hue, the track a lighter step of the same ramp.
function Meter({ value, max, label }) {
  const pct = max > 0 ? Math.max(value > 0 ? 2 : 0, (value / max) * 100) : 0;
  return (
    <div className="flex items-center gap-2" title={label}>
      <div className="h-2 w-full min-w-[60px] rounded-full bg-ac-horizon-50">
        <div className="h-2 rounded-full bg-ac-coral" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function Table({ head, rows, empty = 'Nothing yet for this period.', onRow }) {
  if (!rows.length) return <p className="rounded-lg bg-ac-warm-white px-4 py-6 text-center text-[13.5px] text-ac-med-gray">{empty}</p>;
  return (
    <div className="-mx-5 overflow-x-auto sm:-mx-6">
      <table className="w-full min-w-[640px] border-collapse text-left text-[13.5px]">
        <thead>
          <tr className="border-b border-ac-light-gray text-[11.5px] uppercase tracking-[0.08em] text-ac-med-gray">
            {head.map((h, i) => (
              <th key={i} className={cn('px-3 py-2 font-mono font-medium first:pl-5 last:pr-5 sm:first:pl-6 sm:last:pr-6', h.right && 'text-right', h.w)}>
                {h.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((cells, r) => (
            <tr
              key={r}
              onClick={onRow ? () => onRow(r) : undefined}
              className={cn('border-b border-ac-light-gray/70 last:border-0', onRow && 'cursor-pointer hover:bg-ac-warm-white')}
            >
              {cells.map((c, i) => (
                <td key={i} className={cn('px-3 py-2.5 align-middle text-ac-dark first:pl-5 last:pr-5 sm:first:pl-6 sm:last:pr-6', head[i].right && 'text-right tabular-nums')}>
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Daily unique visitors: one series of columns, hover for the exact day and count.
function DailyChart({ daily, days }) {
  const [hover, setHover] = useState(null);
  const series = useMemo(() => {
    const map = Object.fromEntries(daily.map((d) => [d.day, d.visitors]));
    const out = [];
    const n = Math.min(days, 90);
    for (let i = n - 1; i >= 0; i -= 1) {
      const d = new Date(Date.now() - i * 86400000);
      const key = d.toISOString().slice(0, 10);
      out.push({ day: key, visitors: map[key] || 0 });
    }
    return out;
  }, [daily, days]);
  const max = Math.max(1, ...series.map((d) => d.visitors));
  const tick = max <= 4 ? max : Math.ceil(max / 4) * 4;
  return (
    <div className="relative">
      <div className="flex h-40 items-end gap-[2px] border-b border-ac-light-gray">
        {series.map((d, i) => (
          <div
            key={d.day}
            className="flex h-full flex-1 items-end"
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
          >
            <div
              className={cn('mx-auto w-full max-w-[24px] rounded-t-[4px]', hover === i ? 'bg-ac-coral-dark' : 'bg-ac-coral')}
              style={{ height: `${(d.visitors / tick) * 100}%`, minHeight: d.visitors ? 3 : 0 }}
            />
          </div>
        ))}
      </div>
      <div className="mt-1.5 flex justify-between font-mono text-[11px] text-ac-med-gray">
        <span>{new Date(series[0].day).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
        <span>Peak {tick === max ? max : `${max} (scale ${tick})`}</span>
        <span>Today</span>
      </div>
      {hover !== null && (
        <div
          className="pointer-events-none absolute -top-2 z-10 -translate-x-1/2 -translate-y-full rounded-lg border border-ac-light-gray bg-white px-3 py-1.5 text-[12.5px] shadow-card"
          style={{ left: `${((hover + 0.5) / series.length) * 100}%` }}
        >
          <div className="font-medium text-ac-dark">{series[hover].visitors} visitor{series[hover].visitors === 1 ? '' : 's'}</div>
          <div className="text-ac-med-gray">{new Date(series[hover].day).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</div>
        </div>
      )}
    </div>
  );
}

// ---- visitor history --------------------------------------------------------------------

function VisitorDialog({ id, onClose }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    if (!id) return;
    setData(null);
    api('visitor', { query: `?id=${encodeURIComponent(id)}` }).then(setData, (e) => setError(e.message));
  }, [id]);
  const v = data?.visitor;
  return (
    <Dialog open={!!id} onOpenChange={(open) => !open && onClose()}>
      <DialogContent size="w-[min(760px,calc(100vw-32px))] max-h-[88vh]">
        {error && <p className="text-ac-dark-secondary">{error}</p>}
        {!data && !error && <p className="text-ac-med-gray">Loading…</p>}
        {v && (
          <>
            <div className="eyebrow mb-1">Visitor history</div>
            <h2 className="font-display text-[20px] font-bold text-ac-dark">{v.name || 'Anonymous visitor'}</h2>
            <p className="mt-1 text-[13.5px] text-ac-dark-secondary">
              {[v.email, v.company, v.csm && `sent by ${v.csm}`].filter(Boolean).join(' · ') || 'Not tied to a shared link yet.'}
            </p>
            <p className="mt-1 text-[12.5px] text-ac-med-gray">
              First seen {stamp(v.first_seen)} · last seen {stamp(v.last_seen)} · {data.sessions.length} visit{data.sessions.length === 1 ? '' : 's'}
            </p>
            <ol className="mt-5 space-y-4">
              {data.sessions.map((s) => (
                <li key={s.id} className="rounded-xl border border-ac-light-gray p-4">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <div className="font-medium text-ac-dark">
                      {stamp(s.started_at)} · {channelLabel(s.channel)}
                      {s.source && <span className="font-normal text-ac-dark-secondary"> ({s.source})</span>}
                    </div>
                    <div className="text-[12.5px] text-ac-med-gray">
                      {[place(s), s.org_kind === 'company' ? s.org : null, s.device].filter(Boolean).join(' · ')}
                    </div>
                  </div>
                  <ul className="mt-3 space-y-1.5 text-[13.5px]">
                    {[...s.pages.map((p) => ({ at: p.started_at, kind: 'page', p })), ...s.events.map((e) => ({ at: e.at, kind: 'event', e }))]
                      .sort((a, b) => (a.at < b.at ? -1 : 1))
                      .map((x, i) =>
                        x.kind === 'page' ? (
                          <li key={i} className="flex justify-between gap-3">
                            <span className="font-mono text-[12.5px] text-ac-dark">{x.p.path}</span>
                            <span className="tabular-nums text-ac-dark-secondary">{dur(x.p.duration_ms)}</span>
                          </li>
                        ) : (
                          <li key={i} className="flex justify-between gap-3 pl-4 text-ac-coral-dark">
                            <span>
                              {x.e.type === 'download' ? 'Downloaded' : x.e.type === 'open' ? 'Opened' : 'Watched'} {resourceName(x.e.target)}
                            </span>
                            <span className="text-[12px] text-ac-med-gray">{new Date(x.e.at).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}</span>
                          </li>
                        ),
                      )}
                  </ul>
                </li>
              ))}
            </ol>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ---- tabs -------------------------------------------------------------------------------

function Overview({ s, openVisitor }) {
  const a = s.attribution;
  const csmFirst = a.channels.shared_link?.first || 0;
  const csmAny = a.paths.filter((p) => p.path.includes('shared_link')).reduce((t, p) => t + p.conversions, 0);
  const sessionsBy = Object.fromEntries(s.channels.map((c) => [c.channel, c]));
  const channelKeys = [...new Set([...s.channels.map((c) => c.channel), ...Object.keys(a.channels)])];
  const maxLinear = Math.max(0, ...Object.values(a.channels).map((c) => c.linear));

  const res = {};
  for (const r of s.resources) {
    const key = resourceName(r.target);
    res[key] ||= { name: key, open: 0, download: 0, video_play: 0, people: 0 };
    res[key][r.type] += r.count;
    res[key].people = Math.max(res[key].people, r.people);
  }
  const resources = Object.values(res).sort((x, y) => y.download + y.open + y.video_play - (x.download + x.open + x.video_play));
  const maxPageTime = Math.max(0, ...s.pages.map((p) => p.totalMs));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        <Stat label="Visitors" value={num(s.kpi.visitors)} note={`${num(s.kpi.sessions)} visits`} />
        <Stat label="Known people" value={num(s.kpi.identified)} note="from shared links or Backstory" />
        <Stat label="Companies" value={num(s.kpi.companies)} note="named or detected" />
        <Stat label="Downloads" value={num(s.kpi.downloads)} />
        <Stat label="Avg visit" value={dur(s.kpi.avgVisitMs)} note="active time" />
        <Stat
          label="Downloads a CSM started"
          value={a.total ? `${Math.round((csmFirst / a.total) * 100)}%` : '–'}
          note={a.total ? `${csmAny} of ${a.total} had a CSM link in the path` : 'no downloads yet'}
        />
      </div>

      <Card title="Visitors per day" intro="Unique visitors each day. Hover a column for the count.">
        <DailyChart daily={s.daily} days={s.days} />
      </Card>

      <Card
        title="How people arrive"
        intro="Each download is credited to the visits that led to it. First touch: how they first found the site. Last touch: the visit they downloaded in. Linear: credit split across every visit."
      >
        <Table
          head={[
            { label: 'Source' },
            { label: 'Visits', right: true },
            { label: 'Visitors', right: true },
            { label: 'First touch', right: true },
            { label: 'Last touch', right: true },
            { label: 'Linear', right: true },
            { label: 'Linear share', w: 'w-[22%]' },
          ]}
          rows={channelKeys.map((k) => {
            const c = a.channels[k] || { first: 0, last: 0, linear: 0 };
            return [
              channelLabel(k),
              num(sessionsBy[k]?.sessions || 0),
              num(sessionsBy[k]?.visitors || 0),
              num(c.first),
              num(c.last),
              c.linear.toFixed(1),
              <Meter key="m" value={c.linear} max={maxLinear} label={`${c.linear.toFixed(1)} downloads`} />,
            ];
          })}
        />
        {a.paths.length > 0 && (
          <div className="mt-5">
            <h3 className="mb-2 text-[13px] font-semibold text-ac-dark">Most common paths to a download</h3>
            <ul className="space-y-1.5 text-[13.5px]">
              {a.paths.slice(0, 6).map((p) => (
                <li key={p.path.join('>')} className="flex justify-between gap-3">
                  <span className="text-ac-dark-secondary">{p.path.map(channelLabel).join(' → ')}</span>
                  <span className="tabular-nums text-ac-dark">{p.conversions}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Card>

      <Card title="CSM shared links" intro="People reached through each CSM's links in this period.">
        <Table
          head={[{ label: 'CSM' }, { label: 'Links', right: true }, { label: 'People who visited', right: true }, { label: 'Visits', right: true }, { label: 'Downloads', right: true }, { label: 'First-touch credit', right: true }]}
          rows={s.csms.map((c) => [c.csm, num(c.links), num(c.people), num(c.sessions), num(c.downloads), num(a.csms[c.csm]?.first || 0)])}
          empty="No shared links yet. Make one under Shared links."
        />
      </Card>

      <div className="space-y-6">
        <Card title="Pages" intro="Average time counts only while the tab was in view.">
          <Table
            head={[{ label: 'Page' }, { label: 'Views', right: true }, { label: 'Visitors', right: true }, { label: 'Avg time', right: true }, { label: 'Total time', w: 'w-[24%]' }]}
            rows={s.pages.map((p) => [
              <span key="p" className="font-mono text-[12.5px]">{p.path}</span>,
              num(p.views),
              num(p.visitors),
              dur(p.avgMs),
              <div key="t" className="flex items-center gap-2">
                <Meter value={p.totalMs} max={maxPageTime} label={dur(p.totalMs)} />
                <span className="w-14 shrink-0 text-right text-[12px] tabular-nums text-ac-dark-secondary">{dur(p.totalMs)}</span>
              </div>,
            ])}
          />
        </Card>
        <Card title="Resources" intro="Opened in the viewer, downloaded as a PDF, or (videos) watched for at least 10 seconds.">
          <Table
            head={[{ label: 'Resource' }, { label: 'Opened', right: true }, { label: 'Downloaded', right: true }, { label: 'Watched', right: true }, { label: 'People', right: true }]}
            rows={resources.map((r) => [r.name, num(r.open), num(r.download), num(r.video_play), num(r.people)])}
          />
        </Card>
      </div>

      <Card title="Companies" intro="From shared links, or detected from the visitor's company network. Home internet and mobile networks are left out.">
        <Table
          head={[{ label: 'Company' }, { label: 'Known people' }, { label: 'Visitors', right: true }, { label: 'Visits', right: true }, { label: 'Time', right: true }, { label: 'Downloads', right: true }, { label: 'Last seen', right: true }]}
          rows={s.companies.map((c) => [c.company, c.people.join(', ') || '–', num(c.visitors), num(c.sessions), dur(c.ms), num(c.downloads), when(c.last_seen)])}
          empty="No companies identified yet."
        />
      </Card>

      <PeopleTable people={s.people.slice(0, 12)} openVisitor={openVisitor} title="Recent visitors" />
    </div>
  );
}

function PeopleTable({ people, openVisitor, title = 'Visitors' }) {
  return (
    <Card title={title} intro="Select anyone to see each visit, page by page.">
      <Table
        head={[{ label: 'Who' }, { label: 'Company' }, { label: 'First came from' }, { label: 'Where' }, { label: 'Visits', right: true }, { label: 'Pages', right: true }, { label: 'Time', right: true }, { label: 'Downloads', right: true }, { label: 'Last seen', right: true }]}
        rows={people.map((p) => [
          <div key="w">
            <div className={cn('font-medium', !p.name && 'text-ac-dark-secondary')}>{p.name || 'Anonymous'}</div>
            {(p.email || p.csm || p.link_kind === 'identity') && (
              <div className="text-[12px] text-ac-med-gray">
                {[p.email, p.csm && `via ${p.csm}`, p.link_kind === 'identity' && 'signed in via Backstory'].filter(Boolean).join(' · ')}
              </div>
            )}
          </div>,
          p.company || '–',
          channelLabel(p.first_channel),
          place(p) || '–',
          num(p.sessions),
          num(p.pages),
          dur(p.ms),
          num(p.downloads),
          when(p.last_seen),
        ])}
        onRow={(i) => openVisitor(people[i].id)}
        empty="No visitors in this period."
      />
    </Card>
  );
}

const PAGES = [
  ['/', 'Home'],
  ['/get-it', 'Get it'],
  ['/trust-it', 'Trust it'],
  ['/use-it', 'Use it'],
  ['/stretch-it', 'Stretch it'],
  ['/resources', 'Resources'],
];

function Links() {
  const [links, setLinks] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', company: '', csm: '', note: '', page: '/' });
  const [made, setMade] = useState(null);
  const [error, setError] = useState(null);
  const load = useCallback(() => api('links').then((d) => setLinks(d.links), (e) => setError(e.message)), []);
  useEffect(() => {
    load();
  }, [load]);

  const origin = location.hostname === 'localhost' ? location.origin : 'https://www.customerforlife.ai';
  const urlFor = (code, page = '/') => `${origin}${page}?r=${code}`;
  const field = (k) => ({ value: form[k], onChange: (e) => setForm({ ...form, [k]: e.target.value }) });
  const input = 'w-full rounded-lg border border-ac-light-gray bg-white px-3 py-2 text-[14px] text-ac-dark outline-none focus:border-ac-coral';

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const { link } = await api('links', { method: 'POST', body: form });
      setMade(urlFor(link.code, form.page));
      setForm({ ...form, name: '', email: '', note: '' });
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <Card title="Make a shared link" intro="One link per contact. Everything they do on the site, now and on later visits from the same browser, shows under their name.">
        <form onSubmit={submit} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <label className="text-[12.5px] text-ac-dark-secondary">
            Contact name *
            <input required className={cn(input, 'mt-1')} {...field('name')} placeholder="Jane Doe" />
          </label>
          <label className="text-[12.5px] text-ac-dark-secondary">
            Contact email
            <input type="email" className={cn(input, 'mt-1')} {...field('email')} placeholder="jane@acme.com" />
          </label>
          <label className="text-[12.5px] text-ac-dark-secondary">
            Company
            <input className={cn(input, 'mt-1')} {...field('company')} placeholder="Acme" />
          </label>
          <label className="text-[12.5px] text-ac-dark-secondary">
            Sent by (CSM)
            <input className={cn(input, 'mt-1')} {...field('csm')} placeholder="Sam Rivera" list="csm-names" />
            <datalist id="csm-names">{[...new Set((links || []).map((l) => l.csm).filter(Boolean))].map((c) => <option key={c} value={c} />)}</datalist>
          </label>
          <label className="text-[12.5px] text-ac-dark-secondary">
            Opens on
            <select className={cn(input, 'mt-1')} {...field('page')}>
              {PAGES.map(([p, label]) => (
                <option key={p} value={p}>{label}</option>
              ))}
            </select>
          </label>
          <label className="text-[12.5px] text-ac-dark-secondary">
            Note
            <input className={cn(input, 'mt-1')} {...field('note')} placeholder="QBR follow-up" />
          </label>
          <div className="flex flex-wrap items-center gap-3 sm:col-span-2 lg:col-span-3">
            <Button type="submit" size="sm">
              <Link2 size={14} /> Make link
            </Button>
            {error && <span className="text-[13px] text-ac-dark-secondary">{error}</span>}
          </div>
        </form>
        {made && (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-ac-horizon-100 bg-ac-horizon-50 px-4 py-3">
            <code className="break-all font-mono text-[13px] text-ac-dark">{made}</code>
            <CopyButton text={made} label="Copy link" />
          </div>
        )}
      </Card>

      <Card title="All shared links">
        {!links ? (
          <p className="text-ac-med-gray">Loading…</p>
        ) : (
          <Table
            head={[{ label: 'Contact' }, { label: 'Company' }, { label: 'CSM' }, { label: 'Made', right: true }, { label: 'Visitors', right: true }, { label: 'Downloads', right: true }, { label: 'Last seen', right: true }, { label: '' }]}
            rows={links.map((l) => [
              <div key="c">
                <div className="font-medium">{l.name}</div>
                <div className="text-[12px] text-ac-med-gray">{[l.email, l.note].filter(Boolean).join(' · ')}</div>
              </div>,
              l.company || '–',
              l.csm || '–',
              when(l.created_at),
              num(Number(l.visitors)),
              num(Number(l.downloads)),
              l.last_seen ? when(l.last_seen) : 'not yet',
              <div key="a" className="flex justify-end gap-2">
                <CopyButton text={urlFor(l.code)} label="Copy" />
                <button
                  type="button"
                  aria-label={`Delete the link for ${l.name}`}
                  className="grid h-7 w-7 place-items-center rounded-md text-ac-med-gray hover:bg-ac-cream hover:text-ac-dark"
                  onClick={async () => {
                    if (!confirm(`Delete ${l.name}'s link? Their past visits stay, but they will no longer show under their name.`)) return;
                    await api('link-delete', { method: 'POST', body: { code: l.code } });
                    load();
                  }}
                >
                  <Trash2 size={14} />
                </button>
              </div>,
            ])}
            empty="No links yet."
          />
        )}
      </Card>
    </div>
  );
}

// ---- shell ------------------------------------------------------------------------------

function Login({ onDone }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const input = 'mt-1 w-full rounded-lg border border-ac-light-gray bg-white px-3 py-2.5 text-[14px] text-ac-dark outline-none focus:border-ac-coral';
  return (
    <div className="grid min-h-screen place-items-center bg-ac-warm-white px-4">
      <form
        className="surface-card w-full max-w-sm p-7"
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          setError(null);
          try {
            await api('login', { method: 'POST', body: { email, password } });
            markInternal();
            onDone();
          } catch (err) {
            setError(err.message);
          } finally {
            setBusy(false);
          }
        }}
      >
        <div className="mb-5 flex items-center gap-2 text-[15px] font-bold text-ac-dark">
          <BrandMark /> Backstory MCP · Admin
        </div>
        <label className="block text-[12.5px] text-ac-dark-secondary">
          Email
          <input type="email" autoComplete="username" required className={input} value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label className="mt-3 block text-[12.5px] text-ac-dark-secondary">
          Password
          <input type="password" autoComplete="current-password" required className={input} value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        {error && <p className="mt-3 text-[13px] text-ac-dark-secondary">{error}</p>}
        <Button type="submit" className="mt-5 w-full" disabled={busy}>
          {busy ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>
    </div>
  );
}

const TABS = [
  ['overview', 'Overview', LayoutDashboard],
  ['people', 'People', Users],
  ['links', 'Shared links', Link2],
];

export default function Admin() {
  const [authed, setAuthed] = useState(null);
  const [tab, setTab] = useState('overview');
  const [days, setDays] = useState(30);
  const [s, setS] = useState(null);
  const [error, setError] = useState(null);
  const [visitorId, setVisitorId] = useState(null);

  useEffect(() => {
    document.title = 'Admin · Backstory MCP';
    api('me').then(() => setAuthed(true), () => setAuthed(false));
  }, []);

  useEffect(() => {
    if (!authed) return;
    markInternal();
    setS(null);
    api('stats', { query: `?days=${days}` }).then(setS, (e) => (e.status === 401 ? setAuthed(false) : setError(e.message)));
  }, [authed, days]);

  if (authed === null) return null;
  if (!authed) return <Login onDone={() => setAuthed(true)} />;

  return (
    <div className="min-h-screen bg-ac-warm-white">
      <header className="border-b border-ac-light-gray bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-8">
          <div className="flex items-center gap-2 text-[15px] font-bold text-ac-dark">
            <BrandMark /> Backstory MCP · Admin
          </div>
          <nav className="flex flex-wrap items-center gap-1">
            {TABS.map(([id, label, Icon]) => (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13.5px] font-medium',
                  tab === id ? 'bg-ac-horizon-50 text-ac-coral-dark' : 'text-ac-dark-secondary hover:text-ac-dark',
                )}
              >
                <Icon size={15} /> {label}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            {tab !== 'links' && (
              <select
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                className="rounded-lg border border-ac-light-gray bg-white px-2.5 py-1.5 text-[13px] text-ac-dark"
                aria-label="Time period"
              >
                <option value={7}>Last 7 days</option>
                <option value={30}>Last 30 days</option>
                <option value={90}>Last 90 days</option>
                <option value={365}>Last 12 months</option>
              </select>
            )}
            <button
              type="button"
              onClick={async () => {
                await api('logout', { method: 'POST' });
                setAuthed(false);
              }}
              className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[13px] text-ac-dark-secondary hover:bg-ac-cream hover:text-ac-dark"
            >
              <LogOut size={14} /> Sign out
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-8">
        {tab === 'links' ? (
          <Links />
        ) : error ? (
          <p className="text-ac-dark-secondary">{error}</p>
        ) : !s ? (
          <p className="text-ac-med-gray">Loading…</p>
        ) : tab === 'overview' ? (
          <Overview s={s} openVisitor={setVisitorId} />
        ) : (
          <PeopleTable people={s.people} openVisitor={setVisitorId} title={`Visitors (${s.people.length})`} />
        )}
        <p className="mt-8 text-[12px] text-ac-med-gray">
          Your own visits aren&rsquo;t counted once you&rsquo;ve signed in on this browser.
        </p>
      </main>
      <VisitorDialog id={visitorId} onClose={() => setVisitorId(null)} />
    </div>
  );
}
