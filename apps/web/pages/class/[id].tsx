"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AttendanceForm from "@/components/AttendanceForm";
import { useAuth } from "@/components/AuthProvider";

export default function ClassPage() {
  const router = useRouter();
  const { params } = router;
  const classId = Number(params.id);
  const { user } = useAuth();

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Class #{classId}</h2>

      {user ? (
        <>
          <p className="mb-2">Welcome, {user.email}!</p>

          <button
            onClick={() => {
              // In a real app you’d open a modal or navigate to a dedicated page.
              // Here we just render the form directly below.
            }}
            className="bg-indigo-600 text-white py-2 px-4 rounded mb-4"
          >
            Mark Attendance
          </button>

          <AttendanceForm classId={classId} />
        </>
      ) : (
        <p>
          Please <a href="/login" className="text-blue-600">log in</a> to continue.
        </p>
      )}
    </div>
  );
}
