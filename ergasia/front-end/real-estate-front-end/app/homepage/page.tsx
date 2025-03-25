"use client";

import { useUser } from "../../context/UserContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Dashboard() {
  const { user, logout } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/"); // Redirects to login if not logged in
    }
  }, [user, router]);

  if (!user) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold">Welcome, {user.username}!</h1>
      <button
        onClick={() => {
          logout();
          router.push("/");
        }}
        className="mt-4 p-2 bg-red-500 text-white rounded"
      >
        Logout
      </button>
      <h1 className="p-4">Checkout our available listings</h1>
    </div>
  );
}
