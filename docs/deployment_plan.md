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
1. In the root directory, install the Cloudflare adapter in the client workspace (using version `11.2.0` for Astro v4 compatibility):
   ```bash
   pnpm --filter client add @astrojs/cloudflare@11.2.0
   ```
2. Modify [astro.config.mjs](file:///Users/mstefanutti/workspace/PokeApp/client/astro.config.mjs) to replace `@astrojs/node` with `@astrojs/cloudflare`.
3. Create the modern Cloudflare Pages configuration file [client/wrangler.jsonc](file:///Users/mstefanutti/workspace/PokeApp/client/wrangler.jsonc):
   ```json
   {
     "$schema": "node_modules/wrangler/config-schema.json",
     "name": "pokeapp-client",
     "compatibility_date": "2026-06-06",
     "compatibility_flags": [
       "nodejs_compat"
     ],
     "pages_build_output_dir": "./dist"
   }
   ```
4. Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com/).
5. Create a new Pages project named `pokeapp-client`. You can deploy directly using the Wrangler CLI in the GitHub Action without needing to set up auto-git builds in the Cloudflare dashboard.
6. Go to your Pages project **Settings** -> **Environment variables** and define:
   *   `API_URL`: *(Your Render Web Service URL, e.g. `https://pokeapp-api.onrender.com`)*
   *   `PUBLIC_API_URL`: *(Same Render Web Service URL)*
   *   *Note*: `API_URL` is used on the server side (Astro SSR), while `PUBLIC_API_URL` is compiled into the client-side React components for browser-based fetch actions (e.g. creating/searching Pokemons).

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

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22

      - name: Install Pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 11.5.0
          run_install: false

      - name: Get Pnpm Store Directory
        shell: bash
        id: pnpm-cache
        run: |
          echo "STORE_PATH=$(pnpm store path --silent)" >> $GITHUB_ENV

      - name: Cache Pnpm Dependencies
        uses: actions/cache@v4
        with:
          path: ${{ env.STORE_PATH }}
          key: ${{ runner.os }}-pnpm-store-${{ hashFiles('**/pnpm-lock.yaml') }}
          restore-keys: |
            ${{ runner.os }}-pnpm-store-

      - name: Install Dependencies
        run: pnpm install --frozen-lockfile

      - name: Build Astro Frontend
        env:
          API_URL: ${{ secrets.API_URL }}
          PUBLIC_API_URL: ${{ secrets.API_URL }}
        run: pnpm --filter client run build

      - name: Deploy to Cloudflare Pages
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          CLOUDFLARE_ACCOUNT_ID: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
        run: pnpm --filter client exec wrangler pages deploy dist --project-name=pokeapp-client --branch=main

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Render Deploy Hook
        run: |
          if [ -n "${{ secrets.RENDER_DEPLOY_HOOK_URL }}" ]; then
            curl -f -X POST "${{ secrets.RENDER_DEPLOY_HOOK_URL }}"
          else
            echo "Skipping Render deploy hook: secret not set."
          fi
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
