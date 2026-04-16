"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppState } from "@/lib/app-state";

export default function LoginPage() {
  const router = useRouter();
  const { currentUser, login } = useAppState();

  const [username, setUsername] = useState("host1");
  const [password, setPassword] = useState("pass123");
  const [error, setError] = useState("");

  useEffect(() => {
    if (currentUser) {
      router.replace("/dashboard");
    }
  }, [currentUser, router]);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const ok = login(username, password);
    if (!ok) {
      setError("Invalid credentials. Use one of the demo accounts below.");
      return;
    }
    setError("");
    router.push("/dashboard");
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(190,18,60,0.22),transparent_58%)]" />
      <div className="pointer-events-none absolute -left-20 bottom-10 h-72 w-72 rounded-full bg-rose-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 top-16 h-72 w-72 rounded-full bg-red-500/15 blur-3xl" />

      <form
        onSubmit={onSubmit}
        className="relative w-full max-w-md rounded-4xl border border-white/20 bg-slate-900/85 p-8 shadow-[0_28px_80px_rgba(15,23,42,0.7)] backdrop-blur-xl md:p-10"
      >
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-red-900 to-rose-600 text-xl font-bold text-white">
            MM
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">MicroMeet</h1>
          <p className="mt-2 text-sm text-slate-300">
            Real-time social discovery and micro meetup coordination.
          </p>
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-medium text-slate-200">
            Username
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white outline-none transition focus:border-rose-300 focus:ring-4 focus:ring-rose-500/20"
            />
          </label>
          <label className="block text-sm font-medium text-slate-200">
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white outline-none transition focus:border-rose-300 focus:ring-4 focus:ring-rose-500/20"
            />
          </label>
          <button
            type="submit"
            className="inline-flex w-full items-center justify-center rounded-2xl bg-rose-700 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-900/30 transition hover:-translate-y-0.5 hover:bg-rose-600"
          >
            Log in
          </button>
        </div>

        {error ? (
          <p className="mt-4 rounded-xl border border-rose-400/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
            {error}
          </p>
        ) : null}

        <div className="mt-5 rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-xs text-rose-200">
          <p className="font-semibold uppercase tracking-wide text-rose-100">Demo credentials</p>
          <p className="mt-1">host1 / pass123</p>
          <p>user1 / pass123</p>
          <p>user2 / pass123</p>
        </div>
      </form>
    </main>
  );
}
