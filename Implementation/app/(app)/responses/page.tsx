"use client";

import { useState } from "react";
import { LayoutShell } from "@/components/layout-shell";
import { SectionHeader } from "@/components/section-header";
import { useAppState } from "@/lib/app-state";

export default function ResponsesPage() {
  const { meetups, users, respondToRequest } = useAppState();
  const [meetupId, setMeetupId] = useState(meetups[0]?.id ?? "");
  const [userId, setUserId] = useState(users[1]?.id ?? "");
  const [message, setMessage] = useState("");

  const onChoice = (choice: "ACCEPT" | "DECLINE") => {
    const updated = respondToRequest(meetupId, userId, choice);
    if (!updated) {
      setMessage("Unable to update response.");
      return;
    }
    setMessage(`Choice ${choice} saved for ${userId} on ${updated.id}.`);
  };

  return (
    <LayoutShell
      title="Join Response"
      subtitle="Accept or decline requests and visualize participation updates."
    >
      <SectionHeader
        title="Respond to Join Request"
        subtitle="Capture participant choices with clear visual feedback."
      />

      <section className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm font-medium text-slate-700">
            Meetup
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

          <label className="space-y-2 text-sm font-medium text-slate-700">
            User
            <select
              value={userId}
              onChange={(event) => setUserId(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-rose-300 focus:bg-white focus:ring-4 focus:ring-rose-100"
            >
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.id} - {user.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => onChoice("ACCEPT")}
            className="btn-primary !from-emerald-500 !to-teal-500"
          >
            Accept
          </button>
          <button
            onClick={() => onChoice("DECLINE")}
            className="btn-secondary border-rose-200 bg-rose-50 text-rose-700 hover:border-rose-300 hover:bg-rose-100"
          >
            Decline
          </button>
        </div>
      </section>

      {message ? (
        <p className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
          {message}
        </p>
      ) : null}
    </LayoutShell>
  );
}
