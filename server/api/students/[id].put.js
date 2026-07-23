import getPool from "~/server/utils/db";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");
    const body = await readBody(event);

    const pool = getPool();

    const [result] = await pool.query(
      `UPDATE students SET
        first_name=?,
        last_name=?,
        email=?,
        phone=?,
        gender=?,
        date_of_birth=?,
        class=?,
        section=?,
        roll_number=?,
        address=?,
        guardian_name=?,
        guardian_phone=?,
        status=?
      WHERE id=?`,
      [
        body.first_name,
        body.last_name,
        body.email,
        body.phone,
        body.gender,
        body.date_of_birth,
        body.class,
        body.section,
        body.roll_number,
        body.address,
        body.guardian_name,
        body.guardian_phone,
        body.status,
        id
      ]
    );

    return {
      success: true,
      message: "Student updated successfully",
      affectedRows: result.affectedRows
    };

  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
});