/**
 * GET /api/dashboard
 *
 * Single aggregated endpoint that returns ALL data needed by the homepage
 * in one request. This replaces the 6 parallel API calls the frontend was
 * making (students, classes, subjects, attendance, fees, exams) and
 * consolidates them into a single cached response.
 *
 * Caching is handled by routeRules in nuxt.config.ts:
 *   '/api/dashboard': { cache: { swr: true, maxAge: 60 } }
 *
 * Performance:
 *   - All queries run in a single Promise.all (parallel, not serial)
 *   - Each query selects only the columns needed by the dashboard
 *   - No SELECT * — minimal payload
 */

import { query } from '~/server/utils/db'

export default defineEventHandler(async () => {
  // ── Parallel queries — all run simultaneously ────────────────────────
  // Each query selects ONLY the columns the dashboard needs, reducing
  // both DB I/O and JSON payload size.
  const [
    studentsRows,
    classesRows,
    subjectsRows,
    attendanceRows,
    feesRows,
    examsRows,
    healthRows
  ] = await Promise.all([
    // Students: only need id, first_name, last_name, status, class, roll_number
    // LIMIT 5 — only the 5 most recent are shown on the dashboard
    query(`
      SELECT id, first_name, last_name, status, class, roll_number
      FROM students
      ORDER BY id DESC
      LIMIT 5
    `),

    // Classes: aggregate count + active count in a single query
    query(`
      SELECT
        COUNT(*) as total,
        SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active
      FROM classes
    `),

    // Subjects: aggregate count + active count in a single query
    query(`
      SELECT
        COUNT(*) as total,
        SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active
      FROM subjects
    `),

    // Attendance: only today's records, only need status column
    query(`
      SELECT status
      FROM attendance
      WHERE DATE(attendance_date) = CURDATE()
    `),

    // Fees: only need amount, paid_amount, status for stats
    query(`
      SELECT amount, paid_amount, status
      FROM fees
    `),

    // Exams: only need exam_date for "upcoming" count
    query(`
      SELECT exam_date
      FROM exams
      WHERE exam_date IS NOT NULL
    `),

    // Health check: SELECT 1
    query(`SELECT 1 AS health_check`)
  ])

  // ── Process results ──────────────────────────────────────────────────
  const today = new Date().toISOString().split('T')[0]

  // Present today = count of attendance records with status 'present' for today
  const presentToday = attendanceRows[0].filter(
    (a: any) => a.status === 'present'
  ).length

  // Upcoming exams = exams with date >= today
  const upcomingExams = examsRows[0].filter(
    (e: any) => e.exam_date && new Date(e.exam_date).toISOString().split('T')[0] >= today
  ).length

  // Fee stats: aggregate in JS (avoids extra SQL round-trips)
  const feeStats = feesRows[0].reduce(
    (acc: { collected: number; pending: number }, fee: any) => {
      acc.collected += Number(fee.paid_amount) || 0
      acc.pending += (Number(fee.amount) || 0) - (Number(fee.paid_amount) || 0)
      return acc
    },
    { collected: 0, pending: 0 }
  )

  // Pending fees count
  const pendingFees = feesRows[0].filter(
    (f: any) => f.status !== 'paid'
  ).length

  return {
    ok: true,
    stats: {
      students: studentsRows[0].length,
      studentsActive: studentsRows[0].filter((s: any) => s.status === 'active').length,
      classes: classesRows[0][0]?.total || 0,
      classesActive: classesRows[0][0]?.active || 0,
      subjects: subjectsRows[0][0]?.total || 0,
      subjectsActive: subjectsRows[0][0]?.active || 0,
      presentToday,
      pendingFees,
      upcomingExams
    },
    recentStudents: studentsRows[0],
    feeStats,
    dbHealthy: healthRows[0].length > 0
  }
})
