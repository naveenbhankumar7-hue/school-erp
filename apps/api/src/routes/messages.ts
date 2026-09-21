import { Router } from "express";
import { requireTeacher } from "../middleware/auth";
import { pool } from "../db";

const router = Router();

router.post("/", requireTeacher, async (req, res) => {
  const { classId, content } = req.body;
  if (!classId || !content) {
    return res.status(400).json({ message: "classId and content required" });
  }

  await pool.query(
    `INSERT INTO messages (class_id, sender_id, content, created_at)
     VALUES ($1, $2, $3, NOW())`,
    [classId, (req as any).user.id, content]
  );

  res.json({ message: "Message sent" });
});

router.get("/", requireTeacher, async (req, res) => {
  const { classId } = req.query;
  if (!classId) return res.status(400).json({ message: "classId required" });

  const result = await pool.query(
    `SELECT m.*, u.email as sender_email
       FROM messages m
       JOIN users u ON u.id = m.sender_id
      WHERE m.class_id = $1
      ORDER BY m.created_at DESC
      LIMIT 20`,
    [classId]
  );
  res.json(result.rows);
});

export default router;
