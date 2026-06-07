# Cloudflare Pages Direct Git Integration Migration Spec

This document specifies the changes required to migrate the PokeApp frontend client deployment from a GitHub Actions workflow step to direct Cloudflare Pages Git Integration.

## Rationale
To solve the deployment issues where Wrangler failed to deploy from the monorepo root directory:
1. The GitHub Actions frontend deploy job is removed to avoid duplicate/conflicting deployment triggers.
2. Cloudflare Pages direct Git integration is utilized with the root directory set to `client`.
3. This keeps the build and deployment logic within Cloudflare's native pipeline.

## Actions
- Modify `.github/workflows/deploy.yml` to remove the `deploy-frontend` job.
- Update `client/docs/CHANGELOG.md` to reflect this removal.
