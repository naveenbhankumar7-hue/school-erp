import { Router } from "express";
import { requireTeacher } from "../middleware/auth";
import { pool } from "../db";

const router = Router();

router.get("/", requireTeacher, async (req, res) => {
  const { id } = (req as any).user;
  const result = await pool.query(
    `SELECT * FROM classes WHERE teacher_id = $1`,
    [id]
  );
  res.json(result.rows);
});

router.post("/", requireTeacher, async (req, res) => {
  const { name, teacherId } = req.body;
  const result = await pool.query(
    `INSERT INTO classes (name, teacher_id) VALUES ($1, $2) RETURNING *`,
    [name, teacherId]
  );
  res.status(201).json(result.rows[0]);
});

export default router;
