"use client";

import Link from "next/link";
import { Meetup } from "@/lib/types";
import { StatusBadge } from "@/components/status-badge";

type MeetupCardProps = {
  meetup: Meetup;
  hostName?: string;
};

export function MeetupCard({ meetup, hostName }: MeetupCardProps) {
  const acceptedCount = meetup.participants.filter((entry) => entry.status === "ACCEPTED").length;
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl">
      <div className="pointer-events-none absolute -right-10 top-0 h-24 w-24 rounded-full bg-indigo-100/70 blur-2xl transition group-hover:bg-violet-100/80" />
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Community Meetup</p>
          <h3 className="mt-1 text-lg font-semibold text-slate-900">{meetup.title}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-slate-500">{meetup.description}</p>
        </div>
        <StatusBadge label={meetup.activityType} />
      </div>
      <dl className="grid grid-cols-2 gap-3 text-sm text-slate-600">
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
      <div className="soft-divider mt-4 pt-4 flex items-center justify-between">
        <StatusBadge label={meetup.visibility} />
        <Link href={`/meetups/${meetup.id}`} className="text-sm font-semibold text-violet-600 transition hover:text-violet-700">
          View details →
        </Link>
      </div>
    </article>
  );
}
