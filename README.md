<p align='left'>
    <img src='https://static.wixstatic.com/media/85087f_0d84cbeaeb824fca8f7ff18d7c9eaafd~mv2.png/v1/fill/w_160,h_30,al_c,q_85,usm_0.66_1.00_0.01/Logo_completo_Color_1PNG.webp' alt="Henry Logo" />
</p>

# PokeApp

<p align="left">
  <img height="150" src="./pokemon.png" alt="Pokemon Logo" />
</p>

---

## 📌 Project Overview

This project originally started as an **Individual Project** during the **Henry Bootcamp** to reinforce full-stack web development fundamentals. 

Since then, it has evolved into a personal **learning sandbox** and is actively maintained to explore, practice, and implement modern software engineering standards, advanced architectural patterns, and new technologies.

---

## 🛠️ Evolution & Tech Stack

### ⏪ Original Bootcamp Stack
- **Frontend:** React, Redux, CSS
- **Backend:** Node.js, Express
- **Database:** PostgreSQL, Sequelize

### 🚀 Current Evolved Stack
The codebase has been refactored into a monorepo structure with two decoupled workspaces:

1. **Backend (API):**
   - Built with **TypeScript** & **Express**.
   - Structured following **Hexagonal Architecture (Ports and Adapters)** for high maintainability.
   - Built with a strong focus on **TDD (Test-Driven Development)**.
2. **Frontend (Client):**
   - Powered by **Astro SSR (Server-Side Rendering)** for speed and SEO.
   - Leverages **React Islands** for interactive components.
   - Uses **CSS Modules** for scoped, modern component styling.
3. **Infrastructure:**
   - **PostgreSQL** database running inside a **Docker** container.
   - Orchestrated via a root-level `Makefile` for streamlined development.

---

## 🚦 Getting Started

### Prerequisites
Make sure you have the following installed:
- [Docker](https://www.docker.com/) & Docker Compose
- [Node.js](https://nodejs.org/) (v18+)
- [pnpm](https://pnpm.io/) (used for package management)

### Setup & Installation

Restore all dependencies in both workspaces:
```bash
make install
```

### Development Commands

Use the root [Makefile](file:///Users/mstefanutti/workspace/PokeApp/Makefile) to control the services:

| Command | Description |
| :--- | :--- |
| `make db-up` | Starts the PostgreSQL Docker container in the background. |
| `make dev` | Starts the DB container, the Express API, and the Astro client concurrently. |
| `make run-api` | Runs only the Express API with hot-reloading. |
| `make run-client` | Starts only the Astro development server. |
| `make build` | Compiles both API and Client workspaces for production. |
| `make db-down` | Shuts down the PostgreSQL Docker container. |

---

## 🎯 Original Bootcamp Objectives (Henry)

- Build a full-stack App using React, Redux, Node, and Sequelize.
- Connect and solidify concepts learned throughout the bootcamp.
- Learn development best practices.
- Master the Git workflow.
- Implement automated testing.



