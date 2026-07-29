-- ============ ADMINS ============
-- Admin users table for the login system.
--
-- This table is referenced by:
--   - server/api/auth/login.post.ts  (SELECT for authentication)
--   - server/api/auth/me.get.ts      (SELECT for profile lookup)
--   - server/api/auth/profile.put.ts (SELECT + UPDATE for profile edits)
--
-- NOTE: This table was previously missing from the migration set, which
-- caused "Table 'inventory_db.admins' doesn't exist" errors in production
-- (Vercel) when the database was provisioned from migrations only.
-- Local development worked because the table was created manually.

CREATE TABLE IF NOT EXISTS admins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_admins" ON admins;
CREATE POLICY "anon_select_admins" ON admins FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_admins" ON admins;
CREATE POLICY "anon_insert_admins" ON admins FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_admins" ON admins;
CREATE POLICY "anon_update_admins" ON admins FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_admins" ON admins;
CREATE POLICY "anon_delete_admins" ON admins FOR DELETE
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_admins_email ON admins(email);
