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
    <article className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Community Meetup</p>
          <h3 className="mt-1 text-lg font-semibold text-slate-900">{meetup.title}</h3>
          <p className="text-sm text-slate-500">{meetup.description}</p>
        </div>
        <StatusBadge label={meetup.activityType} />
      </div>
      <dl className="grid grid-cols-2 gap-3 text-sm text-slate-600">
        <div>
          <dt className="text-xs uppercase text-slate-400">Host</dt>
          <dd>{hostName ?? meetup.hostUserId}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase text-slate-400">Time</dt>
          <dd>{meetup.time}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase text-slate-400">Location</dt>
          <dd>{meetup.location.label}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase text-slate-400">Capacity</dt>
          <dd>
            {acceptedCount}/{meetup.capacity}
          </dd>
        </div>
      </dl>
      <div className="mt-4 flex items-center justify-between">
        <StatusBadge label={meetup.visibility} />
        <Link href={`/meetups/${meetup.id}`} className="text-sm font-semibold text-violet-600 transition hover:text-violet-700">
          View details →
        </Link>
      </div>
    </article>
  );
}
