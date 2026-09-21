import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

export default function Home() {
  const { user, login, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/class");
    }
  }, [user, router]);

  return (
    <div className="min-h-screen flex flex-col items-center p-6">
      <h1 className="text-4xl font-bold mb-6">🏫 School ERP Demo</h1>

      {user ? (
        <>
          <p className="mb-4">Welcome, {user.email}!</p>
          <button
            onClick={logout}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </>
      ) : (
        <button
          onClick={() => router.push("/login")}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Login
        </button>
      )}
    </div>
  );
}
