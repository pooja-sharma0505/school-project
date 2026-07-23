/*
# School Management System Schema

## Overview
Creates a complete single-tenant (no auth) schema for managing students,
attendance, fees, exams, and exam results in a school/college.

## New Tables

### 1. students
- `id` (uuid, PK)
- `first_name` (text, not null)
- `last_name` (text, not null)
- `email` (text, unique)
- `phone` (text)
- `gender` (text: male/female/other)
- `date_of_birth` (date)
- `class` (text - e.g. "Grade 10", "Year 1")
- `section` (text - e.g. "A", "B")
- `roll_number` (text, unique)
- `address` (text)
- `guardian_name` (text)
- `guardian_phone` (text)
- `status` (text: active/inactive/suspended)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

### 2. attendance
- `id` (uuid, PK)
- `student_id` (uuid, FK -> students)
- `date` (date, not null)
- `status` (text: present/absent/late/leave)
- `note` (text)
- `created_at` (timestamptz)
- Unique constraint on (student_id, date)

### 3. fees
- `id` (uuid, PK)
- `student_id` (uuid, FK -> students)
- `title` (text - e.g. "Tuition Q1", "Library Fee")
- `amount` (numeric, not null)
- `paid_amount` (numeric, default 0)
- `status` (text: unpaid/partial/paid)
- `due_date` (date)
- `paid_date` (date)
- `payment_method` (text)
- `note` (text)
- `created_at` (timestamptz)

### 4. exams
- `id` (uuid, PK)
- `name` (text - e.g. "Midterm Exam")
- `term` (text - e.g. "First Term", "Final")
- `class` (text)
- `subject` (text)
- `exam_date` (date)
- `max_marks` (numeric, default 100)
- `pass_marks` (numeric, default 33)
- `note` (text)
- `created_at` (timestamptz)

### 5. results
- `id` (uuid, PK)
- `exam_id` (uuid, FK -> exams)
- `student_id` (uuid, FK -> students)
- `marks_obtained` (numeric, not null)
- `grade` (text - auto-computed letter grade)
- `status` (text: pass/fail)
- `remark` (text)
- `created_at` (timestamptz)
- Unique constraint on (exam_id, student_id)

## Security
- All tables use single-tenant (no auth) RLS policies.
- `TO anon, authenticated` with `USING (true)` / `WITH CHECK (true)`
  because this is an intentionally shared/public app with no login.
- RLS enabled on every table.

## Indexes
- attendance: (student_id, date)
- fees: (student_id)
- results: (exam_id, student_id)
- students: (class), (status)
*/

-- ============ STUDENTS ============
CREATE TABLE IF NOT EXISTS students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text UNIQUE,
  phone text,
  gender text CHECK (gender IN ('male','female','other')),
  date_of_birth date,
  class text,
  section text,
  roll_number text UNIQUE,
  address text,
  guardian_name text,
  guardian_phone text,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive','suspended')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE students ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_students" ON students;
CREATE POLICY "anon_select_students" ON students FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_students" ON students;
CREATE POLICY "anon_insert_students" ON students FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_students" ON students;
CREATE POLICY "anon_update_students" ON students FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_students" ON students;
CREATE POLICY "anon_delete_students" ON students FOR DELETE
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_students_class ON students(class);
CREATE INDEX IF NOT EXISTS idx_students_status ON students(status);

-- ============ ATTENDANCE ============
CREATE TABLE IF NOT EXISTS attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  date date NOT NULL,
  status text NOT NULL DEFAULT 'present' CHECK (status IN ('present','absent','late','leave')),
  note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(student_id, date)
);

ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_attendance" ON attendance;
CREATE POLICY "anon_select_attendance" ON attendance FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_attendance" ON attendance;
CREATE POLICY "anon_insert_attendance" ON attendance FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_attendance" ON attendance;
CREATE POLICY "anon_update_attendance" ON attendance FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_attendance" ON attendance;
CREATE POLICY "anon_delete_attendance" ON attendance FOR DELETE
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_attendance_student_date ON attendance(student_id, date);

-- ============ FEES ============
CREATE TABLE IF NOT EXISTS fees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  title text NOT NULL,
  amount numeric NOT NULL DEFAULT 0,
  paid_amount numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'unpaid' CHECK (status IN ('unpaid','partial','paid')),
  due_date date,
  paid_date date,
  payment_method text,
  note text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE fees ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_fees" ON fees;
CREATE POLICY "anon_select_fees" ON fees FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_fees" ON fees;
CREATE POLICY "anon_insert_fees" ON fees FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_fees" ON fees;
CREATE POLICY "anon_update_fees" ON fees FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_fees" ON fees;
CREATE POLICY "anon_delete_fees" ON fees FOR DELETE
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_fees_student ON fees(student_id);
CREATE INDEX IF NOT EXISTS idx_fees_status ON fees(status);

-- ============ EXAMS ============
CREATE TABLE IF NOT EXISTS exams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  term text,
  class text,
  subject text,
  exam_date date,
  max_marks numeric NOT NULL DEFAULT 100,
  pass_marks numeric NOT NULL DEFAULT 33,
  note text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE exams ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_exams" ON exams;
CREATE POLICY "anon_select_exams" ON exams FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_exams" ON exams;
CREATE POLICY "anon_insert_exams" ON exams FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_exams" ON exams;
CREATE POLICY "anon_update_exams" ON exams FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_exams" ON exams;
CREATE POLICY "anon_delete_exams" ON exams FOR DELETE
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_exams_class ON exams(class);

-- ============ RESULTS ============
CREATE TABLE IF NOT EXISTS results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id uuid NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  marks_obtained numeric NOT NULL DEFAULT 0,
  grade text,
  status text NOT NULL DEFAULT 'pass' CHECK (status IN ('pass','fail')),
  remark text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(exam_id, student_id)
);

ALTER TABLE results ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_results" ON results;
CREATE POLICY "anon_select_results" ON results FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_results" ON results;
CREATE POLICY "anon_insert_results" ON results FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_results" ON results;
CREATE POLICY "anon_update_results" ON results FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_results" ON results;
CREATE POLICY "anon_delete_results" ON results FOR DELETE
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_results_exam_student ON results(exam_id, student_id);

-- ============ AUTO-UPDATE updated_at on students ============
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_students_updated_at ON students;
CREATE TRIGGER update_students_updated_at
  BEFORE UPDATE ON students
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();