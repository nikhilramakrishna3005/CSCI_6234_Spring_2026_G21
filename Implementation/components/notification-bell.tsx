"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useAppState } from "@/lib/app-state";
import { StatusBadge } from "@/components/status-badge";

export function NotificationBell() {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useAppState();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const unreadCount = notifications.filter((notification) => !notification.read).length;

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className={`relative flex h-12 w-12 items-center justify-center rounded-2xl border bg-gradient-to-b from-white to-slate-50/90 text-slate-700 shadow-[0_4px_14px_rgba(15,23,42,0.08)] transition duration-200 ease-out hover:scale-[1.03] hover:border-rose-200/90 hover:shadow-[0_8px_24px_rgba(159,18,57,0.18)] active:scale-[0.98] ${
          open
            ? "border-rose-300 ring-2 ring-rose-200/70"
            : "border-slate-200/90"
        }`}
        aria-expanded={open}
        aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`}
      >
        <svg
          className={`h-[1.35rem] w-[1.35rem] transition ${unreadCount ? "text-rose-800" : "text-slate-600"}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </svg>
        {unreadCount > 0 ? (
          <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-orange-500 px-1 text-[10px] font-bold tabular-nums text-white shadow-[0_2px_8px_rgba(244,63,94,0.5)] ring-2 ring-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        ) : null}
      </button>

      {open ? (
        <div className="animate-micromeet-dropdown absolute right-0 z-[60] mt-2 w-[min(92vw,400px)] origin-top-right overflow-hidden rounded-2xl border border-slate-200/70 bg-white/95 shadow-[0_24px_64px_rgba(15,23,42,0.2)] backdrop-blur-xl">
          <div className="flex items-center justify-between gap-2 border-b border-slate-100/90 bg-gradient-to-r from-rose-50 via-white to-red-50/40 px-4 py-3.5">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900">Activity</p>
              <p className="text-xs text-slate-500">
                {unreadCount > 0 ? (
                  <span className="font-medium text-rose-800">{unreadCount} unread</span>
                ) : (
                  "All caught up"
                )}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              {unreadCount > 0 ? (
                <button
                  type="button"
                  onClick={() => markAllNotificationsRead()}
                  className="rounded-xl border border-slate-200/90 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-600 shadow-sm transition hover:border-rose-200 hover:text-rose-800"
                >
                  Mark all read
                </button>
              ) : null}
              <Link
                href="/notifications"
                className="rounded-xl bg-gradient-to-r from-red-950 to-rose-800 px-3 py-1.5 text-[11px] font-semibold text-white shadow-md transition hover:from-red-900 hover:to-rose-700"
                onClick={() => setOpen(false)}
              >
                Open
              </Link>
            </div>
          </div>
          <div className="max-h-[min(58vh,440px)] overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="px-4 py-10 text-center text-sm text-slate-500">
                You&apos;re all caught up — new invites and updates land here live.
              </p>
            ) : (
              notifications.map((notification) => (
                <button
                  key={notification.id}
                  type="button"
                  onClick={() => markNotificationRead(notification.id)}
                  className={`flex w-full flex-col gap-2 border-b border-slate-100/90 px-4 py-3.5 text-left transition duration-150 hover:bg-slate-50/90 ${
                    notification.read ? "opacity-75" : "bg-rose-50/60"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <StatusBadge label={notification.type} />
                    <span className="text-[11px] font-medium text-slate-400">
                      {notification.createdAt}
                    </span>
                  </div>
                  <p className="text-sm leading-snug text-slate-800">{notification.message}</p>
                  {!notification.read ? (
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-rose-700">
                      New
                    </span>
                  ) : null}
                </button>
              ))
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
