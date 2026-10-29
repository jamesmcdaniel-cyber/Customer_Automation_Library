// How a visit arrived, what kind of network it came from, and the device. Pure functions,
// so the ingest endpoint and the tests share them.

const hostOf = (url) => {
  try {
    return new URL(url).hostname.toLowerCase().replace(/^www\./, '');
  } catch {
    return '';
  }
};

// Ordered: the first group whose pattern matches the referrer's host wins.
const REFERRERS = [
  ['help_center', /(^|\.)help\.backstory\.ai$|intercom\.help$/],
  ['backstory_site', /(^|\.)(backstory\.ai|people\.ai)$/],
  ['ai_assistant', /(^|\.)(chatgpt\.com|chat\.openai\.com|claude\.ai|perplexity\.ai|gemini\.google\.com|copilot\.microsoft\.com)$/],
  ['search', /(^|\.)(google\.[a-z.]+|bing\.com|duckduckgo\.com|search\.yahoo\.com|yahoo\.com|ecosia\.org|baidu\.com|yandex\.[a-z]+|search\.brave\.com)$/],
  ['slack', /(^|\.)slack\.com$/],
  ['social', /(^|\.)(linkedin\.com|lnkd\.in|t\.co|twitter\.com|x\.com|facebook\.com|youtube\.com|reddit\.com)$/],
];

// A referrer domain shown as its registrable name (google.com, not www.google.com).
const shortHost = (host) => {
  if (/(^|\.)slack\.com$/.test(host)) return 'slack.com';
  if (/(^|\.)linkedin\.com$/.test(host)) return 'linkedin.com';
  if (/(^|\.)help\.backstory\.ai$/.test(host)) return 'help.backstory.ai';
  return host;
};

export function classifyChannel({ link, referrer, utm = {}, host }) {
  if (link) return { channel: 'shared_link', source: link.csm || null };
  if (utm.source || utm.medium || utm.campaign) {
    const email = /e-?mail|newsletter/i.test(utm.medium || '');
    return { channel: email ? 'email' : 'campaign', source: utm.source || utm.campaign || null };
  }
  const ref = hostOf(referrer);
  const own = (host || '').toLowerCase().replace(/:\d+$/, '').replace(/^www\./, '');
  if (!ref || ref === own) return { channel: 'direct', source: null };
  for (const [channel, re] of REFERRERS) if (re.test(ref)) return { channel, source: shortHost(ref) };
  return { channel: 'referral', source: ref };
}

// Network owners that are internet providers or clouds, not the visitor's employer.
const ISP = /comcast|verizon|at&t|\bat ?t\b|charter|spectrum|cox comm|centurylink|lumen|frontier|windstream|optimum|altice|mediacom|t-mobile|sprint|vodafone|telekom|telefonica|orange|\bbt\b|british telecom|virgin media|sky broadband|rogers|bell canada|telus|shaw|bouygues|free sas|swisscom|kpn|telstra|optus|jio|airtel|starlink|cable|broadband|telecom|wireless|mobile|cellular|internet service|\bisp\b|communications/i;
const CLOUD = /amazon|aws|google|microsoft|azure|cloudflare|digitalocean|linode|akamai|oracle cloud|ovh|hetzner|vultr|fastly|zscaler|netskope|private internet access|nordvpn|expressvpn|m247|datacamp|leaseweb|choopa/i;

export function classifyOrg(org) {
  if (!org) return { name: null, kind: null };
  const name = String(org).replace(/^AS\d+\s+/i, '').trim();
  if (CLOUD.test(name)) return { name, kind: 'cloud' };
  if (ISP.test(name)) return { name, kind: 'isp' };
  return { name, kind: 'company' };
}

export function deviceOf(ua = '') {
  if (/iPad|Tablet/i.test(ua)) return 'tablet';
  if (/Mobi|iPhone|Android/i.test(ua)) return 'mobile';
  return 'desktop';
}

export const isBot = (ua = '') => !ua || /bot|crawl|spider|slurp|headless|preview|facebookexternalhit|embedly|curl|wget|python-requests/i.test(ua);
