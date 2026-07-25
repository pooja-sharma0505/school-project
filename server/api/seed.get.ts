import { query } from "~/server/utils/db";

/**
 * Seed the database with sample data for development/demo purposes.
 *
 * Populates all tables with realistic sample records:
 *   - 3 classes (Grade 10-A, Grade 10-B, Grade 9-A)
 *   - 10 students across those classes
 *   - 7 subjects assigned to classes
 *   - Today's attendance for all students
 *   - Fee records for all students (some paid, some unpaid)
 *   - 3 upcoming exams
 *   - Results for every student/exam combination
 *
 * Usage:  GET /api/seed
 */
export default defineEventHandler(async () => {
  try {
    // ── Clear existing data (in dependency order) ──────────────────
    await query("DELETE FROM results");
    await query("DELETE FROM attendance");
    await query("DELETE FROM fees");
    await query("DELETE FROM exams");
    await query("DELETE FROM subjects");
    await query("DELETE FROM students");
    await query("DELETE FROM classes");

    // ── Classes ───────────────────────────────────────────────────
    await query(
      `INSERT INTO classes (class_name, section, class_teacher, room_number, capacity, status)
       VALUES ?`,
      [[
        ["10", "A", "Mrs. Sharma", "101", 40, "active"],
        ["10", "B", "Mr. Verma", "102", 35, "active"],
        ["9",  "A", "Ms. Patel",  "201", 38, "active"],
      ]]
    );

    const [classes] = await query(
      "SELECT id, class_name, section FROM classes ORDER BY id"
    );

    // ── Students ──────────────────────────────────────────────────
    const students = [
      ["Arjun",  "Sharma",  "arjun@school.edu",  "9876543210", "male",   "2008-05-15", "10", "A", "101", "active"],
      ["Priya",  "Verma",   "priya@school.edu",  "9876543211", "female", "2008-03-22", "10", "A", "102", "active"],
      ["Rohan",  "Patel",   "rohan@school.edu",  "9876543212", "male",   "2008-07-10", "10", "B", "201", "active"],
      ["Ananya", "Singh",   "ananya@school.edu", "9876543213", "female", "2009-01-05", "10", "B", "202", "active"],
      ["Kunal",  "Mehta",   "kunal@school.edu",  "9876543214", "male",   "2009-02-18", "9",  "A", "301", "active"],
      ["Sneha",  "Reddy",   "sneha@school.edu",  "9876543215", "female", "2009-04-30", "9",  "A", "302", "active"],
      ["Vikram", "Kumar",   "vikram@school.edu", "9876543216", "male",   "2008-11-12", "10", "A", "103", "active"],
      ["Neha",   "Joshi",   "neha@school.edu",   "9876543217", "female", "2008-09-25", "10", "B", "203", "active"],
      ["Amit",   "Desai",   "amit@school.edu",   "9876543218", "male",   "2009-06-08", "9",  "A", "303", "inactive"],
      ["Pooja",  "Kapoor",  "pooja@school.edu",  "9876543219", "female", "2008-12-03", "10", "A", "104", "active"],
    ];

    await query(
      `INSERT INTO students
         (first_name, last_name, email, phone, gender, date_of_birth, class, section, roll_number, status)
       VALUES ?`,
      [students]
    );

    const [studentRows] = await query(
      "SELECT id, class, section FROM students ORDER BY id"
    );

    // ── Subjects ──────────────────────────────────────────────────
    const subjects = [
      [classes[0].id, "Mathematics", "MATH10A", "Mrs. Sharma", "active"],
      [classes[0].id, "Science",     "SCI10A",  "Mr. Kumar",   "active"],
      [classes[0].id, "English",     "ENG10A",  "Ms. Roy",     "active"],
      [classes[1].id, "Mathematics", "MATH10B", "Mr. Verma",   "active"],
      [classes[1].id, "Science",     "SCI10B",  "Dr. Sen",     "active"],
      [classes[2].id, "Mathematics", "MATH9A",  "Ms. Patel",   "active"],
      [classes[2].id, "English",     "ENG9A",   "Mr. Khan",    "active"],
    ];

    await query(
      `INSERT INTO subjects (class_id, subject_name, subject_code, teacher_name, status)
       VALUES ?`,
      [subjects]
    );

    // ── Attendance (for today) ────────────────────────────────────
    const today = new Date().toISOString().split("T")[0];
    const attendance = studentRows.map((s: any) => [
      s.id,
      today,
      Math.random() > 0.1 ? "present" : "absent",
      null,
    ]);

    await query(
      `INSERT INTO attendance (student_id, date, status, note)
       VALUES ?`,
      [attendance]
    );

    // ── Fees ──────────────────────────────────────────────────────
    const fees = studentRows.map((s: any) => {
      const paid = Math.random() > 0.3;
      return [
        s.id,
        "Tuition Fee - Q3",
        1500,
        paid ? 1500 : 0,
        "2026-07-15",
        paid ? today : null,
        paid ? "cash" : null,
        "Quarterly tuition fee",
      ];
    });

    await query(
      `INSERT INTO fees
         (student_id, title, amount, paid_amount, due_date, paid_date, payment_method, note)
       VALUES ?`,
      [fees]
    );

    // ── Exams ─────────────────────────────────────────────────────
    const exams = [
      ["Midterm Examination", "First Term", "10", "Mathematics", "2026-07-20", 100, 33, "Midterm for Grade 10"],
      ["Midterm Examination", "First Term", "10", "Science",     "2026-07-22", 100, 33, "Midterm for Grade 10"],
      ["Quarterly Exam",      "First Term", "9",  "Mathematics", "2026-07-28", 100, 33, "Quarterly for Grade 9"],
    ];

    await query(
      `INSERT INTO exams (name, term, class, subject, exam_date, max_marks, pass_marks, note)
       VALUES ?`,
      [exams]
    );

    const [examRows] = await query("SELECT id FROM exams ORDER BY id");

    // ── Results ───────────────────────────────────────────────────
    const results: any[] = [];
    for (const student of studentRows) {
      for (const exam of examRows) {
        const marks = Math.floor(Math.random() * 100) + 1;
        const status = marks >= 33 ? "pass" : "fail";
        const grade =
          marks >= 90 ? "A+" :
          marks >= 80 ? "A"  :
          marks >= 70 ? "B+" :
          marks >= 60 ? "B"  :
          marks >= 50 ? "C"  :
          marks >= 40 ? "D"  :
          marks >= 33 ? "E"  : "F";
        results.push([exam.id, student.id, marks, grade, status, ""]);
      }
    }

    await query(
      `INSERT INTO results (exam_id, student_id, marks_obtained, grade, status, remark)
       VALUES ?`,
      [results]
    );

    return {
      success: true,
      message: "Database seeded successfully",
      counts: {
        classes: classes.length,
        students: studentRows.length,
        subjects: subjects.length,
        attendance: attendance.length,
        fees: fees.length,
        exams: exams.length,
        results: results.length,
      },
    };
  } catch (error: any) {
    console.error("Seed error:", error);
    return {
      success: false,
      error: error.message || "Failed to seed database",
    };
  }
});
