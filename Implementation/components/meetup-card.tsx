"use client";

import Link from "next/link";
import { Meetup } from "@/lib/types";
import { StatusBadge } from "@/components/status-badge";

type MeetupCardProps = {
  meetup: Meetup;
  hostName?: string;
  highlight?: boolean;
};

export function MeetupCard({ meetup, hostName, highlight }: MeetupCardProps) {
  const acceptedCount = meetup.participants.filter((entry) => entry.status === "ACCEPTED").length;
  return (
    <article
      className={`group relative overflow-hidden rounded-2xl border bg-white p-5 shadow-sm transition duration-500 hover:-translate-y-0.5 hover:shadow-xl ${
        highlight
          ? "animate-micromeet-live-glow border-rose-300 ring-4 ring-rose-200/70 shadow-[0_20px_50px_rgba(159,18,57,0.2)]"
          : "border-slate-200/80"
      }`}
    >
      {highlight ? (
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-red-950 via-rose-700 to-red-500" />
      ) : null}
      {highlight ? (
        <div className="relative z-10 mb-3 flex items-center gap-2 rounded-xl bg-rose-50/90 px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-rose-900 ring-1 ring-rose-200/80">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-rose-700" />
          </span>
          Live — just synced to your feed
        </div>
      ) : null}
      <div className="pointer-events-none absolute -right-10 top-0 h-24 w-24 rounded-full bg-rose-100/70 blur-2xl transition group-hover:bg-red-100/80" />
      <div className="relative z-10 mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Community Meetup</p>
          <h3 className="mt-1 text-lg font-semibold text-slate-900">{meetup.title}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-slate-500">{meetup.description}</p>
        </div>
        <StatusBadge label={meetup.activityType} />
      </div>
      <dl className="relative z-10 grid grid-cols-2 gap-3 text-sm text-slate-600">
        <div>
          <dt className="text-[11px] uppercase tracking-wide text-slate-400">Host</dt>
          <dd>{hostName ?? meetup.hostUserId}</dd>
        </div>
        <div>
          <dt className="text-[11px] uppercase tracking-wide text-slate-400">Time</dt>
          <dd>{meetup.time}</dd>
        </div>
        <div>
          <dt className="text-[11px] uppercase tracking-wide text-slate-400">Location</dt>
          <dd>{meetup.location.label}</dd>
        </div>
        <div>
          <dt className="text-[11px] uppercase tracking-wide text-slate-400">Capacity</dt>
          <dd>
            {acceptedCount}/{meetup.capacity}
          </dd>
        </div>
      </dl>
      <div className="relative z-10 soft-divider mt-4 flex items-center justify-between pt-4">
        <StatusBadge label={meetup.visibility} />
        <Link href={`/meetups/${meetup.id}`} className="text-sm font-semibold text-rose-800 transition hover:text-rose-900">
          View details →
        </Link>
      </div>
    </article>
  );
}
