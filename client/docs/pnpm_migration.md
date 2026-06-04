# Package Manager Migration: npm to pnpm

This guide provides instructions to transition the `client` package manager from `npm` to `pnpm`. Swapping to `pnpm` unifies the repository (since the backend `api` already uses it), speeds up installation times, and decreases disk footprints via hard-linking.

---

## Step 1: Pre-installation & Clean-up

To avoid conflicts with old dependency trees, clean the existing build artifacts and lock files in the `client` directory:

```bash
# Navigate to the client directory
cd client

# Remove existing dependencies and lockfiles
rm -rf node_modules
rm -f package-lock.json
```

---

## Step 2: Import Lockfile & Install Dependencies

If you want to maintain the exact version trees defined in the old lock file, you can import them directly:

```bash
# Generate a pnpm-lock.yaml from your old package-lock.json (if you have a backup)
# Or simply generate a fresh pnpm lockfile:
pnpm install
```

### Note on Peer Dependencies
The old setup used `--legacy-peer-deps` in the root `Makefile` because of conflicts with Enzyme and React 17. 
`pnpm` manages peer dependencies strictly. If you run into installation blockers with old peer packages, create or edit the `.npmrc` file in the `client` directory:

```ini
# client/.npmrc
auto-install-peers=true
```
This flag tells `pnpm` to automatically resolve and install missing peer dependencies, matching the lenient behavior of npm v7+ without breaking builds.

---

## Step 3: Script & Environment Updates

We can eliminate legacy SSL overrides. The old setup required `NODE_OPTIONS=--openssl-legacy-provider` because Webpack 4 (via CRA) crashed on newer Node.js releases (Node 17+). 
Astro compiles code using Vite (which uses native esbuild), meaning **you no longer need the legacy SSL flag**.

Update `client/package.json` scripts:

```diff
  "scripts": {
-   "start": "react-scripts start",
-   "build": "react-scripts build",
-   "test": "react-scripts test",
-   "eject": "react-scripts eject"
+   "dev": "astro dev",
+   "start": "astro dev",
+   "build": "astro build",
+   "preview": "astro preview",
+   "test": "vitest"
  }
```

---

## Step 4: Update the Root Makefile

The root `Makefile` contains targets that invoke `npm` commands for the client. Update these targets to utilize `pnpm`:

```diff
 # --- PokeApp Makefile ---
 ...
 install: check-deps
 	@echo "$(YELLOW)Installing backend dependencies...$(NC)"
 	@cd api && pnpm install
 	@echo "$(YELLOW)Installing frontend dependencies...$(NC)"
-	@cd client && npm install --legacy-peer-deps
+	@cd client && pnpm install
 	@echo "$(GREEN)✓ All dependencies installed successfully!$(NC)"
 ...
 run-client:
 	@echo "$(YELLOW)Starting frontend client (npm)...$(NC)"
-	@cd client && NODE_OPTIONS=--openssl-legacy-provider npm start
+	@cd client && pnpm start
 ...
 dev: db-up
 	@echo "$(YELLOW)Starting all services in parallel (API and Client)...$(NC)"
 	@echo "$(CYAN)Press Ctrl+C to stop all processes.$(NC)"
 	@trap 'echo "\n$(RED)Stopping all services...$(NC)"; kill 0' INT; \
 	(cd api && pnpm dev) & \
-	(cd client && NODE_OPTIONS=--openssl-legacy-provider npm start) & \
+	(cd client && pnpm start) & \
 	wait
 ...
 build: check-deps
 	@echo "$(YELLOW)Building backend API...$(NC)"
 	@cd api && pnpm build
 	@echo "$(YELLOW)Building frontend client...$(NC)"
-	@cd client && NODE_OPTIONS=--openssl-legacy-provider npm run build
+	@cd client && pnpm build
 	@echo "$(GREEN)✓ Both frontend and backend builds completed!$(NC)"
```

---

## Step 5: CD/Deployment Configurations

Depending on your deployment structure, update your environment settings:

### Independent Deployments (e.g., Netlify, Vercel, Render)
In your hosting UI settings for the frontend application:
1. **Build Command**: Change from `npm run build` to `pnpm build`.
2. **Install Command (if applicable)**: Ensure `pnpm` is installed globally. (Most modern CD services detect `pnpm-lock.yaml` and install/cache dependencies automatically via `pnpm` without user intervention).
3. **Environment Variables**: You can safely delete `NODE_OPTIONS=--openssl-legacy-provider` if it was set in your hosting control panel.

### Docker Deployments
If you containerize your client, update the `Dockerfile` structure:

```dockerfile
# Old build stage:
# RUN npm install
# RUN npm run build

# New build stage:
FROM node:22-alpine AS builder
RUN npm install -g pnpm
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build
```
