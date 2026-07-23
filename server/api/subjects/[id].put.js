import getPool from "~/server/utils/db";
import { readBody } from "h3";

export default defineEventHandler(async (event) => {

  try {

    const id = event.context.params.id;

    const body = await readBody(event);

    const pool = getPool();

    await pool.query(

      `
      UPDATE subjects
      SET
        class_id = ?,
        subject_name = ?,
        subject_code = ?,
        teacher_name = ?,
        status = ?
      WHERE id = ?
      `,

      [
        body.class_id,
        body.subject_name,
        body.subject_code,
        body.teacher_name,
        body.status,
        id
      ]

    );

    return {

      success: true,

      message: "Subject updated successfully."

    };

  } catch (error) {

    return {

      success: false,

      message: error.message

    };

  }

});