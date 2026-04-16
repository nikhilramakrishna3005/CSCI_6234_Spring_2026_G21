"use client";

import { useEffect, useMemo, useRef } from "react";
import { useParams } from "next/navigation";
import { LayoutShell } from "@/components/layout-shell";
import { SectionHeader } from "@/components/section-header";
import { StatusBadge } from "@/components/status-badge";
import { UserAvatar } from "@/components/user-avatar";
import { useAppState } from "@/lib/app-state";
import { emitToast } from "@/lib/toast-bus";

export default function MeetupDetailsPage() {
  const params = useParams<{ id: string }>();
  const { meetups, users, currentUser, manageParticipants, respondToRequest } = useAppState();
  const hintedRef = useRef<string | null>(null);

  useEffect(() => {
    hintedRef.current = null;
  }, [params.id]);

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

  const canHostManage = Boolean(meetup && currentUser?.id === meetup.hostUserId);

  useEffect(() => {
    if (!meetup || !currentUser) return;
    const key = `${meetup.id}:${currentUser.id}`;
    if (hintedRef.current === key) return;

    if (canHostManage) {
      const pendingJoin = meetup.participants.some(
        (participant) =>
          participant.status === "REQUESTED" && participant.userId !== currentUser.id,
      );
      if (pendingJoin) {
        hintedRef.current = key;
        emitToast({
          title: "You have a new join request",
          description: "Approve or follow up from the participant list.",
          variant: "info",
        });
      }
    } else {
      const self = meetup.participants.find((participant) => participant.userId === currentUser.id);
      if (self?.status === "REQUESTED") {
        hintedRef.current = key;
        emitToast({
          title: "Join request pending",
          description: "The host will review your spot shortly.",
          variant: "warning",
        });
      }
    }
  }, [meetup, currentUser, canHostManage]);

  if (!meetup) {
    return (
      <LayoutShell title="Meetup Details">
        <div className="rounded-3xl border border-rose-200 bg-rose-50 p-8 text-rose-700">
          Meetup not found.
        </div>
      </LayoutShell>
    );
  }

  return (
    <LayoutShell
      title="Meetup Details"
      subtitle="Detailed meetup view with host, participants, and role-based actions."
    >
      <SectionHeader title={meetup.title} subtitle={meetup.description} />

      <div className="grid gap-6 lg:grid-cols-[1.3fr,1fr]">
        <section className="card-base space-y-5 p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-rose-800">{meetup.activityType}</p>
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
                className="btn-primary"
              >
                Invite user1
              </button>
              <button
                onClick={() => manageParticipants(meetup.id, "u-user-2", "APPROVE")}
                className="btn-secondary"
              >
                Approve user2
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => respondToRequest(meetup.id, currentUser?.id ?? "", "ACCEPT")}
                className="rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                Accept invite
              </button>
              <button
                onClick={() => respondToRequest(meetup.id, currentUser?.id ?? "", "DECLINE")}
                className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
              >
                Decline
              </button>
            </div>
          )}
        </section>

        <section className="card-base space-y-4 p-6">
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
