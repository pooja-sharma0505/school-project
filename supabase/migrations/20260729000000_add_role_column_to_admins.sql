-- ============ ADD ROLE COLUMN TO ADMINS (TiDB Cloud / MySQL) ============
-- This migration adds the `role` column to the `admins` table for TiDB Cloud
-- (MySQL-compatible) databases that were provisioned before the original
-- Supabase migration (20260728000000_create_admins_table.sql) was applied.
--
-- The Supabase migration already includes `role` in the CREATE TABLE, but
-- TiDB Cloud databases created manually or from an older schema may be missing
-- it. Without this column, the login query throws:
--   "Unknown column 'role' in 'field list'"
--
-- The login endpoint (server/api/auth/login.post.ts) has been updated to NOT
-- select `role` (it defaults to 'admin' in the JWT), so this migration is
-- optional — but recommended if you want to support multiple admin roles.
--
-- Run this on your TiDB Cloud database:
--   mysql -h <host> -P 4000 -u <user> -p<database> < 20260729000000_add_role_column_to_admins.sql

ALTER TABLE admins ADD COLUMN IF NOT EXISTS role VARCHAR(50) NOT NULL DEFAULT 'admin';

-- Backfill any existing rows that might have a NULL role (shouldn't happen
-- with the NOT NULL DEFAULT above, but this is a safety net for older MySQL
-- versions that don't support IF NOT EXISTS on ALTER TABLE).
UPDATE admins SET role = 'admin' WHERE role IS NULL OR role = '';

-- Verify the column was added
SELECT id, email, role FROM admins LIMIT 5;
