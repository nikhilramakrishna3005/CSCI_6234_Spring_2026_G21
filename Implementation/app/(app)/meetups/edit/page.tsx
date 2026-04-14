"use client";

import { useState } from "react";
import { LayoutShell } from "@/components/layout-shell";
import { SectionHeader } from "@/components/section-header";
import { useAppState } from "@/lib/app-state";

export default function EditMeetupPage() {
  const { meetups, editMeetup } = useAppState();
  const [selectedMeetupId, setSelectedMeetupId] = useState(meetups[0]?.id ?? "");
  const selected = meetups.find((meetup) => meetup.id === selectedMeetupId);

  const [title, setTitle] = useState(selected?.title ?? "");
  const [time, setTime] = useState(selected?.time ?? "");
  const [capacity, setCapacity] = useState(selected?.capacity ?? 5);
  const [description, setDescription] = useState(selected?.description ?? "");
  const [message, setMessage] = useState("");

  const hydrateFromSelected = () => {
    if (!selected) return;
    setTitle(selected.title);
    setTime(selected.time);
    setCapacity(selected.capacity);
    setDescription(selected.description);
  };

  const onSave = () => {
    const updated = editMeetup(selectedMeetupId, { title, time, capacity, description });
    if (!updated) {
      setMessage("Unable to save meetup changes.");
      return;
    }
    setMessage(`Meetup ${updated.id} updated.`);
  };

  return (
    <LayoutShell
      title="6. Edit Meetup"
      subtitle="Preload and update meetup details quickly."
    >

      <section className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm font-medium text-slate-700">
            Select meetup
            <select
              value={selectedMeetupId}
              onChange={(event) => {
                setSelectedMeetupId(event.target.value);
                const next = meetups.find((m) => m.id === event.target.value);
                if (next) {
                  setTitle(next.title);
                  setTime(next.time);
                  setCapacity(next.capacity);
                  setDescription(next.description);
                }
              }}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-100"
            >
              {meetups.map((meetup) => (
                <option key={meetup.id} value={meetup.id}>
                  {meetup.id} - {meetup.title}
                </option>
              ))}
            </select>
          </label>
          <div className="flex items-end">
            <button
              onClick={hydrateFromSelected}
              className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:border-violet-300 hover:bg-violet-50"
            >
              Reload selected meetup
            </button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm font-medium text-slate-700">
            Title
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-100"
            />
          </label>
          <label className="space-y-2 text-sm font-medium text-slate-700">
            Time
            <input
              value={time}
              onChange={(event) => setTime(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-100"
            />
          </label>
          <label className="space-y-2 text-sm font-medium text-slate-700">
            Capacity
            <input
              type="number"
              value={capacity}
              onChange={(event) => setCapacity(Number(event.target.value))}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-100"
            />
          </label>
        </div>

        <label className="space-y-2 text-sm font-medium text-slate-700">
          Description
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={4}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-100"
          />
        </label>

        <button
          onClick={onSave}
          className="rounded-2xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-700"
        >
          Save changes
        </button>
      </section>

      {message ? (
        <p className="mt-4 rounded-2xl border border-violet-200 bg-violet-50 px-4 py-3 text-sm text-violet-700">
          {message}
        </p>
      ) : null}
    </LayoutShell>
  );
}
