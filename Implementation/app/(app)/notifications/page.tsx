"use client";

import { useState } from "react";
import { LayoutShell } from "@/components/layout-shell";
import { SectionHeader } from "@/components/section-header";
import { StatusBadge } from "@/components/status-badge";
import { useAppState } from "@/lib/app-state";

const colors: Record<string, string> = {
  MEETUP_UPDATED: "text-rose-800",
  INVITE_SENT: "text-rose-800",
  APPROVAL_SENT: "text-emerald-700",
  JOIN_RESPONSE: "text-amber-700",
  SYSTEM_UPDATE: "text-slate-700",
  NEARBY_PRESENCE: "text-rose-800",
};

export default function NotificationsPage() {
  const { notifications, sendUpdateNotification } = useAppState();
  const [meetupId, setMeetupId] = useState("meetup-1");
  const [message, setMessage] = useState("Host posted a fresh update.");

  return (
    <LayoutShell
      title="Notifications"
      subtitle="A clean, scrollable notification center with timestamped social updates."
    >
      <section className="card-base p-6">
        <SectionHeader
          title="Notification Composer"
          subtitle="Trigger a demo update to simulate live system and meetup announcements."
        />
        <div className="grid gap-3 md:grid-cols-[220px,1fr,auto] md:items-end">
          <label className="form-label">
            Meetup ID
            <input
              value={meetupId}
              onChange={(event) => setMeetupId(event.target.value)}
              className="input-field"
              placeholder="meetup-1"
            />
          </label>
          <label className="form-label">
            Notification Message
            <input
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              className="input-field"
              placeholder="Host posted a fresh update."
            />
          </label>
          <button
            onClick={() => sendUpdateNotification(meetupId, message)}
            className="btn-primary md:h-12"
          >
            Send update
          </button>
        </div>
      </section>

      <section className="card-base p-6">
        <SectionHeader
          title={`Notification Feed (${notifications.length})`}
          subtitle="Tagged, timestamped events in a scrollable activity timeline."
        />
        <div className="max-h-[68vh] space-y-3 overflow-y-auto pr-1">
        {notifications.map((notification) => (
          <article
            key={notification.id}
            className="group rounded-3xl border border-slate-200/80 bg-gradient-to-b from-white to-slate-50/70 p-5 shadow-sm transition hover:border-rose-200 hover:shadow-md"
          >
            <div className="mb-3 flex items-center justify-between">
              <StatusBadge label={notification.type} />
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                {notification.createdAt}
              </p>
            </div>
            <p className={`text-sm font-medium leading-relaxed ${colors[notification.type] ?? "text-slate-700"}`}>
              {notification.message}
            </p>
            <div className="mt-3 flex items-center justify-between">
              <p className="text-xs text-slate-500">{notification.id}</p>
              <span className="text-xs text-slate-400">{notification.read ? "Read" : "Unread"}</span>
            </div>
          </article>
        ))}
        </div>
      </section>
    </LayoutShell>
  );
}
