"use client";

import { useEffect, useState } from "react";
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

  useEffect(() => {
    const next = meetups.find((meetup) => meetup.id === selectedMeetupId);
    if (!next) return;
    setTitle(next.title);
    setTime(next.time);
    setCapacity(next.capacity);
    setDescription(next.description);
  }, [meetups, selectedMeetupId]);

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
    setMessage("");
  };

  return (
    <LayoutShell
      title="Edit Meetup"
      subtitle="Preload a meetup and tune details with confidence."
    >
      <section className="card-base space-y-6 p-6 md:p-7">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="form-label">
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
              className="input-field"
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
              className="btn-secondary"
            >
              Reload selected meetup
            </button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="form-label">
            Title
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="input-field"
            />
          </label>
          <label className="form-label">
            Time
            <input
              value={time}
              onChange={(event) => setTime(event.target.value)}
              className="input-field"
            />
          </label>
          <label className="form-label">
            Capacity
            <input
              type="number"
              value={capacity}
              onChange={(event) => setCapacity(Number(event.target.value))}
              className="input-field"
            />
          </label>
        </div>

        <label className="form-label">
          Description
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={4}
            className="input-field"
          />
        </label>

        <div className="flex justify-end">
          <button onClick={onSave} className="btn-primary">
            Save changes
          </button>
        </div>
      </section>

      {message ? (
        <p className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
          {message}
        </p>
      ) : null}
    </LayoutShell>
  );
}
