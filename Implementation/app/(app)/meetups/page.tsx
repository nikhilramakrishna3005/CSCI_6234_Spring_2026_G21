"use client";

import { useMemo, useState } from "react";
import { LayoutShell } from "@/components/layout-shell";
import { MeetupCard } from "@/components/meetup-card";
import { SectionHeader } from "@/components/section-header";
import { useAppState } from "@/lib/app-state";
import type { ActivityType } from "@/lib/types";

const allActivities: Array<ActivityType | "ALL"> = [
  "ALL",
  "STUDY",
  "GYM",
  "FOOD",
  "SPORTS",
  "COFFEE",
];

export default function MeetupsPage() {
  const { meetups, getUserById, spotlightMeetupId } = useAppState();
  const [activity, setActivity] = useState<ActivityType | "ALL">("ALL");

  const filtered = useMemo(() => {
    if (activity === "ALL") return meetups;
    return meetups.filter((meetup) => meetup.activityType === activity);
  }, [activity, meetups]);

  return (
    <LayoutShell
      title="Active / Upcoming Meetups"
      subtitle="Explore active and upcoming meetup cards with activity filters."
    >
      <SectionHeader
        title="Active + Upcoming Meetup Feed"
        subtitle="Discover card-based meetup stories and narrow by activity."
      />

      <div className="card-base mb-6 flex flex-wrap gap-2 p-3">
        {allActivities.map((item) => (
          <button
            key={item}
            onClick={() => setActivity(item)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              activity === item
                ? "bg-gradient-to-r from-red-950 to-rose-800 text-white shadow-lg shadow-rose-900/20"
                : "border border-slate-200 bg-white text-slate-700 hover:border-rose-300 hover:bg-rose-50"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((meetup) => (
          <MeetupCard
            key={meetup.id}
            meetup={meetup}
            hostName={getUserById(meetup.hostUserId)?.name}
            highlight={spotlightMeetupId === meetup.id}
          />
        ))}
      </div>
    </LayoutShell>
  );
}
