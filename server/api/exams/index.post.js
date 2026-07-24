import getPool from "~/server/utils/db";
import { readBody } from "h3";
import { withErrorHandler, validateBody, badRequest, requireAuth } from "~/server/utils/api";

export default defineEventHandler(
  withErrorHandler(async (event) => {
    requireAuth(event);

    const body = await readBody(event);

    const error = validateBody(body, [
      { field: "name", label: "Exam name", required: true, type: "string", max: 100 },
      { field: "term", label: "Term", type: "string", max: 50 },
      { field: "subject", label: "Subject", type: "string", max: 100 },
      { field: "class", label: "Class", type: "string", max: 50 },
      { field: "exam_date", label: "Exam date", type: "date" },
      { field: "max_marks", label: "Max marks", type: "number", min: 0, max: 1000 },
      { field: "pass_marks", label: "Pass marks", type: "number", min: 0, max: 1000 },
      { field: "note", label: "Note", type: "string", max: 500 },
    ]);

    if (error) badRequest(error);

    // Cross-field validation: pass_marks must not exceed max_marks
    const maxMarks = Number(body.max_marks) || 100;
    const passMarks = Number(body.pass_marks) || 33;

    if (passMarks > maxMarks) {
      badRequest("Pass marks cannot exceed max marks.");
    }

    const pool = getPool();

    const [result] = await pool.query(
      `INSERT INTO exams (
        name,
        term,
        subject,
        class,
        exam_date,
        max_marks,
        pass_marks,
        note
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        body.name,
        body.term || null,
        body.subject || null,
        body.class || null,
        body.exam_date || null,
        maxMarks,
        passMarks,
        body.note || null,
      ]
    );

    return {
      success: true,
      message: "Exam added successfully",
      id: result.insertId,
    };
  })
);
