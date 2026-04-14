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

  const onlineUsers = users.filter(
    (user) => user.availability === "ONLINE" && user.id !== currentUser?.id,
  );
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
      <section className="card-base relative overflow-hidden p-6">
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-indigo-100/80 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 left-1/3 h-56 w-56 rounded-full bg-violet-100/75 blur-3xl" />
        <div className="relative flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-600">MicroMeet Dashboard</p>
            <h1 className="mt-2 text-2xl font-semibold text-slate-900 md:text-3xl">
              Welcome back, {currentUser?.name ?? "Explorer"}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              Discover nearby online people, manage invitations, and run spontaneous meetups with a polished social workflow.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white/90 px-3 py-2">
            <StatusBadge label={currentUser?.availability ?? "OFFLINE"} />
            <span className="text-xs text-slate-500">{currentUser?.email}</span>
          </div>
        </div>

        <div className="relative mt-5 grid gap-3 sm:grid-cols-3">
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

        <div className="relative mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="metric-card">
            <p className="text-[11px] uppercase tracking-wide text-slate-500">Online Nearby</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900">{onlineUsers.length}</p>
          </div>
          <div className="metric-card">
            <p className="text-[11px] uppercase tracking-wide text-slate-500">Active Meetups</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900">{activeMeetups.length}</p>
          </div>
          <div className="metric-card">
            <p className="text-[11px] uppercase tracking-wide text-slate-500">Upcoming Meetups</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900">{upcomingMeetups.length}</p>
          </div>
          <div className="metric-card">
            <p className="text-[11px] uppercase tracking-wide text-slate-500">Notifications</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900">{notifications.length}</p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="card-base p-5">
          <SectionHeader
            title="Nearby Online People"
            subtitle="Live status around you right now"
            action={<Link href="/participants" className="btn-ghost">Invite</Link>}
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
                  className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-slate-50/80 px-4 py-3 shadow-sm"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-800">{meetup.title}</p>
                    <p className="text-xs text-slate-500">{participant.userId} requested access • {meetup.time}</p>
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
          action={<Link href="/notifications" className="btn-ghost">View all</Link>}
        />
        <div className="space-y-2">
          {notifications.slice(0, 4).map((notification) => (
            <div
              key={notification.id}
              className="flex items-start justify-between rounded-2xl border border-slate-200/80 bg-white px-4 py-3 shadow-sm"
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
