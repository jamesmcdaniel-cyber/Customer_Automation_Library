# Signed identity links to the MCP starter library

The MCP starter library (https://www.customerforlife.ai) records which pages and resources each visitor uses, for the customer success team. Links from places that already know the signed-in Backstory user can carry that user's identity, so their visits show under their name instead of as an anonymous visitor.

## What to add

Append `bsid=<token>` to any link to the site:

```
https://www.customerforlife.ai/?bsid=<token>
https://www.customerforlife.ai/get-it?bsid=<token>
```

`<token>` is a JWT signed with **HS256** using the shared secret `IDENTITY_LINK_SECRET` (ask James McDaniel for it; never put it in client-side code).

| Claim | Required | Value |
|---|---|---|
| `email` | yes | The signed-in user's email. |
| `exp` | yes | Expiry, Unix seconds. Use 30 days or less. |
| `name` | no | Display name. |
| `company` | no | The customer account name. |
| `src` | no | Where the link sits: `app` (default), `email`, `onboarding`, … Shows in the panel as the source. |

Generate the token on the **server** when rendering the page or email, per user.

### Node

```js
import jwt from 'jsonwebtoken';

const token = jwt.sign(
  { email: user.email, name: user.name, company: account.name, src: 'app' },
  process.env.IDENTITY_LINK_SECRET,
  { algorithm: 'HS256', expiresIn: '30d' },
);
const url = `https://www.customerforlife.ai/?bsid=${token}`;
```

### Python

```python
import time, jwt  # PyJWT

token = jwt.encode(
    {"email": user.email, "name": user.name, "company": account.name, "src": "app",
     "exp": int(time.time()) + 30 * 86400},
    IDENTITY_LINK_SECRET,
    algorithm="HS256",
)
url = f"https://www.customerforlife.ai/?bsid={token}"
```

## Good places for the link

- The app's help or resources menu, and any "Connect your AI tool" or MCP settings page.
- Onboarding checklists and in-app announcements about MCP.
- Product emails sent from your own backend (they can sign per recipient). Marketing tools that can't run code can't sign; use `utm_` parameters there instead.

## How the site uses it

- The token is checked against the secret. An invalid, expired, or unsigned token is ignored and the visit is recorded as anonymous, so a broken link never blocks anyone.
- A valid token ties that browser to the person. Their later visits, however they arrive, show under their name.
- The token is removed from the address bar on arrival. The site stores the email, name, company, and `src`, never the token.

## Testing

`IDENTITY_LINK_SECRET=… node scripts/identity-link.js you@company.com "Your Name" "Company"` (in the Customer_Automation_Library repo) prints a working link. Open it, then find yourself under People at https://www.customerforlife.ai/admin.

## Rotating the secret

Change `IDENTITY_LINK_SECRET` in the Vercel project (customer-automation-library) and in every system that signs links, then redeploy. Links signed with the old secret stop identifying people.
