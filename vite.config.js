import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Local work on the tracking API and /admin: run `vercel dev --listen 3311` for the functions,
// then `API_PROXY=http://localhost:3311 npm run dev` so the site's /api calls reach them.
// (vercel dev's own front end breaks on the SPA rewrite in vercel.json.)
export default defineConfig({
  plugins: [react()],
  server: process.env.API_PROXY ? { proxy: { '/api': { target: process.env.API_PROXY, xfwd: true } } } : {},
});
