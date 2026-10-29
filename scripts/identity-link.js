// Prints a signed identity link, for testing and for one-off sends from a tool that can't sign.
//   IDENTITY_LINK_SECRET=... node scripts/identity-link.js jane@acme.com "Jane Doe" "Acme" [page] [days]
// See docs/identity-links.md for how the Backstory app should generate these.
import { signIdentity } from '../api/_lib/identity.js';

const [email, name, company, page = '/', days = '30'] = process.argv.slice(2);
const secret = process.env.IDENTITY_LINK_SECRET;
if (!email || !secret) {
  console.error('Usage: IDENTITY_LINK_SECRET=... node scripts/identity-link.js <email> [name] [company] [page] [days]');
  process.exit(1);
}
const exp = Math.floor(Date.now() / 1000) + Number(days) * 86400;
const token = signIdentity({ email, name, company, src: 'link', exp }, secret);
console.log(`https://www.customerforlife.ai${page}?bsid=${token}`);
