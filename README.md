# Backstory MCP Starter Library

A simplified, public starter guide to the Backstory MCP, organized as
**Get It → Trust It → Use It → Stretch It**. It has four starter prompts, each
simple enough to demo in a short video. The full 38-workflow automation library
is the "Stretch It" destination: it's linked from here, not copied.

This is a plain static site with no build step and no dependencies.

## Editing content

Most updates don't touch code.

| To change… | Edit |
|---|---|
| A prompt, sample output, checklist, or video | `examples.json` |
| The overview video, Intercom links, or MCP / library URLs | `site.json` |
| Page copy (Get It, Trust It, Stretch It) | `app.js`, in the page functions |

- **Videos:** set `videoUrl` (or `overviewVideoUrl`) to a YouTube, Loom, or Vimeo
  link. Share links are converted to embeds automatically. Leave it empty to show
  a "Video coming soon" placeholder.
- **Intercom links:** fill in the `intercom` keys in `site.json`. Empty values
  show "(help article coming soon)".
- **Adding a fifth example:** add an entry to `examples.json` with the next
  `order`. It shows up on Home, Use It, and Stretch It automatically.

## Run locally

```sh
python3 -m http.server 8000
# open http://localhost:8000
```

## Routes

- `#/`
- `#/get-it`
- `#/trust-it`
- `#/use-it`
- `#/example/<id>`
- `#/stretch-it`

## Deploy

Hosted on Vercel as static files (see `vercel.json`, which sets no framework and
no build). Connect this repo in Vercel for auto-deploy on push.
