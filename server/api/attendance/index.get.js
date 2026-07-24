import { getQuery } from "h3";
import getPool from "~/server/utils/db";
import { withErrorHandler } from "~/server/utils/api";

export default defineEventHandler(
  withErrorHandler(async (event) => {
    const pool = getPool();

    const date = getQuery(event).date;

    let query = `
      SELECT
        attendance.id,
        attendance.student_id,
        attendance.attendance_date,
        attendance.status,
        students.first_name,
        students.last_name,
        students.roll_number,
        students.class
      FROM attendance
      JOIN students
      ON attendance.student_id = students.id
    `;

    const params = [];

    if (date) {
      query += " WHERE DATE(attendance.attendance_date) = ?";
      params.push(date);
    }

    query += " ORDER BY attendance.attendance_date DESC";

    const [rows] = await pool.query(query, params);

    return rows;
  })
);