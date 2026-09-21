import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./routes/auth";
import classesRouter from "./routes/classes";
import attendanceRouter from "./routes/attendance";
import gradesRouter from "./routes/grades";
import messagesRouter from "./routes/messages";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/classes", classesRouter);
app.use("/api/attendance", attendanceRouter);
app.use("/api/grades", gradesRouter);
app.use("/api/messages", messagesRouter);

app.get("/health", (_req, res) => res.json({ status: "ok" }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 API listening on http://localhost:${PORT}`);
});
