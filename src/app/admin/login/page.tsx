"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(
    event: React.FormEvent
  ) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "/api/admin/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.error || "Invalid login details."
        );
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError(
        "Unable to connect to the server."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8fafc] px-6 text-[#17212b]">
      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-[#0369a1]">
            Store Administration
          </p>

          <h1 className="mt-4 font-serif text-4xl font-bold tracking-[0.08em]">
            INDUSTRIAL AUTOMATION
          </h1>

          <p className="mt-3 text-sm text-[#475569]">
            Administrator Login
          </p>
        </div>

        <form
          onSubmit={handleLogin}
          className="border border-[#e2e8f0] bg-[#ffffff] p-8"
        >
          <label className="block">
            <span className="mb-2 block text-xs uppercase tracking-[0.15em] text-[#a79d8e]">
              Email
            </span>

            <input
  id="admin-email"
  name="email"
  type="email"
  required
  autoComplete="username"
  value={email}
  onChange={(event) => {
    setEmail(event.target.value);
  }}
  className="w-full border border-[#4a4031] bg-[#f8fafc] px-4 py-3 text-[#17212b] outline-none focus:border-[#0284c7]"
  placeholder="admin@example.com"
/>
          </label>

          <label className="mt-6 block">
            <span className="mb-2 block text-xs uppercase tracking-[0.15em] text-[#a79d8e]">
              Password
            </span>

            <input
  id="admin-password"
  name="password"
  type="password"
  required
  autoComplete="current-password"
  value={password}
  onChange={(event) => {
    setPassword(event.target.value);
  }}
  className="w-full border border-[#4a4031] bg-[#f8fafc] px-4 py-3 text-[#17212b] outline-none focus:border-[#0284c7]"
  placeholder="Enter your password"
/>
          </label>

          {error && (
            <div className="mt-5 border border-[#5b352d] bg-[#211411] px-4 py-3 text-sm text-[#d79b8d]">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-7 w-full bg-[#0284c7] px-6 py-4 text-sm font-bold uppercase tracking-[0.2em] text-[#17130d] transition hover:bg-[#dfc17d] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Signing In..."
              : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-[#555047]">
          Authorized personnel only
        </p>
      </div>
    </main>
  );
}