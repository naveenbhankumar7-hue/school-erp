import { Router } from "express";
import { requireTeacher } from "../middleware/auth";
import { pool } from "../db";

const router = Router();

router.post("/", requireTeacher, async (req, res) => {
  const { classId, date, students } = req.body;
  if (!classId || !date || !Array.isArray(students) || students.length === 0) {
    return res.status(400).json({ message: "Invalid payload" });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    for (const studentId of students) {
      await client.query(
        `INSERT INTO attendance (class_id, student_id, attendance_date, status)
         VALUES ($1, $2, $3, $4)`,
        [classId, studentId, date, "present"]
      );
    }
    await client.query('COMMIT');
    res.json({ message: "Attendance recorded" });
  } catch (e) {
    await client.query('ROLLBACK');
    console.error(e);
    res.status(500).json({ message: "Database error" });
  } finally {
    client.release();
  }
});

router.get("/", requireTeacher, async (req, res) => {
  const { classId, date } = req.query;
  if (!classId || !date) {
    return res.status(400).json({ message: "classId and date required" });
  }

  const result = await pool.query(
    `SELECT * FROM attendance WHERE class_id = $1 AND attendance_date = $2`,
    [classId, date]
  );
  res.json(result.rows);
});

export default router;
