"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

type Student = { id: number; name: string };

export default function AttendanceForm({ classId }: { classId: number }) {
  const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user } = useAuth();

  // Load a fake list of students (in a real app you’d hit /api/classes/:id/students)
  useEffect(() => {
    const fake: Student[] = [];
    for (let i = 1; i <= 30; i++) {
      fake.push({ id: i, name: `Student ${i}` });
    }
    setStudents(fake);
    setLoading(false);
  }, [classId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      classId,
      date,
      students: students.map(s => s.id) // send only IDs
    };
    const res = await fetch("/api/attendance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    alert(data.message);
  };

  if (loading) return <p>Loading…</p>;

  return (
    <form onSubmit={handleSubmit} className="max-w-lg space-y-4 p-6 border border-gray-300 rounded">
      <h3 className="text-lg font-semibold">Mark Attendance</h3>

      <div className="flex items-center mb-2">
        <label className="mr-2">Date:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="flex-1 rounded border p-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Students (select all)</label>
        <select
          multiple
          size={6}
          className="w-full border rounded p-2"
          onChange={(e) => {
            const selected = Array.from(e.target.selectedOptions).map(
              opt => Number(opt.value)
            );
            // For demo we just keep the whole list; you could filter here.
          }}
        >
          {students.map(s => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="w-full bg-green-600 text-white py-2 px-4 rounded"
      >
        Save Attendance
      </button>
    </form>
  );
}
