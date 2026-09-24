# Backstory MCP Starter Library

A simplified, public starter guide to the Backstory MCP, organized as
**Get It → Trust It → Use It → Stretch It**. It has four starter prompts, each
simple enough to demo in a short video. The full 38-workflow automation library
is the "Stretch It" destination: it's linked from here, not copied.

Built with Vite, React, Tailwind, and Radix primitives. The design copies the full
library's `web/` app: same Tailwind tokens, `SectionHero`, cards, `Button`,
`CopyButton`, and `Tabs`.

## Editing content

Most updates don't touch code.

| To change… | Edit |
|---|---|
| A prompt, sample output, checklist, or video | `src/data/examples.json` |
| The overview video, Intercom links, or MCP / library URLs | `src/data/site.json` |
| Page copy (Get It, Trust It, Use It, Stretch It) | `src/pages/*.jsx` |

- **Videos:** set `videoUrl` (or `overviewVideoUrl`) to a Zight, YouTube, Loom, or
  Vimeo link. Zight links play as a native video sized exactly to the recording;
  the others are embedded. Leave it empty to show a "Video coming soon"
  placeholder.
- **Intercom links:** fill in the `intercom` keys in `src/data/site.json`. Empty values
  show "(help article coming soon)".
- **Adding a fifth example:** add an entry to `src/data/examples.json` with the next
  `order`. It shows up on Home, Use It, and Stretch It automatically.

## Run locally

```sh
npm install
npm run dev
```

## Routes

- `/`
- `/get-it`
- `/trust-it`
- `/use-it`
- `/example/<id>`
- `/stretch-it`

Older `#/...` links redirect to the matching path.

## Deploy

Hosted on Vercel, which builds with Vite on every push to `main`. `vercel.json`
rewrites every non-asset path to `index.html` so direct links work.
