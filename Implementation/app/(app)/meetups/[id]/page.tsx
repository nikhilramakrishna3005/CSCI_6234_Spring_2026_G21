"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import { LayoutShell } from "@/components/layout-shell";
import { SectionHeader } from "@/components/section-header";
import { StatusBadge } from "@/components/status-badge";
import { UserAvatar } from "@/components/user-avatar";
import { useAppState } from "@/lib/app-state";

export default function MeetupDetailsPage() {
  const params = useParams<{ id: string }>();
  const { meetups, users, currentUser, manageParticipants, respondToRequest } = useAppState();

  const meetup = meetups.find((item) => item.id === params.id);
  const host = users.find((user) => user.id === meetup?.hostUserId);

  const participants = useMemo(() => {
    if (!meetup) return [];
    return meetup.participants
      .map((participation) => {
        const user = users.find((candidate) => candidate.id === participation.userId);
        return user ? { user, participation } : null;
      })
      .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));
  }, [meetup, users]);

  if (!meetup) {
    return (
      <LayoutShell title="Meetup Details">
        <div className="rounded-3xl border border-rose-200 bg-rose-50 p-8 text-rose-700">
          Meetup not found.
        </div>
      </LayoutShell>
    );
  }

  const canHostManage = currentUser?.id === meetup.hostUserId;

  return (
    <LayoutShell
      title="4. View Meetup Details"
      subtitle="Detailed meetup view with host, participants, and role-based actions."
    >
      <SectionHeader title={meetup.title} subtitle={meetup.description} />

      <div className="grid gap-6 lg:grid-cols-[1.3fr,1fr]">
        <section className="space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-violet-600">{meetup.activityType}</p>
              <h2 className="text-2xl font-bold text-slate-900">{meetup.title}</h2>
            </div>
            <StatusBadge label={meetup.visibility} />
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm text-slate-700">
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">Time</p>
              <p className="mt-1 font-medium">{meetup.time}</p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">Capacity</p>
              <p className="mt-1 font-medium">
                {meetup.participants.filter((p) => p.status === "ACCEPTED").length}/{meetup.capacity}
              </p>
            </div>
            <div className="col-span-2 rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">Location</p>
              <p className="mt-1 font-medium">
                {meetup.location.label}, {meetup.location.city}
              </p>
            </div>
          </div>
          {canHostManage ? (
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => manageParticipants(meetup.id, "u-user-1", "INVITE")}
                className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                Invite user1
              </button>
              <button
                onClick={() => manageParticipants(meetup.id, "u-user-2", "APPROVE")}
                className="rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-100"
              >
                Approve user2
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => respondToRequest(meetup.id, currentUser?.id ?? "", "ACCEPT")}
                className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                Accept invite
              </button>
              <button
                onClick={() => respondToRequest(meetup.id, currentUser?.id ?? "", "DECLINE")}
                className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-100"
              >
                Decline
              </button>
            </div>
          )}
        </section>

        <section className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Host</h3>
          {host ? (
            <div className="flex items-center gap-3">
              <UserAvatar user={host} />
              <div>
                <p className="text-sm font-semibold text-slate-800">{host.name}</p>
                <p className="text-xs text-slate-500">{host.email}</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-500">Unknown host</p>
          )}

          <h3 className="pt-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Participants ({participants.length})
          </h3>
          <div className="space-y-3">
            {participants.map((entry) => (
              <div
                key={entry.participation.id}
                className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-3"
              >
                <div className="flex items-center gap-3">
                  <UserAvatar user={entry.user} />
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{entry.user.name}</p>
                    <p className="text-xs text-slate-500">{entry.user.email}</p>
                  </div>
                </div>
                <StatusBadge label={entry.participation.status} />
              </div>
            ))}
          </div>
        </section>
      </div>
    </LayoutShell>
  );
}
