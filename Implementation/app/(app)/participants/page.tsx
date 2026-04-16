"use client";

import { useState } from "react";
import { LayoutShell } from "@/components/layout-shell";
import { SectionHeader } from "@/components/section-header";
import { StatusBadge } from "@/components/status-badge";
import { UserAvatar } from "@/components/user-avatar";
import { useAppState } from "@/lib/app-state";

export default function ParticipantsPage() {
  const { meetups, users, manageParticipants } = useAppState();
  const [meetupId, setMeetupId] = useState(meetups[0]?.id ?? "");
  const [message, setMessage] = useState("");
  const selected = meetups.find((meetup) => meetup.id === meetupId);

  const onAction = (userId: string, action: "INVITE" | "APPROVE") => {
    const updated = manageParticipants(meetupId, userId, action);
    if (!updated) {
      setMessage("Could not update participant status.");
      return;
    }
      setMessage(`Action ${action} processed for ${userId} in ${updated.title}.`);
  };

  return (
    <LayoutShell
      title="Participants"
      subtitle="Manage candidate users and pending requests with clear status actions."
    >
      <section className="card-base space-y-4 p-6">
        <label className="space-y-2 text-sm font-medium text-slate-700">
          Select meetup
          <select
            value={meetupId}
            onChange={(event) => setMeetupId(event.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-rose-300 focus:bg-white focus:ring-4 focus:ring-rose-100"
          >
            {meetups.map((meetup) => (
              <option key={meetup.id} value={meetup.id}>
                {meetup.id} - {meetup.title}
              </option>
            ))}
          </select>
        </label>
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {users.map((user) => {
          const participation = selected?.participants.find((p) => p.userId === user.id);
          return (
            <article
              key={user.id}
              className="card-base space-y-4 p-5"
            >
              <div className="flex items-center gap-3">
                <UserAvatar user={user} />
                <div>
                  <p className="text-sm font-semibold text-slate-800">{user.name}</p>
                  <p className="text-xs text-slate-500">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <StatusBadge label={participation?.status ?? "PENDING"} />
                <span className="text-xs text-slate-500">@{user.username}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onAction(user.id, "INVITE")}
                  className="flex-1 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-800 hover:bg-rose-100"
                >
                  Invite
                </button>
                <button
                  onClick={() => onAction(user.id, "APPROVE")}
                  className="flex-1 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
                >
                  Approve
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {message ? (
        <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
          {message}
        </p>
      ) : null}
    </LayoutShell>
  );
}
