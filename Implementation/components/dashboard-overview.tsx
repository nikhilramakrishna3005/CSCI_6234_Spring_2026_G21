"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useAppState } from "@/lib/app-state";
import { MeetupCard } from "@/components/meetup-card";
import { NearbyUsers } from "@/components/nearby-users";
import { PresenceToggle } from "@/components/presence-toggle";
import { SectionHeader } from "@/components/section-header";
import { StatusBadge } from "@/components/status-badge";

export function DashboardOverview() {
  const {
    currentUser,
    meetups,
    notifications,
    nearbyOnlineUsers,
    resolveUserPresence,
    spotlightMeetupId,
    getUserById,
  } = useAppState();

  const selfPresence = currentUser ? resolveUserPresence(currentUser) : "OFFLINE";
  const activeMeetups = meetups.filter((meetup) => meetup.visibility === "ACTIVE");
  const upcomingMeetups = meetups.filter((meetup) => meetup.visibility === "UPCOMING");
  const unreadNotifications = notifications.filter((n) => !n.read).length;

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
    <div className="space-y-8 pb-4">
      {/* Hero */}
      <section className="card-base relative overflow-hidden p-7 md:p-8">
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-rose-200/50 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-1/4 h-64 w-64 rounded-full bg-red-200/35 blur-3xl" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-rose-800">
                MicroMeet Dashboard
              </p>
              <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700 ring-1 ring-emerald-500/25">
                Demo mode
              </span>
            </div>
            <h1 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
              Welcome back, {currentUser?.name ?? "Explorer"}
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 md:text-base">
              Your feed, nearby radar, and meetups update live — perfect for walking the class through the flow.
            </p>
          </div>

          <div className="flex w-full min-w-[min(100%,320px)] flex-col gap-3 lg:max-w-sm">
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200/90 bg-white/95 px-4 py-3 shadow-sm ring-1 ring-slate-100/80">
              <StatusBadge label={selfPresence} size="prominent" />
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Account</p>
                <p className="truncate text-xs text-slate-600">{currentUser?.email}</p>
              </div>
            </div>
            <PresenceToggle />
          </div>
        </div>

        {selfPresence === "OFFLINE" ? (
          <div className="relative mt-6 rounded-2xl border border-amber-200/90 bg-gradient-to-r from-amber-50/90 to-amber-50/40 px-4 py-3.5 text-sm text-amber-950 shadow-sm ring-1 ring-amber-100/60 transition duration-300">
            <span className="font-semibold">You&apos;re offline.</span> Nearby discovery is paused — flip your
            presence switch to go live for the demo.
          </div>
        ) : null}

        <div className="relative mt-6 grid gap-3 sm:grid-cols-3">
          <Link
            className="btn-primary justify-center text-center transition duration-200 hover:scale-[1.02] active:scale-[0.99]"
            href="/meetups/create"
          >
            Create Meetup
          </Link>
          <Link
            className="btn-secondary justify-center text-center transition duration-200 hover:scale-[1.02] active:scale-[0.99]"
            href="/meetups/edit"
          >
            Edit Meetup
          </Link>
          <Link
            className="btn-secondary justify-center text-center transition duration-200 hover:scale-[1.02] active:scale-[0.99]"
            href="/profile"
          >
            View Profile
          </Link>
        </div>

        <div className="relative mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="metric-card transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <p className="text-[11px] uppercase tracking-wide text-slate-500">Online nearby</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums text-slate-900">{nearbyOnlineUsers.length}</p>
            <p className="mt-1 text-[11px] text-emerald-600">Live list</p>
          </div>
          <div className="metric-card transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <p className="text-[11px] uppercase tracking-wide text-slate-500">Active meetups</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums text-slate-900">{activeMeetups.length}</p>
            <p className="mt-1 text-[11px] text-rose-800">Happening now</p>
          </div>
          <div className="metric-card transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <p className="text-[11px] uppercase tracking-wide text-slate-500">Upcoming</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums text-slate-900">{upcomingMeetups.length}</p>
            <p className="mt-1 text-[11px] text-rose-700">On your map</p>
          </div>
          <div className="metric-card transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <p className="text-[11px] uppercase tracking-wide text-slate-500">Unread alerts</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums text-slate-900">{unreadNotifications}</p>
            <p className="mt-1 text-[11px] text-slate-500">Bell + feed</p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        {/* Nearby — featured */}
        <div className="relative overflow-hidden rounded-3xl border border-rose-100/90 bg-gradient-to-br from-white via-rose-50/25 to-red-50/35 p-6 shadow-[0_20px_50px_-18px_rgba(159,18,57,0.22)] ring-1 ring-rose-100/60 transition duration-300 hover:shadow-[0_24px_60px_-18px_rgba(159,18,57,0.3)]">
          <div className="pointer-events-none absolute -right-16 top-0 h-40 w-40 rounded-full bg-rose-200/25 blur-3xl" />
          <div className="relative mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-semibold text-slate-900 md:text-xl">Nearby online</h2>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-800 ring-1 ring-emerald-500/20">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  </span>
                  Radar
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-600">
                Simulated presence updates every few seconds — great to narrate live.
              </p>
            </div>
            <Link
              href="/participants"
              className="shrink-0 rounded-xl border border-rose-200/80 bg-white/90 px-3 py-2 text-xs font-semibold text-rose-800 shadow-sm transition hover:bg-rose-50"
            >
              Invite people →
            </Link>
          </div>
          <NearbyUsers users={nearbyOnlineUsers} resolvePresence={resolveUserPresence} variant="showcase" />
        </div>

        <div className="card-base p-6 transition duration-300 hover:shadow-[0_16px_40px_-20px_rgba(15,23,42,0.12)]">
          <SectionHeader
            title="Invitations & Pending"
            subtitle="Requests waiting for a host or guest action"
            action={
              <Link href="/responses" className="btn-ghost text-xs">
                Respond
              </Link>
            }
          />
          <div className="space-y-3">
            {pendingInvites.length ? (
              pendingInvites.slice(0, 4).map(({ meetup, participant }) => (
                <div
                  key={participant.id}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-amber-100/90 bg-gradient-to-r from-amber-50/50 to-white px-4 py-3.5 shadow-sm transition hover:border-amber-200/80 hover:shadow-md"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">{meetup.title}</p>
                    <p className="text-xs text-slate-500">
                      {participant.userId} · {meetup.time}
                    </p>
                  </div>
                  <StatusBadge label="REQUESTED" />
                </div>
              ))
            ) : (
              <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 px-4 py-8 text-center text-sm text-slate-500">
                No pending invites — you&apos;re clear for the demo.
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="card-base p-6">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-2">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 md:text-xl">Active meetups</h2>
              <p className="mt-1 text-sm text-slate-500">Updates sync instantly after create or edit.</p>
            </div>
            <span className="rounded-full bg-rose-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-rose-900">
              Live feed
            </span>
          </div>
          <div className="grid gap-4">
            {activeMeetups.length === 0 ? (
              <p className="text-sm text-slate-500">No active meetups yet.</p>
            ) : (
              activeMeetups.map((meetup) => (
                <MeetupCard
                  key={meetup.id}
                  meetup={meetup}
                  hostName={getUserById(meetup.hostUserId)?.name}
                  highlight={spotlightMeetupId === meetup.id}
                />
              ))
            )}
          </div>
        </div>
        <div className="card-base p-6">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-2">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 md:text-xl">Upcoming meetups</h2>
              <p className="mt-1 text-sm text-slate-500">Newly created meetups land here first.</p>
            </div>
            <span className="rounded-full bg-rose-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-rose-900">
              Scheduled
            </span>
          </div>
          <div className="grid gap-4">
            {upcomingMeetups.length === 0 ? (
              <p className="text-sm text-slate-500">No upcoming meetups.</p>
            ) : (
              upcomingMeetups.map((meetup) => (
                <MeetupCard
                  key={meetup.id}
                  meetup={meetup}
                  hostName={getUserById(meetup.hostUserId)?.name}
                  highlight={spotlightMeetupId === meetup.id}
                />
              ))
            )}
          </div>
        </div>
      </section>

      <section className="card-base overflow-hidden p-6 transition duration-300 hover:shadow-[0_16px_40px_-20px_rgba(15,23,42,0.1)]">
        <SectionHeader
          title="Notifications preview"
          subtitle="Same stream as the bell — ideal for live demos"
          action={
            <Link href="/notifications" className="btn-ghost text-xs">
              View all
            </Link>
          }
        />
        <div className="space-y-3">
          {notifications.slice(0, 4).map((notification, index) => (
            <div
              key={notification.id}
              style={{ animationDelay: `${index * 70}ms` }}
              className={`animate-micromeet-fade-up flex items-start justify-between gap-3 rounded-2xl border px-4 py-3.5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                notification.read
                  ? "border-slate-200/80 bg-white"
                  : "border-rose-200/80 bg-gradient-to-r from-rose-50/80 to-white ring-1 ring-rose-100/60"
              }`}
            >
              <div className="min-w-0">
                <p className="text-sm font-medium leading-snug text-slate-800">{notification.message}</p>
                <p className="mt-1 text-xs text-slate-500">{notification.createdAt}</p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1">
                <StatusBadge label={notification.type} />
                {!notification.read ? (
                  <span className="text-[10px] font-bold uppercase text-rose-700">Unread</span>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
