// Prints the ADMIN_PASSWORD_HASH value for a password, for the /admin login.
//   node scripts/admin-password.js 'the new password'
// Then: vercel env rm ADMIN_PASSWORD_HASH production && vercel env add ADMIN_PASSWORD_HASH production
// (paste the printed value), and redeploy.
import { hashPassword } from '../api/_lib/auth.js';

const password = process.argv[2];
if (!password || password.length < 12) {
  console.error('Usage: node scripts/admin-password.js "<password of 12+ characters>"');
  process.exit(1);
}
console.log(hashPassword(password));
