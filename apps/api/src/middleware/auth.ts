import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { pool } from "../db";

interface JwtPayload {
  id: number;
  role: "teacher" | "admin";
}

/** Verify JWT and attach user info to request */
export function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing Authorization header" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    (req as any).user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

/** Helper – ensure the logged‑in user is a teacher (or admin) */
export function requireTeacher(req: Request, res: Response, next: NextFunction) {
  const user = (req as any).user;
  if (!user || (user.role !== "teacher" && user.role !== "admin")) {
    return res.status(403).json({ message: "Forbidden – teacher only" });
  }
  next();
}
