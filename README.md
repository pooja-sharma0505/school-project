# Scholar MS — School Management System

A modern School Management System built with **Nuxt 3**, **Vue 3**, **Nitro Server**, and **Tailwind CSS**. Manage students, classes, subjects, attendance, exams, fees, and exam results through an intuitive admin interface.

---

## Tech Stack

| Layer       | Technology                          |
|-------------|-------------------------------------|
| Frontend    | Nuxt 3, Vue 3, Tailwind CSS         |
| Backend     | Nitro Server, H3                      |
| Database    | MySQL (via `mysql2/promise` pool)   |
| Deployment  | Vercel (or any Nitro-compatible host) |

---

## Quick Start

### 1. Clone & Install

```bash
git clone <repository-url>
cd project
npm install
```

### 2. Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` and fill in your MySQL database credentials:

```env
DB_HOST=your-mysql-host.example.com
DB_PORT=3306
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
```

> **Missing env vars?** If any of `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, or `DB_NAME` are missing, the app will throw a clear error at runtime explaining exactly which variable(s) are missing.

### 3. Run Development Server

```bash
npm run dev
```

Open http://localhost:3000

### 4. Build for Production

```bash
npm run build
npm run preview
```

---

## Environment Variables

All variables are read in `nuxt.config.ts` via `runtimeConfig` and are available server-side through `useRuntimeConfig()`.

| Variable                  | Required | Default | Description                                         |
|---------------------------|----------|---------|-----------------------------------------------------|
| `DB_HOST`                 | Yes      | —       | MySQL host (e.g. Clever Cloud, AWS RDS)             |
| `DB_PORT`                 | Yes      | `3306`  | MySQL port                                          |
| `DB_USER`                 | Yes      | —       | MySQL user                                          |
| `DB_PASSWORD`             | Yes      | —       | MySQL password                                      |
| `DB_NAME`                 | Yes      | —       | MySQL database name                                 |
| `API_KEY`                 | No       | —       | If set, POST/PUT/DELETE routes require `X-API-Key` header |
| `NUXT_PUBLIC_SUPABASE_URL`| No       | —       | Supabase URL (frontend client)                      |
| `NUXT_PUBLIC_SUPABASE_ANON_KEY` | No | —    | Supabase anon key (frontend client)                 |

---

## Deploying to Vercel

### Prerequisites

1. A MySQL database (e.g. [Clever Cloud](https://www.clever-cloud.com/), [AWS RDS](https://aws.amazon.com/rds/), [PlanetScale](https://planetscale.com/), or [Supabase Edge](https://supabase.com/docs/guides/database))
2. A Vercel account

### Steps

1. **Push to Git** — Connect your repository to Vercel.

2. **Add Environment Variables** in Vercel Project Settings → Environment Variables:

   | Name        | Value                          | Environment   |
   |-------------|--------------------------------|---------------|
   | `DB_HOST`   | `your-mysql-host.example.com`  | Production    |
   | `DB_PORT`   | `3306`                         | Production    |
   | `DB_USER`   | `your_db_user`                 | Production    |
   | `DB_PASSWORD` | `your_db_password`           | Production    |
   | `DB_NAME`   | `your_db_name`                 | Production    |

   > **Important:** Add the same variables for the **Preview** environment too, so preview deployments work.

3. **Deploy** — Vercel will automatically build and deploy your app.

### Common Deployment Issues

| Problem | Cause | Fix |
|---------|-------|-----|
| All API routes return 500 | DB env vars not set in Vercel | Add `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` in Vercel Project Settings → Environment Variables for both Preview & Production |
| `ECONNREFUSED` or `ENOTFOUND` | Wrong DB host or DB asleep | Verify the host is correct; free-tier DBs may sleep after inactivity — the app retries transient errors automatically |
| `Database configuration incomplete` | One or more env vars missing | Check the error message — it lists exactly which variable(s) are missing |
| App builds but API returns empty arrays | DB unreachable at runtime | Check `/api/health` endpoint; verify firewall allows connections from Vercel's IP ranges |

---

## Database Setup

The database schema is defined in `supabase/migrations/20260713115934_create_school_management_schema.sql` and includes:

- **students** — enrollment, contact info, status
- **classes** — class name, section, teacher, room, capacity
- **subjects** — subject name, code, teacher, linked to classes
- **attendance** — daily attendance records (present/absent/late/leave)
- **exams** — exam details, max/pass marks, term, class
- **results** — exam results with marks, grade, pass/fail status
- **fees** — fee records with payment tracking

### Applying the Schema

```bash
# Using mysql CLI
mysql -h $DB_HOST -u $DB_USER -p$DB_PASSWORD $DB_NAME < supabase/migrations/20260713115934_create_school_management_schema.sql
```

---

## API Structure

All API routes are in `server/api/` and follow RESTful conventions.

```
server/api/
├── students/     GET, POST, PUT, DELETE
├── classes/      GET, POST, PUT, DELETE
├── subjects/     GET, POST, PUT, DELETE
├── attendance/   GET, POST, PUT, DELETE
├── exams/        GET, POST, PUT, DELETE
├── results/      GET, POST, PUT, DELETE
├── fees/         GET, POST, PUT, DELETE
│   └── payment/  PUT (record a payment)
├── debug-db.get  Diagnostic endpoint (DB health + config summary)
├── health.get    Health check (200 healthy / 503 unhealthy)
└── test.ts       Simple DB connectivity test
```

### Key Design Decisions

- **Shared data-access layer** — All routes import `query()` or `safeQuery()` from `~/server/utils/db.ts`. This is the single point of database access.
- **GET routes use `safeQuery()`** — If the DB is down, GET routes return `[]` instead of a 500 error, so the frontend shows "No records found" instead of crashing.
- **Write routes use `query()`** — POST/PUT/DELETE routes throw on DB errors, which `withErrorHandler` converts to proper HTTP error responses.
- **Retry logic** — Transient errors (connection drops, timeouts, deadlocks) are automatically retried with exponential backoff (up to 2 retries).
- **Connection pooling** — Uses `connectionLimit: 1` to stay within free-tier DB limits on serverless platforms.

---

## Project Structure

```
project/
├── components/          # Reusable Vue components
├── composables/         # Vue composables (toast, pagination, grade)
├── layouts/             # Application layouts
├── pages/               # Application pages (students, classes, etc.)
├── server/
│   ├── api/             # API endpoints (RESTful)
│   └── utils/           # Shared utilities (db.ts, api.ts)
├── plugins/             # Nuxt plugins
├── public/              # Static assets
├── supabase/
│   └── migrations/      # Database schema
├── utils/               # Shared helper functions
├── .env.example         # Environment variable template
├── nuxt.config.ts       # Nuxt configuration
└── package.json
```

---

## License

This project is created for learning and educational purposes.

---

## Author

Pooja Sharma
