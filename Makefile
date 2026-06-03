# --- PokeApp Makefile ---
# Allows running and building the entire application with simple commands.

# Ensure NVM and Homebrew paths are included in the PATH for Makefile commands
NVM_DIR ?= $(HOME)/.nvm
NVM_BIN := $(shell ls -d $(NVM_DIR)/versions/node/*/bin 2>/dev/null | tail -n 1)
export PATH := $(NVM_BIN):/opt/homebrew/bin:/usr/local/bin:$(PATH)

# Colors for pretty printing
YELLOW := \033[1;33m
GREEN  := \033[1;32m
RED    := \033[1;31m
CYAN   := \033[1;36m
NC     := \033[0m # No Color

.PHONY: default
default: help

## help: Display this help message.
.PHONY: help
help:
	@echo "$(CYAN)Available Makefile commands:$(NC)"
	@grep -E '^##' $(MAKEFILE_LIST) | sed -e 's/## //' | column -t -s ':' |  sed -e 's/^/  /'

## install: Install all dependencies for both api (backend) and client (frontend).
.PHONY: install
install: check-deps
	@echo "$(YELLOW)Installing backend dependencies...$(NC)"
	@cd api && pnpm install
	@echo "$(YELLOW)Installing frontend dependencies...$(NC)"
	@cd client && npm install --legacy-peer-deps
	@echo "$(GREEN)✓ All dependencies installed successfully!$(NC)"

## db-up: Start PostgreSQL database container in the background.
.PHONY: db-up
db-up: check-docker
	@echo "$(YELLOW)Starting database container...$(NC)"
	@docker compose up -d postgres || docker-compose up -d postgres
	@echo "$(GREEN)✓ Database container started!$(NC)"

## db-down: Stop the PostgreSQL database container.
.PHONY: db-down
db-down:
	@echo "$(YELLOW)Stopping database container...$(NC)"
	@docker compose down || docker-compose down
	@echo "$(GREEN)✓ Database container stopped!$(NC)"

## db-logs: Show real-time logs from the database container.
.PHONY: db-logs
db-logs:
	@docker compose logs -f postgres || docker-compose logs -f postgres

## run-api: Check if database is up, start the backend API, and verify it is running.
.PHONY: run-api
run-api: check-deps check-docker
	@echo "$(YELLOW)Checking if database is running...$(NC)"
	@docker compose ps postgres 2>/dev/null | grep -q "Up" || { \
		echo "$(YELLOW)Database not running. Starting database container...$(NC)"; \
		$(MAKE) db-up; \
	}
	@echo "$(YELLOW)Waiting for database to be ready...$(NC)"
	@i=1; while [ $$i -le 30 ]; do \
		if docker exec postgres-local pg_isready -U admin -d app_db >/dev/null 2>&1; then \
			echo "$(GREEN)✓ Database is up and ready!$(NC)"; \
			break; \
		fi; \
		if [ $$i -eq 30 ]; then \
			echo "$(RED)Error: Database failed to become ready in time.$(NC)"; \
			exit 1; \
		fi; \
		sleep 1; \
		i=$$((i+1)); \
	done
	@echo "$(YELLOW)Starting backend API...$(NC)"
	@cd api && pnpm dev & \
	PID=$$!; \
	trap 'kill $$PID 2>/dev/null || true' INT TERM EXIT; \
	echo "$(YELLOW)Waiting for API to start on port 3002...$(NC)"; \
	i=1; while [ $$i -le 15 ]; do \
		if curl -s http://localhost:3002/health | grep -q '"status":"ok"'; then \
			echo "$(GREEN)✓ Backend API is up and running successfully on port 3002!$(NC)"; \
			wait $$PID; \
			exit 0; \
		fi; \
		if ! kill -0 $$PID 2>/dev/null; then \
			echo "$(RED)Error: Backend API crashed during startup.$(NC)"; \
			exit 1; \
		fi; \
		sleep 1; \
		i=$$((i+1)); \
	done; \
	echo "$(RED)Error: Backend API failed to respond on health check in time.$(NC)"; \
	exit 1

## run-client: Run the frontend client in development mode.
.PHONY: run-client
run-client:
	@echo "$(YELLOW)Starting frontend client (npm)...$(NC)"
	@cd client && NODE_OPTIONS=--openssl-legacy-provider npm start

## dev: Start the database and run both API and client in parallel.
.PHONY: dev
dev: db-up
	@echo "$(YELLOW)Starting all services in parallel (API and Client)...$(NC)"
	@echo "$(CYAN)Press Ctrl+C to stop all processes.$(NC)"
	@trap 'echo "\n$(RED)Stopping all services...$(NC)"; kill 0' INT; \
	(cd api && pnpm dev) & \
	(cd client && NODE_OPTIONS=--openssl-legacy-provider npm start) & \
	wait

## build: Build both the API and client for production.
.PHONY: build
build: check-deps
	@echo "$(YELLOW)Building backend API...$(NC)"
	@cd api && pnpm build
	@echo "$(YELLOW)Building frontend client...$(NC)"
	@cd client && NODE_OPTIONS=--openssl-legacy-provider npm run build
	@echo "$(GREEN)✓ Both frontend and backend builds completed!$(NC)"

## clean: Clean build folders and node_modules.
.PHONY: clean
clean:
	@echo "$(YELLOW)Cleaning build directories and dependencies...$(NC)"
	@rm -rf api/dist api/node_modules client/build client/node_modules
	@echo "$(GREEN)✓ Clean complete! Run 'make install' to reinstall dependencies.$(NC)"

# Internal utility checks
.PHONY: check-deps
check-deps:
	@command -v node >/dev/null 2>&1 || { echo "$(RED)Error: Node.js is not installed.$(NC)"; exit 1; }
	@command -v pnpm >/dev/null 2>&1 || { echo "$(RED)Error: pnpm is not installed. Install it with 'npm install -g pnpm'.$(NC)"; exit 1; }

.PHONY: check-docker
check-docker:
	@command -v docker >/dev/null 2>&1 || { echo "$(RED)Error: Docker is not installed or running. Please install and start Docker.$(NC)"; exit 1; }
