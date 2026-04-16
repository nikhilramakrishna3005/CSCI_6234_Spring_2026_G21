"use client";

import type { AvailabilityStatus, User } from "@/lib/types";
import { UserAvatar } from "@/components/user-avatar";
import { StatusBadge } from "@/components/status-badge";

type NearbyUsersProps = {
  users: User[];
  resolvePresence?: (user: User) => AvailabilityStatus;
  /** Richer layout for dashboard demo */
  variant?: "default" | "showcase";
};

export function NearbyUsers({ users, resolvePresence, variant = "default" }: NearbyUsersProps) {
  const showcase = variant === "showcase";

  if (!users.length) {
    return (
      <div
        className={`flex flex-col items-center justify-center rounded-3xl border border-dashed text-center ${
          showcase
            ? "border-rose-200/80 bg-gradient-to-b from-rose-50/40 to-white px-6 py-14"
            : "border-slate-200 bg-slate-50/50 px-4 py-10"
        }`}
      >
        <div
          className={`mb-3 flex h-14 w-14 items-center justify-center rounded-2xl ${
            showcase
              ? "bg-gradient-to-br from-rose-100 to-red-100 text-rose-800"
              : "bg-slate-100 text-slate-400"
          }`}
        >
          <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <p className={`max-w-xs text-sm font-medium ${showcase ? "text-slate-700" : "text-slate-600"}`}>
          No one nearby is online right now.
        </p>
        <p className="mt-1 max-w-xs text-xs text-slate-500">
          Turn your presence on or wait — the demo simulates people coming online nearby.
        </p>
      </div>
    );
  }

  return (
    <div className={showcase ? "grid gap-4 sm:grid-cols-2" : "grid gap-3 sm:grid-cols-2"}>
      {users.map((user, index) => {
        const presence = resolvePresence ? resolvePresence(user) : user.availability;
        const isOnline = presence === "ONLINE";

        return (
          <article
            key={user.id}
            style={{ animationDelay: showcase ? `${index * 70}ms` : undefined }}
            className={`group relative overflow-hidden transition duration-300 ease-out will-change-transform ${
              showcase
                ? "animate-micromeet-fade-up rounded-3xl border border-white/70 bg-gradient-to-br from-white via-rose-50/30 to-red-50/40 p-5 shadow-[0_12px_40px_-12px_rgba(159,18,57,0.22)] ring-1 ring-rose-100/80 hover:-translate-y-1 hover:shadow-[0_20px_50px_-15px_rgba(159,18,57,0.3)]"
                : "rounded-2xl border border-slate-200/90 bg-white/95 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
            }`}
          >
            <div
              className={`pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full blur-2xl transition duration-500 ${
                isOnline
                  ? "bg-emerald-200/35 group-hover:bg-emerald-300/45"
                  : "bg-rose-100/55 group-hover:bg-red-100/60"
              }`}
            />
            {showcase ? (
              <div className="relative mb-4 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700 ring-1 ring-emerald-500/20">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  </span>
                  Live nearby
                </span>
                <span className="text-[11px] font-medium text-slate-400">@{user.username}</span>
              </div>
            ) : null}

            <div className={`relative flex items-start gap-3 ${showcase ? "mb-4" : "mb-3"}`}>
              <div
                className={`relative shrink-0 rounded-2xl p-0.5 transition duration-300 ${
                  isOnline
                    ? "bg-gradient-to-br from-emerald-400 to-teal-500 shadow-[0_8px_20px_rgba(16,185,129,0.35)]"
                    : "bg-slate-200/90"
                }`}
              >
                <div className="overflow-hidden rounded-[0.85rem] bg-white">
                  <UserAvatar user={user} />
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <p className={`truncate font-semibold text-slate-900 ${showcase ? "text-base" : "text-sm"}`}>
                  {user.name}
                </p>
                <p className="truncate text-xs text-slate-500">{user.email}</p>
              </div>
            </div>

            <div className={`relative flex flex-wrap items-center justify-between gap-2 ${showcase ? "mb-4" : "mb-3"}`}>
              <StatusBadge label={presence} size={showcase ? "prominent" : "default"} />
              {!showcase ? <span className="text-xs text-slate-500">@{user.username}</span> : null}
            </div>

            <div className="relative flex flex-wrap gap-2">
              {user.preferences.map((pref) => (
                <span
                  key={pref.id}
                  className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${
                    showcase
                      ? "border-rose-100 bg-white/80 text-rose-950/80 shadow-sm"
                      : "border-slate-200 bg-slate-50 text-slate-600"
                  }`}
                >
                  {pref.key}: {pref.value}
                </span>
              ))}
            </div>
          </article>
        );
      })}
    </div>
  );
}
