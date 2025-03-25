"use client";

import { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import { useRouter } from "next/navigation";

export default function Home() {
  const { user, isLoggedIn, login } = useUser();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      router.push("/dashboard");
    }
  }, [isLoggedIn, router]);

  const handleLogin = async () => {
    if (!username || !password) {
      setMessage("Please enter both username and password");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const res = await fetch("http://localhost:5002/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (data.success) {
        login({
          username,
          loginTime: new Date().toISOString(),
        });
        router.push("/homepage");
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage("Error connecting to the server. Please try again.");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  if (isLoggedIn) {
    return null; // Prevent flash of login form before redirect
  }

  return (
    <div className="flex flex-col gap-3 items-center justify-center mx-auto max-w-xl min-h-screen">
      <h1 className="font-bold text-2xl p-2">Hello</h1>
      <h2 className="text-xl">Please fill in this form</h2>
      <div className="flex flex-col gap-2 w-full max-w-xs">
        <input
          className="p-2 border rounded"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
        />
        <input
          className="p-2 border rounded"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
        />
      </div>
      <button
        onClick={handleLogin}
        disabled={isLoading}
        className={`p-3 px-3.5 m-5 text-white rounded-xl transition-colors ${
          isLoading
            ? "bg-blue-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-800"
        }`}
      >
        {isLoading ? "Signing in..." : "Sign in"}
      </button>
      {message && (
        <p className="text-red-500 text-center max-w-xs">{message}</p>
      )}
    </div>
  );
}
