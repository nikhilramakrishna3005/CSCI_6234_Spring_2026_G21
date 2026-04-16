"use client";

import { FormEvent, useState } from "react";
import { LayoutShell } from "@/components/layout-shell";
import { SectionHeader } from "@/components/section-header";
import { useAppState } from "@/lib/app-state";
import type { ActivityType } from "@/lib/types";

const activityOptions: ActivityType[] = [
  "STUDY",
  "GYM",
  "FOOD",
  "SPORTS",
  "COFFEE",
];

export default function CreateMeetupPage() {
  const { createMeetup } = useAppState();
  const [title, setTitle] = useState("");
  const [activityType, setActivityType] = useState<ActivityType>("COFFEE");
  const [time, setTime] = useState("Tomorrow · 7:00 PM");
  const [capacity, setCapacity] = useState(6);
  const [description, setDescription] = useState("");
  const [locationLabel, setLocationLabel] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const onCreate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const created = createMeetup({
      title,
      activityType,
      time,
      capacity,
      description,
      locationLabel,
    });

    if (!created) {
      setIsError(true);
      setMessage("Could not create meetup. Please review your fields.");
      return;
    }

    setIsError(false);
    setMessage("");
    setTitle("");
    setDescription("");
    setLocationLabel("");
  };

  return (
    <LayoutShell
      title="Create Meetup"
      subtitle="Launch a polished, social-ready meetup in seconds."
    >
      <section className="card-base p-8">
        <SectionHeader
          title="Create a New Meetup"
          subtitle="Title, activity type, schedule, capacity, description, and location."
        />
        <form className="space-y-5" onSubmit={onCreate}>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="form-label">
              Title
              <input
                required
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className="input-field"
                placeholder="Sunset coffee sprint"
              />
            </label>
            <label className="form-label">
              Activity Type
              <select
                value={activityType}
                onChange={(event) => setActivityType(event.target.value as ActivityType)}
                className="input-field"
              >
                {activityOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
            <label className="form-label">
              Time
              <input
                required
                value={time}
                onChange={(event) => setTime(event.target.value)}
                className="input-field"
                placeholder="Fri · 6:30 PM"
              />
            </label>
            <label className="form-label">
              Capacity
              <input
                type="number"
                min={2}
                max={30}
                value={capacity}
                onChange={(event) => setCapacity(Number(event.target.value))}
                className="input-field"
              />
            </label>
          </div>
          <label className="form-label">
            Description
            <textarea
              required
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={4}
              className="input-field"
              placeholder="Tell people what this meetup is about."
            />
          </label>
          <label className="form-label">
            Location Label
            <input
              required
              value={locationLabel}
              onChange={(event) => setLocationLabel(event.target.value)}
              className="input-field"
              placeholder="Bean District Rooftop"
            />
          </label>
          <button type="submit" className="btn-primary">
            Create Meetup
          </button>
        </form>
      </section>

      {message ? (
        <p
          className={`rounded-2xl border px-4 py-3 text-sm font-medium ${
            isError
              ? "border-rose-200 bg-rose-50 text-rose-700"
              : "border-emerald-200 bg-emerald-50 text-emerald-700"
          }`}
        >
          {message}
        </p>
      ) : null}
    </LayoutShell>
  );
}
