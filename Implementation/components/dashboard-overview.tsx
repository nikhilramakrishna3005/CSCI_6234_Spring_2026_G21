"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useAppState } from "@/lib/app-state";
import { MeetupCard } from "@/components/meetup-card";
import { NearbyUsers } from "@/components/nearby-users";
import { SectionHeader } from "@/components/section-header";
import { StatusBadge } from "@/components/status-badge";

export function DashboardOverview() {
  const { currentUser, users, meetups, notifications } = useAppState();

  const onlineUsers = users.filter((user) => user.availability === "ONLINE");
  const activeMeetups = meetups.filter((meetup) => meetup.visibility === "ACTIVE");
  const upcomingMeetups = meetups.filter((meetup) => meetup.visibility === "UPCOMING");
  const pendingInvites = useMemo(
    () =>
      meetups.flatMap((meetup) =>
        meetup.participants
          .filter((participant) => participant.status === "REQUESTED")
          .map((participant) => ({ meetup, participant })),
      ),
    [meetups],
  );

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-white/80 bg-white/90 p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              Welcome back, {currentUser?.name ?? "Explorer"}.
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Discover nearby people and spin up instant social moments.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge label={currentUser?.availability ?? "OFFLINE"} />
            <span className="text-sm text-slate-500">{currentUser?.email}</span>
          </div>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <Link className="btn-primary justify-center text-center" href="/meetups/create">
            Create Meetup
          </Link>
          <Link className="btn-secondary justify-center text-center" href="/meetups/edit">
            Edit Meetup
          </Link>
          <Link className="btn-secondary justify-center text-center" href="/profile">
            View Profile
          </Link>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="card-base p-5">
          <SectionHeader
            title="Nearby Online People"
            subtitle="Live status around you right now"
            action={<Link href="/participants" className="text-sm text-indigo-600">Invite</Link>}
          />
          <NearbyUsers users={onlineUsers} />
        </div>
        <div className="card-base p-5">
          <SectionHeader
            title="Invitations & Pending Requests"
            subtitle="Participation requests waiting for action"
          />
          <div className="space-y-3">
            {pendingInvites.length ? (
              pendingInvites.slice(0, 4).map(({ meetup, participant }) => (
                <div
                  key={participant.id}
                  className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-slate-50/80 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-800">{meetup.title}</p>
                    <p className="text-xs text-slate-500">{participant.userId} requested access</p>
                  </div>
                  <StatusBadge label="REQUESTED" />
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">No pending requests right now.</p>
            )}
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="card-base p-5">
          <SectionHeader title="Active Meetups" subtitle="Happening now" />
          <div className="grid gap-3">
            {activeMeetups.map((meetup) => (
              <MeetupCard key={meetup.id} meetup={meetup} />
            ))}
          </div>
        </div>
        <div className="card-base p-5">
          <SectionHeader title="Upcoming Meetups" subtitle="Next up on your social map" />
          <div className="grid gap-3">
            {upcomingMeetups.map((meetup) => (
              <MeetupCard key={meetup.id} meetup={meetup} />
            ))}
          </div>
        </div>
      </section>

      <section className="card-base p-5">
        <SectionHeader
          title="Notifications Preview"
          subtitle="Latest updates from your network"
          action={<Link href="/notifications" className="text-sm text-indigo-600">View all</Link>}
        />
        <div className="space-y-2">
          {notifications.slice(0, 4).map((notification) => (
            <div
              key={notification.id}
              className="flex items-start justify-between rounded-2xl border border-slate-200/80 bg-white px-4 py-3"
            >
              <div>
                <p className="text-sm font-medium text-slate-800">{notification.message}</p>
                <p className="text-xs text-slate-500">{notification.createdAt}</p>
              </div>
              <StatusBadge label={notification.type} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
