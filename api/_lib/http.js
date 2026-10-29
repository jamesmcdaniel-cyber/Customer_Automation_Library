// Small helpers shared by the API functions.

export function body(req) {
  // sendBeacon posts a JSON string; fetch posts parsed JSON. Accept both.
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }
  return req.body || {};
}

export const json = (res, status, data) => res.status(status).setHeader('cache-control', 'no-store').json(data);

const ID = /^[A-Za-z0-9_-]{6,64}$/;
export const validId = (v) => typeof v === 'string' && ID.test(v);
export const text = (v, max = 300) => (typeof v === 'string' && v.trim() ? v.trim().slice(0, max) : null);

export const clientIp = (req) =>
  String(req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || '').split(',')[0].trim() || null;

const header = (req, name) => {
  const v = req.headers[name];
  if (!v) return null;
  try {
    return decodeURIComponent(v);
  } catch {
    return v;
  }
};

// Vercel adds the visitor's approximate location to every request.
export const geo = (req) => ({
  country: header(req, 'x-vercel-ip-country'),
  region: header(req, 'x-vercel-ip-country-region'),
  city: header(req, 'x-vercel-ip-city'),
});
