/* Backstory MCP Starter Library — hash-routed static site, no dependencies. */
(function () {
  'use strict';

  const main = document.getElementById('main');
  let site = {};
  let examples = [];

  /* ---------- helpers ---------- */

  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const inline = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  const arrow = '<span class="arrow" aria-hidden="true">&rarr;</span>';

  // Minimal markdown: ## / ### headings, - and 1. lists, pipe tables, **bold**, paragraphs.
  function markdown(src) {
    const lines = String(src || '').split('\n');
    const out = [];
    let i = 0;
    while (i < lines.length) {
      const line = lines[i];
      if (!line.trim()) { i++; continue; }
      let m;
      if ((m = line.match(/^(#{2,3})\s+(.*)$/))) {
        const tag = m[1].length === 2 ? 'h2' : 'h3';
        out.push(`<${tag}>${inline(m[2])}</${tag}>`);
        i++;
      } else if (/^\|/.test(line)) {
        const rows = [];
        while (i < lines.length && /^\|/.test(lines[i])) rows.push(lines[i++]);
        const cells = (r) => r.replace(/^\||\|$/g, '').split('|').map((c) => c.trim());
        const body = rows.filter((r) => !/^\|[\s|:-]+\|$/.test(r));
        const [head, ...rest] = body;
        out.push('<div class="table-wrap"><table><thead><tr>' +
          cells(head).map((c) => `<th>${inline(c)}</th>`).join('') + '</tr></thead><tbody>' +
          rest.map((r) => '<tr>' + cells(r).map((c) => `<td>${inline(c)}</td>`).join('') + '</tr>').join('') +
          '</tbody></table></div>');
      } else if (/^(-|\d+\.)\s/.test(line)) {
        const ordered = /^\d+\./.test(line);
        const re = ordered ? /^\d+\.\s+/ : /^-\s+/;
        const items = [];
        while (i < lines.length && re.test(lines[i])) items.push(lines[i++].replace(re, ''));
        const tag = ordered ? 'ol' : 'ul';
        out.push(`<${tag}>${items.map((t) => `<li>${inline(t)}</li>`).join('')}</${tag}>`);
      } else {
        const para = [];
        while (i < lines.length && lines[i].trim() && !/^(#{2,3}\s|\||-\s|\d+\.\s)/.test(lines[i])) para.push(lines[i++]);
        out.push(`<p>${para.map(inline).join('<br>')}</p>`);
      }
    }
    return out.join('');
  }

  // Turn common share links into embeddable URLs.
  function embedUrl(url) {
    if (!url) return '';
    let m;
    if ((m = url.match(/youtube\.com\/watch\?v=([\w-]+)/)) || (m = url.match(/youtu\.be\/([\w-]+)/))) return `https://www.youtube-nocookie.com/embed/${m[1]}`;
    if ((m = url.match(/loom\.com\/share\/(\w+)/))) return `https://www.loom.com/embed/${m[1]}`;
    if ((m = url.match(/share\.zight\.com\/([\w-]+)/))) return `https://share.zight.com/${m[1]}?embed=true`;
    if ((m = url.match(/vimeo\.com\/(\d+)/)) && !/player\.vimeo/.test(url)) return `https://player.vimeo.com/video/${m[1]}`;
    return url;
  }

  function video(url, title) {
    const src = embedUrl(url);
    if (src) {
      return `<div class="video"><iframe src="${esc(src)}" title="${esc(title)}" loading="lazy" allow="fullscreen; picture-in-picture" allowfullscreen></iframe></div>`;
    }
    return `<div class="video" role="img" aria-label="Video coming soon"><div class="video-placeholder"><div><div class="play"></div><div>Video coming soon</div><div class="muted" style="font-size:13px">${esc(title)}</div></div></div></div>`;
  }

  // An Intercom link, or a quiet placeholder when the URL isn't set yet.
  function helpLink(key, label) {
    const url = site.intercom && site.intercom[key];
    return url
      ? `<a href="${esc(url)}" target="_blank" rel="noopener">${esc(label)}</a>`
      : `<span class="muted">${esc(label)} (help article coming soon)</span>`;
  }

  function copyBox(label, text, { mono = false } = {}) {
    return `<div class="copybox">
      <div class="copybox-head"><p class="eyebrow">${esc(label)}</p><button class="copy-btn" type="button" data-copy="${esc(text)}">Copy</button></div>
      <div class="copybox-body${mono ? ' mono' : ''}">${esc(text)}</div>
    </div>`;
  }

  const checklist = (items, cls = '') => `<ul class="checklist ${cls}">${items.map((t) => `<li>${inline(t)}</li>`).join('')}</ul>`;
  const pills = (items, cls = '') => `<div class="pills">${items.map((t) => `<span class="pill ${cls}">${esc(t)}</span>`).join('')}</div>`;
  const sorted = () => examples.slice().sort((a, b) => a.order - b.order);
  const startHere = () => examples.find((e) => e.startHere) || sorted()[0];

  function pageHead(num, stage, title, lede) {
    return `<section class="page-head"><div class="wrap narrow">
      <p class="eyebrow"><span class="mark">///</span> ${esc(num)} &middot; ${esc(stage)}</p>
      <h1>${esc(title)}</h1>
      <p class="lede">${lede}</p>
    </div></section>`;
  }

  function connectSteps() {
    return `<ol class="steps">
      <li><h3>Open your AI assistant's connector settings</h3><p>In Claude or ChatGPT, go to <strong>Settings &rarr; Connectors &rarr; Add custom connector</strong>.</p></li>
      <li><h3>Add Backstory</h3><p>Name it <code>Backstory</code> and paste this address:</p>${copyBox('Connector URL', site.mcpUrl, { mono: true })}</li>
      <li><h3>Sign in</h3><p>A Backstory sign-in window opens. Log in as you normally would. Your AI assistant never sees your password.</p></li>
      <li><h3>Check it worked</h3><p>Ask: <em>&ldquo;What Backstory tools do you have access to?&rdquo;</em> You should see a list of Backstory tools. Stuck? ${helpLink('connect', 'Connecting the Backstory MCP')}.</p></li>
    </ol>`;
  }

  /* ---------- pages ---------- */

  function home() {
    const s = startHere();
    const stages = [
      ['get-it', '01', 'Get it', 'What MCP is, in plain English, and what Backstory brings to your AI assistant.'],
      ['trust-it', '02', 'Trust it', 'How sign-in works, what the assistant can and can\'t see, and what it will never do.'],
      ['use-it', '03', 'Use it', 'Your first 15 minutes: connect, then try four prompts that work on day one.'],
      ['stretch-it', '04', 'Stretch it', 'Ready for more? Turn these prompts into automations that run on their own.'],
    ];
    return `
    <section class="hero"><div class="wrap hero-inner">
      <div>
        <p class="eyebrow"><span class="mark">///</span> Backstory MCP</p>
        <h1>Ask your AI assistant about your customers — and get answers from Backstory.</h1>
        <p class="lede">MCP is a standard plug. It lets assistants like Claude and ChatGPT safely look things up in Backstory, so you can prep for meetings, check deal health, and draft follow-ups just by asking.</p>
        <div class="plug" aria-label="Your AI assistant connects to Backstory through MCP">
          <span class="node">Claude / ChatGPT</span><span class="wire"></span><span class="node core">MCP</span><span class="wire"></span><span class="node">Backstory</span>
        </div>
        <div class="hero-actions">
          <a class="btn btn-primary" href="#/example/${esc(s.id)}">Start here: ${esc(s.title)} ${arrow}</a>
          <a class="btn btn-ghost" href="#/get-it">What is MCP?</a>
        </div>
      </div>
      ${video(site.overviewVideoUrl, 'What is the Backstory MCP? (2 min overview)')}
    </div></section>

    <section class="section"><div class="wrap">
      <p class="eyebrow">Four steps, at your own pace</p>
      <h2>From &ldquo;what is this?&rdquo; to &ldquo;how did I work without it?&rdquo;</h2>
      <div class="grid grid-4" style="margin-top:24px">
        ${stages.map(([id, n, t, d]) => `<a class="card" href="#/${id}"><span class="stage-num">${n}</span><h3>${t}</h3><p>${d}</p><span class="more">Go ${arrow}</span></a>`).join('')}
      </div>
    </div></section>

    <section class="section"><div class="wrap">
      <p class="eyebrow">Try it today</p>
      <h2>Four prompts to try first</h2>
      <div class="grid grid-4" style="margin-top:24px">${sorted().map(exampleCard).join('')}</div>
    </div></section>`;
  }

  function exampleCard(e) {
    return `<a class="card${e.startHere ? ' card-start' : ''}" href="#/example/${esc(e.id)}">
      ${e.startHere ? '<span class="pill pill-blue" style="align-self:flex-start">Start here</span>' : `<span class="stage-num">0${e.order}</span>`}
      <h3>${esc(e.title)}</h3>
      <p>${esc(e.helpsYou)}</p>
      <div class="ex-meta"><span>${esc(e.whoFor.join(' · '))}</span><span>${esc(e.timeToTry)}</span></div>
      <span class="more">Try it ${arrow}</span>
    </a>`;
  }

  function getIt() {
    const gloss = [
      ['MCP', 'Model Context Protocol. An open standard that lets AI assistants connect to other software, the way USB lets any device plug into any computer.'],
      ['Connector', 'The link between your AI assistant and Backstory. You add it once, in your assistant\'s settings.'],
      ['Tool', 'One specific thing the assistant can look up through the connector, such as "find an account" or "get recent activity". The assistant picks the right tools for your question.'],
      ['Prompt', 'What you type to the assistant. Plain English works; naming the account helps.'],
      ['Account / opportunity', 'The same customers and deals you see in your CRM. Backstory matches your emails, calls, and meetings to them.'],
    ];
    return pageHead('01', 'Get it', 'What is MCP, and why should I care?',
      'You already use an AI assistant. MCP lets it look things up in Backstory for you, so its answers are about your real customers instead of guesses.') + `
    <div class="wrap narrow">
      <section class="section">
        <h2>The standard plug</h2>
        <p>Before standard plugs, every appliance needed its own kind of socket. MCP does for AI what the standard plug did for electricity: any assistant that supports MCP can connect to any tool that supports it, including Backstory.</p>
        <p>Once connected, you don't need to learn new software. You ask a question in plain English; the assistant fetches what it needs from Backstory and answers.</p>
      </section>
      <section class="section">
        <h2>What Backstory brings</h2>
        <div class="grid grid-2" style="margin-top:8px">
          <div class="card"><h3>Your customer activity</h3><p>Emails, calls, and meetings from the last 30 days, matched to the right account and deal in your CRM.</p></div>
          <div class="card"><h3>Deal context</h3><p>Risks, agreed next steps, topics under discussion, and scorecard coverage (MEDDIC, MEDDPICC, SPICED).</p></div>
          <div class="card"><h3>The people involved</h3><p>Who is engaged on the customer's side, their titles, and how active they've been.</p></div>
          <div class="card"><h3>Lessons from similar deals</h3><p>Past deals with similar situations, and how they turned out.</p></div>
        </div>
      </section>
      <section class="section">
        <h2>Which assistants work with it?</h2>
        <p>Any assistant that supports MCP connectors. The guides here use <strong>Claude</strong> and <strong>ChatGPT</strong>, which both let you add Backstory from their settings screen in about five minutes.</p>
      </section>
      <section class="section">
        <h2>Five words to know</h2>
        <dl class="gloss">${gloss.map(([t, d]) => `<div><dt>${t}</dt><dd>${d}</dd></div>`).join('')}</dl>
      </section>
      <section class="section next-card">
        <p style="margin:0">Next: how Backstory keeps your data safe.</p>
        <a class="btn btn-primary" href="#/trust-it">Trust it ${arrow}</a>
      </section>
    </div>`;
  }

  function trustIt() {
    return pageHead('02', 'Trust it', 'Safe by design',
      'The Backstory MCP can only read, only shows you what you are already allowed to see, and asks you to sign in yourself.') + `
    <div class="wrap narrow">
      <section class="section">
        <div class="grid grid-3">
          <div class="card"><span class="stage-num">Sign-in</span><h3>You sign in yourself</h3><p>Connecting opens a standard Backstory sign-in (OAuth 2.0). Your password is never shared with the AI assistant, and you can disconnect at any time.</p></div>
          <div class="card"><span class="stage-num">Access</span><h3>Your permissions, not more</h3><p>The assistant sees only the accounts and deals your Backstory login can already see. A rep sees their book; a manager sees their team.</p></div>
          <div class="card"><span class="stage-num">Read-only</span><h3>It can look, not change</h3><p>The connector can only read. It cannot update your CRM, send email, or change anything in Backstory.</p></div>
        </div>
      </section>
      <section class="section">
        <h2>What it can see</h2>
        ${checklist([
          'Accounts and opportunities you have access to in Backstory',
          'Summaries of emails, calls, and meetings from the **last 30 days**, matched to those records',
          'Deal risks, next steps, engaged contacts, and scorecard coverage',
          'Public news about publicly traded companies',
        ])}
      </section>
      <section class="section">
        <h2>What it can't do</h2>
        ${checklist([
          'Change CRM records or anything else in Backstory',
          'Read your calendar or full call transcripts',
          'Report metrics, historical roll-ups, or trends older than 30 days',
          'See accounts or deals outside your own permissions',
        ], 'not-list')}
        <div class="callout" style="margin-top:20px"><strong>Good habit:</strong> treat answers like a well-briefed colleague's notes. They're grounded in your data, but check key details before you send anything to a customer.</div>
      </section>
      <section class="section">
        <h2>More detail</h2>
        <ul class="checklist">
          <li>${helpLink('security', 'Backstory MCP security overview')}</li>
          <li>${helpLink('permissions', 'How Backstory permissions work')}</li>
          <li>${helpLink('troubleshooting', 'Troubleshooting the connector')}</li>
          <li><a href="${esc(site.mcpReferenceUrl)}" target="_blank" rel="noopener">Technical reference: MCP tools and limits</a></li>
        </ul>
      </section>
      <section class="section next-card">
        <p style="margin:0">Next: your first 15 minutes.</p>
        <a class="btn btn-primary" href="#/use-it">Use it ${arrow}</a>
      </section>
    </div>`;
  }

  function useIt() {
    return pageHead('03', 'Use it', 'Your first 15 minutes',
      'Connect once, then try four prompts. Each one takes a few minutes and works with the data you already have.') + `
    <div class="wrap narrow">
      <section class="section">
        <h2>Step 1: connect Backstory</h2>
        <p class="muted">About 5 minutes. You only do this once.</p>
        <div style="margin-top:24px">${connectSteps()}</div>
      </section>
      <section class="section">
        <h2>Step 2: try these prompts, in order</h2>
        <p class="muted">Not sure where to begin? Start with the first one.</p>
        <ol class="steps" style="margin-top:24px">
          ${sorted().map((e) => `<li><div class="ex-row">
            <div>
              <h3>${esc(e.title)} ${e.startHere ? '<span class="pill pill-blue" style="vertical-align:middle;margin-left:6px">Start here</span>' : ''}</h3>
              <p style="color:var(--ink-2);margin-bottom:6px">${esc(e.helpsYou)}</p>
              <div class="ex-meta"><span>For ${esc(e.whoFor.join(', '))}</span><span>${esc(e.timeToTry)}</span></div>
            </div>
            <a class="btn ${e.startHere ? 'btn-primary' : 'btn-ghost'}" href="#/example/${esc(e.id)}">Try it ${arrow}</a>
          </div></li>`).join('')}
        </ol>
      </section>
      <section class="section next-card">
        <p style="margin:0">Done all four? See what else is possible.</p>
        <a class="btn btn-ghost" href="#/stretch-it">Stretch it ${arrow}</a>
      </section>
    </div>`;
  }

  function example(id) {
    const list = sorted();
    const idx = list.findIndex((e) => e.id === id);
    if (idx === -1) { location.replace('#/use-it'); return ''; }
    const e = list[idx];
    const next = list[idx + 1];
    return `
    <section class="page-head"><div class="wrap">
      <p class="eyebrow"><span class="mark">///</span> 03 &middot; Use it &middot; Example ${e.order} of ${list.length}</p>
      <h1>${esc(e.title)}</h1>
      <p class="lede">${esc(e.helpsYou)}</p>
    </div></section>
    <div class="wrap ex-layout">
      <div class="ex-main">
        ${video(e.videoUrl, `${e.title} walkthrough`)}
        <section>
          <h2 style="margin-bottom:16px">Copy this prompt</h2>
          ${copyBox('Paste into Claude or ChatGPT', e.prompt)}
          ${e.caveat ? `<div class="callout callout-warn" style="margin-top:12px">${inline(e.caveat)}</div>` : ''}
          <h3 style="margin-top:24px">Or try a variation</h3>
          <ul class="variations">${e.variations.map((v) => `<li><span>${esc(v)}</span><button class="copy-btn" type="button" data-copy="${esc(v)}">Copy</button></li>`).join('')}</ul>
        </section>
        <section>
          <h2 style="margin-bottom:20px">What you'll get back</h2>
          <div class="output">
            <span class="pill output-label">Example response · fictional account</span>
            <div class="md">${markdown(e.expectedOutput)}</div>
          </div>
          <p class="muted" style="margin-top:10px;font-size:14px">Your answer will reflect your own accounts, and the wording will vary each time.</p>
        </section>
        <section class="next-card" style="border-top:1px solid var(--border);padding-top:24px">
          ${next
            ? `<p style="margin:0">Next: <strong>${esc(next.title)}</strong></p><a class="btn btn-primary" href="#/example/${esc(next.id)}">Next example ${arrow}</a>`
            : `<p style="margin:0">That's all four. Want this to run on its own?</p><a class="btn btn-primary" href="#/stretch-it">Stretch it ${arrow}</a>`}
        </section>
      </div>
      <aside class="facts">
        <dl>
          <div class="fact"><dt>Who it's for</dt><dd>${pills(e.whoFor, 'pill-blue')}</dd></div>
          <div class="fact"><dt>Time to try</dt><dd>${esc(e.timeToTry)}</dd></div>
          <div class="fact"><dt>Before you start</dt><dd>${checklist(e.checklist)}</dd></div>
          <div class="fact"><dt>Not connected yet?</dt><dd><a href="#/use-it">Connect Backstory in 5 minutes</a></dd></div>
          <div class="fact"><dt>Make it automatic</dt><dd><a href="${esc(e.stretchLink)}" target="_blank" rel="noopener">${esc(e.stretchLabel)}</a></dd></div>
        </dl>
      </aside>
    </div>`;
  }

  function stretchIt() {
    return pageHead('04', 'Stretch it', 'From a prompt to an automation',
      'Everything so far happens when you ask. The next step is having it happen on its own: a brief before every meeting, a risk review every Monday, delivered to Slack, Teams, or email.') + `
    <div class="wrap narrow">
      <section class="section">
        <h2>Each prompt has an automated version</h2>
        <div class="grid grid-2" style="margin-top:8px">
          ${sorted().map((e) => `<a class="card" href="${esc(e.stretchLink)}" target="_blank" rel="noopener"><span class="stage-num">From: ${esc(e.title)}</span><h3>${esc(e.stretchLabel.split(' — ')[0])}</h3><p>${esc(e.stretchLabel.split(' — ')[1] || '')}</p><span class="more">View workflow ${arrow}</span></a>`).join('')}
        </div>
      </section>
      <section class="section">
        <h2>The full automation library</h2>
        <p>Nearly 40 ready-made workflows for tools like n8n, Zapier, Workato, and Power Automate, covering daily digests, churn risk, renewals, QBR prep, forecasting, and more. These take some technical setup, usually by an admin or RevOps.</p>
        <div class="hero-actions" style="margin-top:16px">
          <a class="btn btn-primary" href="${esc(site.fullLibraryUrl)}" target="_blank" rel="noopener">Open the full library ${arrow}</a>
          <a class="btn btn-ghost" href="${esc(site.mcpReferenceUrl)}" target="_blank" rel="noopener">MCP technical reference</a>
        </div>
      </section>
    </div>`;
  }

  /* ---------- router ---------- */

  const routes = {
    '': home,
    'get-it': getIt,
    'trust-it': trustIt,
    'use-it': useIt,
    'stretch-it': stretchIt,
  };
  const titles = { 'get-it': 'Get it', 'trust-it': 'Trust it', 'use-it': 'Use it', 'stretch-it': 'Stretch it' };

  function render() {
    const path = location.hash.replace(/^#\/?/, '');
    const [page, param] = path.split('/');
    let html;
    let stage = page;
    let title = titles[page];
    if (page === 'example' && param) {
      html = example(param);
      if (!html) return;
      stage = 'use-it';
      const e = examples.find((x) => x.id === param);
      title = e && e.title;
    } else if (routes[page]) {
      html = routes[page]();
    } else {
      location.replace('#/');
      return;
    }
    main.innerHTML = html;
    document.title = title ? `${title} · Backstory MCP Starter` : 'Backstory MCP Starter Library';
    document.querySelectorAll('.stage-nav a').forEach((a) => a.classList.toggle('active', a.dataset.stage === stage));
    window.scrollTo(0, 0);
    main.focus({ preventScroll: true });
  }

  /* ---------- copy buttons ---------- */

  document.addEventListener('click', async (ev) => {
    const btn = ev.target.closest('[data-copy]');
    if (!btn) return;
    const text = btn.getAttribute('data-copy');
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
    }
    btn.textContent = 'Copied';
    btn.classList.add('copied');
    setTimeout(() => { btn.textContent = 'Copy'; btn.classList.remove('copied'); }, 1600);
  });

  /* ---------- boot ---------- */

  Promise.all([fetch('site.json').then((r) => r.json()), fetch('examples.json').then((r) => r.json())])
    .then(([s, e]) => {
      site = s;
      examples = e;
      window.addEventListener('hashchange', render);
      render();
    })
    .catch(() => {
      main.innerHTML = '<div class="wrap page-head"><h1>Something went wrong</h1><p class="lede">We couldn\'t load this page. Please refresh to try again.</p></div>';
    });
})();
