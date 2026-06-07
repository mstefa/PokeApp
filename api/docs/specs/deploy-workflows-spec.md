# 🚀 Backend Deploy Workflow Specification

This specification outlines the changes to the GitHub Actions deployment workflow for the PokeApp Backend API.

## Rationale
To optimize CI/CD runs and control deployments:
1. We want to trigger the deployment of the backend API *only* when changes are made inside the `/api` directory or the workflow file itself.
2. We want the option to manually trigger the deployment using GitHub's `workflow_dispatch`.
3. We want to split this from the frontend deployment workflow to prevent unnecessary backend redeployments when only client code changes.

## Proposed Configuration (`.github/workflows/deploy-api.yml`)
- **Triggers**:
  - `push` to `main` branch with `paths` filter targeting `api/**` and `.github/workflows/deploy-api.yml`.
  - `workflow_dispatch` (manual execution).
- **Steps**:
  - Check if `secrets.RENDER_DEPLOY_HOOK_URL` is set.
  - Trigger deployment by calling the Render Webhook URL using `curl`.

## Changelog Location
This change will be logged in `api/docs/CHANGELOG.md`.
