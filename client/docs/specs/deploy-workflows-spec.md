# 🚀 Frontend Deploy Workflow Specification

This specification outlines the changes to the GitHub Actions deployment workflow for the PokeApp Frontend Client.

## Rationale
To optimize CI/CD runs and control deployments:
1. We want to trigger the deployment of the frontend client *only* when changes are made inside the `/client` directory or the workflow file itself.
2. We want the option to manually trigger the deployment using GitHub's `workflow_dispatch`.
3. We want to split this from the backend deployment workflow to prevent unnecessary frontend redeployments when only API code changes.

## Proposed Configuration (`.github/workflows/deploy-client.yml`)
- **Triggers**:
  - `push` to `main` branch with `paths` filter targeting `client/**` and `.github/workflows/deploy-client.yml`.
  - `workflow_dispatch` (manual execution).
- **Steps**:
  - Checkout the repository code.
  - Setup Node.js.
  - Setup and cache `pnpm` dependencies.
  - Install dependencies.
  - Build the Astro frontend client.
  - Deploy to Cloudflare Workers using the wrangler CLI if `secrets.CLOUDFLARE_API_TOKEN` is present.

## Changelog Location
This change will be logged in `client/docs/CHANGELOG.md`.
