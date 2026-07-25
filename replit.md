# Scholar MS — School Management System

A Nuxt 3 school management system for managing students, classes, subjects, attendance, exams, fees, and results.

## Tech Stack
- **Frontend/Backend**: Nuxt 3, Vue 3, Tailwind CSS, Nitro Server
- **Database**: MySQL (via `mysql2/promise`)

## Running the App

```bash
NUXT_TELEMETRY_DISABLED=1 npm run dev
```

The dev server runs on port **5000**. The workflow "Start application" is already configured and will start automatically.

## Login
Default credentials (set via env vars `ADMIN_EMAIL` / `ADMIN_PASSWORD`):
- Email: `admin@scholar.edu`
- Password: `admin123`

## Environment Variables
Set in Replit Secrets:

| Variable      | Description              |
|---------------|--------------------------|
| `DB_HOST`     | MySQL host               |
| `DB_PORT`     | MySQL port (default 3306)|
| `DB_USER`     | MySQL user               |
| `DB_PASSWORD` | MySQL password           |
| `DB_NAME`     | MySQL database name      |
| `ADMIN_EMAIL` | Admin login email        |
| `ADMIN_PASSWORD` | Admin login password  |
| `API_KEY`     | Optional: protects write routes |

## User Preferences
- Keep existing project structure and stack.
