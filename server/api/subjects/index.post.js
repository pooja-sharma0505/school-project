import getPool from "~/server/utils/db";
import { readBody } from "h3";

export default defineEventHandler(async (event) => {

  try {

    const body = await readBody(event);

    const pool = getPool();

    const [result] = await pool.query(

      `
      INSERT INTO subjects
      (
        class_id,
        subject_name,
        subject_code,
        teacher_name,
        status
      )
      VALUES
      (?, ?, ?, ?, ?)
      `,

      [
        body.class_id,
        body.subject_name,
        body.subject_code,
        body.teacher_name,
        body.status
      ]

    );

    return {

      success: true,

      id: result.insertId,

      message: "Subject added successfully."

    };

  } catch (error) {

    return {

      success: false,

      message: error.message

    };

  }

});