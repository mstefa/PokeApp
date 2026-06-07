# 🔧 Fix: SSR API URL Resolution on Cloudflare Workers

This specification outlines the changes implemented to fix the 403 Forbidden error when fetching PokeApp data on Cloudflare Workers.

## Rationale
1. Astro SSR pages (`home.astro`, `create.astro`, `[id].astro`) execute code on the server side at request time.
2. Previously, these pages resolved the backend API address using `process.env.API_URL`.
3. In a Cloudflare Workers/Pages SSR environment, the standard `process.env` object is undefined/unbound at runtime unless manually configured on the dashboard, causing the path to fall back to `http://localhost:3002`.
4. In Cloudflare Workers, requesting a private loopback address like `http://localhost:3002` triggers SSRF protection, which results in a `403 Forbidden` response.
5. By modifying the URL resolution to check `import.meta.env.API_URL` first, Astro/Vite will bake the build-time environment variable (supplied by GitHub Actions) directly into the compiled SSR bundle, avoiding runtime reliance on missing worker environment variables.

## Proposed Changes
Update `apiBase` assignment in all SSR Astro pages:
```typescript
const apiBase = import.meta.env.API_URL || process.env.API_URL || 'http://localhost:3002';
```

Target files:
- `client/src/pages/home.astro`
- `client/src/pages/create.astro`
- `client/src/pages/pokemon/[id].astro`
