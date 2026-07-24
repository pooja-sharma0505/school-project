import { getQuery } from "h3";
import { query } from "~/server/utils/db";
import { withErrorHandler } from "~/server/utils/api";

export default defineEventHandler(
  withErrorHandler(async (event) => {
    const examId = getQuery(event).exam_id;

    let sql = `
      SELECT
        r.id,
        r.exam_id,
        r.student_id,
        r.marks_obtained,
        r.grade,
        r.status,

        s.first_name,
        s.last_name,
        s.roll_number,
        s.class,

        e.name AS exam_name,
        e.subject,
        e.term,
        e.max_marks
      FROM results r
      JOIN students s
        ON r.student_id = s.id
      JOIN exams e
        ON r.exam_id = e.id
    `;

    const params = [];

    if (examId) {
      sql += " WHERE r.exam_id = ?";
      params.push(examId);
    }

    sql += " ORDER BY r.id DESC";

    const [rows] = await query(sql, params);

    return rows;
  })
);
