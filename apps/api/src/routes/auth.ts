import { Router } from "express";
import jwt from "jsonwebtoken";
import { pool } from "../db";
import { requireTeacher } from "../middleware/auth";

const router = Router();

/** Demo teacher – replace with real DB lookup & password hash */
const DEMO_TEACHER = {
  id: 1,
  email: "teacher@example.com",
  password: "secret123", // ← in production hash this!
  role: "teacher" as const,
};

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (email !== DEMO_TEACHER.email || password !== DEMO_TEACHER.password) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: DEMO_TEACHER.id, role: DEMO_TEACHER.role },
    process.env.JWT_SECRET!,
    { expiresIn: "8h" }
  );

  res.json({
    accessToken: token,
    user: { id: DEMO_TEACHER.id, email, role: DEMO_TEACHER.role },
  });
});

router.get("/me", requireTeacher, async (req, res) => {
  const user = (req as any).user;
  res.json({ id: user.id, email: "teacher@example.com", role: user.role });
});

export default router;
