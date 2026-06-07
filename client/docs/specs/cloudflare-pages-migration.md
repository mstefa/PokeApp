# Cloudflare Workers Builds Migration Spec

This document specifies the changes required to migrate the PokeApp frontend client deployment from Cloudflare Pages to Cloudflare Workers (using Workers Builds).

## Rationale
To align with the Cloudflare Workers dashboard settings (Workers Builds), we must configure the frontend client as a Worker with static assets rather than a Pages project. This matches the settings available in the Workers dashboard:
- **Build command**
- **Deploy command**
- **Root directory**

## Actions
1. Update `client/wrangler.jsonc` to declare `main` and `assets` instead of `pages_build_output_dir`.
2. Ensure the build command is configured correctly.
3. Update the changelog to document this configuration change.
