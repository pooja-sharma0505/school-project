import getPool from "~/server/utils/db";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    const {
      first_name,
      last_name,
      email,
      phone,
      gender,
      date_of_birth,
      class: studentClass,
      section,
      roll_number,
      address,
      guardian_name,
      guardian_phone,
      status
    } = body;

    const pool = getPool();

    const [result] = await pool.query(
      `INSERT INTO students (
        first_name,
        last_name,
        email,
        phone,
        gender,
        date_of_birth,
        class,
        section,
        roll_number,
        address,
        guardian_name,
        guardian_phone,
        status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        first_name,
        last_name,
        email,
        phone,
        gender,
        date_of_birth,
        studentClass,
        section,
        roll_number,
        address,
        guardian_name,
        guardian_phone,
        status
      ]
    );

    return {
      success: true,
      message: "Student added successfully",
      id: result.insertId
    };

  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: error.message
    };
  }
});