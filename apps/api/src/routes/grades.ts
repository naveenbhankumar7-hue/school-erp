import { Router } from "express";
import { requireTeacher } from "../middleware/auth";
import { pool } from "../db";

const router = Router();

router.post("/", requireTeacher, async (req, res) => {
  const { classId, studentId, assignmentName, score, maxScore } = req.body;
  if (!classId || !studentId || !assignmentName || !score || !maxScore) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const percentage = (score / maxScore) * 100;

  const result = await pool.query(
    `INSERT INTO grades (class_id, student_id, assignment_name, score, max_score, percentage)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [classId, studentId, assignmentName, score, maxScore, percentage]
  );

  res.status(201).json(result.rows[0]);
});

router.get("/:studentId", requireTeacher, async (req, res) => {
  const { studentId } = req.params;
  const { classId } = req.query;

  let query = `SELECT * FROM grades WHERE student_id = $1`;
  const params = [studentId];

  if (classId) {
    query += " AND class_id = $2";
    params.push(classId);
  }

  const result = await pool.query(query, params);
  res.json(result.rows);
});

export default router;
