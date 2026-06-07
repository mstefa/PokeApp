# Spec: Database Connection Review & Logging

This specification defines the review, enhancements, and testing for the API database connection logic. The goal is to support both local development (Docker-based PostgreSQL using `.env.local`) and cloud environments (Supabase using `.env`), prioritizing local overrides, while adding comprehensive error logging to make connection diagnostics easier.

---

## 🎯 Objectives

1. **Flexible Environment Loading**: Load configuration from `.env.local` first (local overrides), falling back to `.env` (Supabase / default configuration).
2. **Unified Database Setup**: Standardize Sequelize initialization to ensure dialect options (including SSL) are respected in all environments.
3. **Comprehensive Logging**: Add diagnostic logs for the database connection process, explicitly testing credentials/accessibility using `.authenticate()`, and print friendly error summaries for common postgres/connection errors.

---

## ⚙️ Design & Implementation Details

### 1. Environment Loading (`api/src/config/app.config.ts`)
We will modify the environment initialization to load files in the correct precedence:
1. Parse both `.env` and `.env.local` configurations using `dotenv.parse()`.
2. Check if `DB_CONNECTION=supabase` is active (defined in the shell, `.env.local`, or `.env`).
3. If it is `supabase`, we prioritize the database connection keys (`DB_HOST`, `DB_PORT`, `DB_USER`, `DB_NAME`, `DB_PASSWORD`, `DB_SSL`) from `.env` (Supabase). Other non-database keys from `.env.local` (e.g. custom server `PORT`) are still merged.
4. If it is not `supabase`, we prioritize `.env.local` for all database connection keys and other variables, falling back to `.env` only for keys not present in `.env.local`.
5. Set `DB_SSL` default to `'false'` for local database connections.

```typescript
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

const envLocalPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envLocalPath)) {
  dotenv.config({ path: envLocalPath });
}
dotenv.config(); // fallback to .env
```

### 2. Unified Sequelize Initialization (`api/src/infrastructure/persistence/sequelize.ts`)
Currently, in development/test, Sequelize is initialized using a raw connection string URI. This prevents `dialectOptions` (e.g., SSL parameters required for Supabase) from being passed correctly. We will unify initialization by passing the structured options object in all environments:

```typescript
const dbConfig = config.database;

const sequelize = new Sequelize({
  database: dbConfig.database,
  dialect: 'postgres',
  host: dbConfig.host,
  port: dbConfig.port,
  username: dbConfig.username,
  password: dbConfig.password,
  pool: dbConfig.pool,
  dialectOptions: dbConfig.dialectOptions,
  logging: dbConfig.logging ? (sql) => logger.debug(sql) : false,
});
```

### 3. Comprehensive Logging (`api/src/index.ts`)
Before running `conn.sync()`, we will explicitly call `conn.authenticate()` to check the connection. If it fails, we will catch the error and log it using our customized logger. We will also extract clean diagnostic details:

- Redact password information from logs.
- Identify common Sequelize connection issues (e.g., `ConnectionRefusedError`, `AccessDeniedError`, etc.) and output a user-friendly diagnostic message.

---

## 🧪 Testing Plan

1. **Unit/Integration Test**: Write a test verifying that the correct environment variables are loaded and that the connection behaves properly under various configurations.
2. **Manual Test**:
   - Start the local docker database, verify the server connects using `.env.local`.
   - Shutdown the local database, verify a helpful connection error is logged.
   - Configure to connect to Supabase, verify connection over SSL.
