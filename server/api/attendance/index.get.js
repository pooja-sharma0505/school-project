import { getQuery } from "h3";
import { query } from "~/server/utils/db";
import { withErrorHandler } from "~/server/utils/api";

export default defineEventHandler(
  withErrorHandler(async (event) => {
    const date = getQuery(event).date;

    let sql = `
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
      sql += " WHERE DATE(attendance.attendance_date) = ?";
      params.push(date);
    }

    sql += " ORDER BY attendance.attendance_date DESC";

    const [rows] = await query(sql, params);

    return rows;
  })
);
