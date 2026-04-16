"use client";

import { useAppState } from "@/lib/app-state";

export function PresenceToggle({ className = "" }: { className?: string }) {
  const { currentUser, resolveUserPresence, setCurrentUserPresence } = useAppState();

  if (!currentUser) {
    return null;
  }

  const status = resolveUserPresence(currentUser);
  const isOnline = status === "ONLINE";

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-br from-white via-slate-50/50 to-rose-50/30 p-4 shadow-[0_8px_30px_-8px_rgba(159,18,57,0.12)] ring-1 ring-white/60 transition hover:shadow-[0_12px_36px_-10px_rgba(159,18,57,0.18)] ${className}`}
    >
      <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-rose-200/30 blur-2xl" />
      <div className="relative flex items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${
                isOnline
                  ? "bg-emerald-500/15 text-emerald-600"
                  : "bg-slate-200/80 text-slate-500"
              }`}
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"
                />
              </svg>
            </span>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">Your presence</p>
              <p className="mt-0.5 text-sm font-semibold text-slate-900">
                {isOnline ? "Visible nearby" : "Hidden from discovery"}
              </p>
            </div>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-slate-600">
            {isOnline
              ? "You appear in the live nearby list for this demo."
              : "Stay private — toggles apply instantly for the class demo."}
          </p>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={isOnline}
          onClick={() => setCurrentUserPresence(isOnline ? "OFFLINE" : "ONLINE")}
          className={`relative h-11 w-[4.25rem] shrink-0 rounded-full border-2 transition-all duration-500 ease-out focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-rose-400/35 ${
            isOnline
              ? "border-emerald-400/90 bg-gradient-to-b from-emerald-400 to-emerald-600 shadow-[0_10px_28px_rgba(16,185,129,0.45)]"
              : "border-slate-300/90 bg-gradient-to-b from-slate-200 to-slate-300 shadow-inner"
          }`}
        >
          <span
            className={`absolute top-1 left-1 flex h-8 w-8 items-center justify-center rounded-full bg-white text-[11px] font-bold shadow-md transition-all duration-500 ease-out ${
              isOnline ? "translate-x-[2.15rem] text-emerald-600" : "translate-x-0 text-slate-500"
            }`}
          >
            {isOnline ? "ON" : "OFF"}
          </span>
        </button>
      </div>
    </div>
  );
}
