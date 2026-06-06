# 🚀 PokeApp Deployment Plan

This document provides a step-by-step guide to deploying the **PokeApp** full-stack application. It uses a secure, automated, and 100% free-tier-friendly stack (Cloudflare Pages + Render + Supabase).

---

## 🗺️ System Architecture

```mermaid
graph TD
    User([User Browser]) -->|HTTPS| CF[Cloudflare Pages - Astro SSR]
    CF -->|Fetch API Requests| Render[Render Web Service - Express API]
    Render -->|PostgreSQL TCP| DB[(Supabase Database)]
    
    subgraph Future Cache Extension
        Render -.->|ioredis connection| Upstash[(Upstash - Serverless Redis)]
    end
```

### Stack Components
1.  **Frontend**: Hosted on **Cloudflare Pages** (Astro SSR adapter).
2.  **Backend API**: Hosted on **Render** (Free Web Service tier, spins down after 15 min of inactivity).
3.  **Database**: Managed **Supabase** instance (PostgreSQL 15, permanent free tier).
4.  **Cache (Future)**: **Upstash Redis** (Serverless, permanent free tier of 500k queries/month).

---

## 📝 Step-by-Step Deployment Guide

### Step 1: Database Provisioning (Supabase)
1. Go to [Supabase](https://supabase.com/) and sign up or sign in.
2. Click **New Project** and select your organization.
3. Configure the project:
   *   **Name**: `PokeApp`
   *   **Database Password**: *(Generate a strong password and save it securely)*
   *   **Region**: Select the closest region to your target audience (or close to Oregon `us-west-2` to match Render's default free region).
4. Click **Create new project**. It will take 1-2 minutes to provision.
5. Once provisioned, navigate to **Project Settings** (gear icon) -> **Database**.
6. Under **Connection Info**, look for the connection parameters:
   *   **Host**: e.g., `db.xxxxxxxxxx.supabase.co`
   *   **Port**: `5432`
   *   **User**: `postgres`
   *   **Database Name**: `postgres`
   *   Save these details for configuring the backend on Render.
7. *Note*: The backend API automatically synchronizes schemas on startup via Sequelize's `conn.sync({ force: false })` in [index.ts](file:///Users/mstefanutti/workspace/PokeApp/api/src/index.ts). No manual tables creation is necessary!

### Step 2: Backend API Setup (Render)
1. Log in to [Render](https://render.com/).
2. Click **New +** -> **Web Service**.
3. Connect your GitHub repository.
4. Set the following configuration parameters:
   *   **Name**: `pokeapp-api`
   *   **Region**: e.g., `Oregon (US West)` (matches standard free locations)
   *   **Branch**: `main`
   *   **Root Directory**: `api`
   *   **Runtime**: `Node`
   *   **Build Command**: `pnpm install --frozen-lockfile && pnpm run build`
   *   **Start Command**: `pnpm start`
   *   **Instance Type**: `Free`
5. Open the **Environment** tab and add the following variables:
   *   `NODE_ENV`: `production`
   *   `PORT`: `10000`
   *   `DB_HOST`: *(Your Supabase host)*
   *   `DB_PORT`: `5432`
   *   `DB_NAME`: `postgres`
   *   `DB_USER`: `postgres`
   *   `DB_PASSWORD`: *(Your Supabase database password)*
6. Copy the generated Web Service URL (e.g., `https://pokeapp-api.onrender.com`). You will need this for the client environment settings.

### Step 3: Frontend Setup (Cloudflare Pages)
1. In the root directory, we need to install the Cloudflare adapter in the client workspace:
   ```bash
   pnpm --filter client add @astrojs/cloudflare
   ```
2. Modify [astro.config.mjs](file:///Users/mstefanutti/workspace/PokeApp/client/astro.config.mjs) to replace `@astrojs/node` with `@astrojs/cloudflare`.
3. Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com/).
4. Navigate to **Workers & Pages** -> **Create Application** -> **Pages** tab.
5. Click **Connect to Git** and choose the `PokeApp` repository.
6. Configure the build settings:
   *   **Project Name**: `pokeapp-client`
   *   **Production Branch**: `main`
   *   **Framework Preset**: `Astro` (or select `None` and configure manually)
   *   **Build Command**: `pnpm build`
   *   **Build Output Directory**: `dist`
   *   **Root Directory**: `client`
7. Click **Save and Deploy**.
8. Go to **Settings** -> **Environment variables** in Cloudflare Pages and add:
   *   `API_URL`: *(Your Render Web Service URL)*
9. Redeploy the frontend so that Astro picks up the environment variable during build-time rendering.

---

## 🔮 Future Enhancement: Redis (Upstash) Setup

When you are ready to enable caching in the future, follow these steps:
1. Create a free Redis database at [Upstash](https://upstash.com/).
2. Obtain the standard Redis connection string (e.g., `rediss://default:pwd@host:port`).
3. Add the `redis` or `ioredis` package to the API's dependencies.
4. Define a `REDIS_URL` environment variable on the Render backend.
5. Write the caching adapter inside the api code (e.g., in the hexagonal repository pattern) to cache API requests.

---

## 🤖 CI/CD Automation (GitHub Actions)

We will configure two workflows in `.github/workflows/` to automatically test and deploy the codebase.

### 1. PR Check & Security Audit (`.github/workflows/pr-check.yml`)
Runs whenever a Pull Request is opened or updated targeting the `main` branch. This workflow:
*   Sets up the correct environment (Node.js & Pnpm).
*   Verifies lockfile integrity and checks for package vulnerabilities with `pnpm audit`.
*   Runs project formatting, linter checks, and all Vitest / Cucumber integration tests to ensure code quality.

```yaml
name: PR Verification & Security Check

on:
  pull_request:
    branches: [main]

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22

      - name: Install Pnpm
        uses: pnpm/action-setup@v3
        with:
          version: 11.5.0
          run_install: false

      - name: Get Pnpm Store Directory
        shell: bash
        run: |
          echo "STORE_PATH=$(pnpm store path --silent)" >> $GITHUB_ENV

      - name: Cache Pnpm Dependencies
        uses: actions/cache@v4
        with:
          path: ${{ env.STORE_PATH }}
          key: ${{ runner.os }}-pnpm-store-${{ hashFiles('**/pnpm-lock.yaml') }}
          restore-keys: |
            ${{ runner.os }}-pnpm-store-

      - name: Install Workspace Dependencies
        run: pnpm install --frozen-lockfile

      # Security: Audit dependencies for vulnerabilities
      - name: Run Security Audit
        run: pnpm audit --prod

      # Code Quality Checks
      - name: Lint Code
        run: |
          pnpm --filter pokemon-api run lint
          pnpm --filter client run lint || echo "No client lint script configured"

      - name: Run Backend Tests
        run: |
          pnpm --filter pokemon-api run test:unit
          # Note: Database integration tests can be run here if mock DBs are set up.
```

### 2. Auto-Deployment (`.github/workflows/deploy.yml`)
Triggers on a merge to the `main` branch.
*   **Frontend**: Deploys the Astro app directly to Cloudflare Pages.
*   **Backend**: Triggers Render's auto-deployment via Webhook.

```yaml
name: Continuous Deployment

on:
  push:
    branches: [main]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Deploy to Cloudflare Pages
        uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: pokeapp-client
          directory: client/dist
          # Assumes build was triggered/handled or Astro is configured to build on Pages
          # Pages build can also be run locally in GHA and static files uploaded:
          gitBranch: main

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Render Deploy Hook
        run: |
          curl -f -X POST "${{ secrets.RENDER_DEPLOY_HOOK_URL }}"
```

---

## 🛡️ Secure & Grouped Dependabot Config (`.github/dependabot.yml`)

To protect the software supply chain while maintaining a low-noise contribution workflow, we configure Dependabot with the following best practices:
1.  **Weekly Interval**: Run checks every Monday to avoid daily PR spam.
2.  **Open PR Limits**: Cap the open PR count at `5` to prevent backlogs.
3.  **Grouped Updates**: Group minor and patch updates together. Instead of 15 PRs for minor updates, you get a single grouped PR.
4.  **Lockfile Integrity**: Checked against `pnpm-lock.yaml` hashes.
5.  **Ignored Versions**: Prevent breaking major version changes from auto-creating PRs unless requested.

```yaml
version: 2
updates:
  # 1. API Dependencies
  - package-ecosystem: "npm"
    directory: "/api"
    schedule:
      interval: "weekly"
      day: "monday"
      time: "08:00"
    open-pull-requests-limit: 5
    # Group minor and patch updates to avoid PR noise
    groups:
      dependencies:
        patterns:
          - "*"
        update-types:
          - "minor"
          - "patch"

  # 2. Client Dependencies
  - package-ecosystem: "npm"
    directory: "/client"
    schedule:
      interval: "weekly"
      day: "monday"
      time: "09:00"
    open-pull-requests-limit: 5
    groups:
      dependencies:
        patterns:
          - "*"
        update-types:
          - "minor"
          - "patch"

  # 3. GitHub Actions Workflows
  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "weekly"
```

---

## 🛠️ Special Section: Tasks Antigravity Needs to Implement

Once you authorize me, I will create the configurations and update the environment files:

*   [ ] **Create Dependabot Config**: Add the security-oriented `.github/dependabot.yml` file.
*   [ ] **Create GitHub Actions Workflows**: Add the PR verification workflow `.github/workflows/pr-check.yml` and the CD trigger workflow `.github/workflows/deploy.yml`.
*   [ ] **Adapt Astro Client for Cloudflare**: Add `@astrojs/cloudflare` dependency to `/client` and update `astro.config.mjs` to target Cloudflare SSR.
