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
  const { meetups, users } = useAppState();
  const [activity, setActivity] = useState<ActivityType | "ALL">("ALL");

  const filtered = useMemo(() => {
    if (activity === "ALL") return meetups;
    return meetups.filter((meetup) => meetup.activityType === activity);
  }, [activity, meetups]);

  return (
    <LayoutShell
      title="3. View Active / Upcoming Meetups"
      subtitle="Explore active and upcoming meetup cards with activity filters."
    >
      <SectionHeader
        title="3. View Active / Upcoming Meetups"
        subtitle="Explore card-based meetup feeds with activity filters."
      />

      <div className="mb-6 flex flex-wrap gap-2">
        {allActivities.map((item) => (
          <button
            key={item}
            onClick={() => setActivity(item)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              activity === item
                ? "bg-violet-600 text-white shadow-lg shadow-violet-600/30"
                : "border border-slate-200 bg-white text-slate-700 hover:border-violet-300"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((meetup) => (
          <MeetupCard key={meetup.id} meetup={meetup} />
        ))}
      </div>
    </LayoutShell>
  );
}
