import { classifyOrg } from './classify.js';

// The network owner of a visitor's IP, from IPinfo. IPINFO_TOKEN (a free IPinfo Lite token)
// raises the rate limit; without it the keyless endpoint still answers at low volume. The IP
// itself is never stored, only the classified owner. Any failure just means "unknown".
export async function lookupOrg(ip) {
  if (!ip || /^(127\.|10\.|192\.168\.|::1|fc|fd)/.test(ip)) return classifyOrg(null);
  const token = process.env.IPINFO_TOKEN;
  const url = token ? `https://api.ipinfo.io/lite/${ip}?token=${token}` : `https://ipinfo.io/${ip}/json`;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(1500) });
    if (!res.ok) return classifyOrg(null);
    const d = await res.json();
    return classifyOrg(d.as_name || d.org || null);
  } catch {
    return classifyOrg(null);
  }
}
