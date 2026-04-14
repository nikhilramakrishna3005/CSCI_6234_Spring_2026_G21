"use client";

import { useState } from "react";
import { LayoutShell } from "@/components/layout-shell";
import { SectionHeader } from "@/components/section-header";
import { StatusBadge } from "@/components/status-badge";
import { useAppState } from "@/lib/app-state";

const colors: Record<string, string> = {
  MEETUP_UPDATED: "text-violet-700",
  INVITE_SENT: "text-sky-700",
  APPROVAL_SENT: "text-emerald-700",
  JOIN_RESPONSE: "text-amber-700",
  SYSTEM_UPDATE: "text-slate-700",
};

export default function NotificationsPage() {
  const { notifications, sendUpdateNotification } = useAppState();
  const [meetupId, setMeetupId] = useState("meetup-1");
  const [message, setMessage] = useState("Host posted a fresh update.");

  return (
    <LayoutShell
      title="9. Send Update Notifications"
      subtitle="Browse all notifications and trigger update pushes."
    >
      <SectionHeader
        title="9. Send Update Notifications"
        subtitle="Browse all notifications and trigger update pushes."
      />

      <div className="mb-5 flex items-center justify-between rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        <p className="text-sm text-slate-600">
          Notification center with timestamps, tags, and statuses.
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <input
            value={meetupId}
            onChange={(event) => setMeetupId(event.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
            placeholder="meetup id"
          />
          <input
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
            placeholder="notification message"
          />
          <button
            onClick={() => sendUpdateNotification(meetupId, message)}
            className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700"
          >
            Send update
          </button>
        </div>
      </div>

      <div className="max-h-[68vh] space-y-3 overflow-y-auto pr-1">
        {notifications.map((notification) => (
          <article
            key={notification.id}
            className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="mb-3 flex items-center justify-between">
              <StatusBadge label={notification.type} />
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                {notification.createdAt}
              </p>
            </div>
            <p className={`text-sm font-medium ${colors[notification.type] ?? "text-slate-700"}`}>
              {notification.message}
            </p>
            <p className="mt-2 text-xs text-slate-500">{notification.id}</p>
          </article>
        ))}
      </div>
    </LayoutShell>
  );
}
