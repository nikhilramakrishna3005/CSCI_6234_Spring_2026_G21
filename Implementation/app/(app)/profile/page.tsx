"use client";

import { useState } from "react";
import { LayoutShell } from "@/components/layout-shell";
import { SectionHeader } from "@/components/section-header";
import { useAppState } from "@/lib/app-state";
import type { AvailabilityStatus } from "@/lib/types";

const availabilityOptions: AvailabilityStatus[] = ["ONLINE", "OFFLINE"];

export default function ProfilePage() {
  const { currentUser, updateProfile, upsertPreference } = useAppState();
  const [name, setName] = useState(currentUser?.name ?? "");
  const [email, setEmail] = useState(currentUser?.email ?? "");
  const [availability, setAvailability] = useState<AvailabilityStatus>(
    currentUser?.availability ?? "ONLINE",
  );
  const [prefKey, setPrefKey] = useState("");
  const [prefValue, setPrefValue] = useState("");
  const [message, setMessage] = useState("");

  if (!currentUser) return null;

  const onSaveProfile = () => {
    updateProfile({
      name,
      email,
      availability,
    });
    setMessage("Profile updated successfully.");
  };

  const onSavePreference = () => {
    if (!prefKey.trim() || !prefValue.trim()) {
      setMessage("Please enter both preference key and value.");
      return;
    }
    upsertPreference(prefKey.trim(), prefValue.trim());
    setMessage("Preference saved.");
    setPrefKey("");
    setPrefValue("");
  };

  return (
    <LayoutShell
      title="2. Manage Profile & Preferences"
      subtitle="Update your identity, availability, and activity preferences."
    >

      <div className="grid gap-6 lg:grid-cols-[1.2fr,1fr]">
        <section className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Profile details</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-sm font-medium text-slate-700">
              Name
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-100"
              />
            </label>
            <label className="space-y-2 text-sm font-medium text-slate-700">
              Email
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-100"
              />
            </label>
            <label className="space-y-2 text-sm font-medium text-slate-700">
              Availability
              <select
                value={availability}
                onChange={(event) =>
                  setAvailability(event.target.value as AvailabilityStatus)
                }
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-100"
              >
                {availabilityOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <button
            onClick={onSaveProfile}
            className="rounded-2xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-700"
          >
            Save profile
          </button>
        </section>

        <section className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Add preference</h2>
          <label className="space-y-2 text-sm font-medium text-slate-700">
            Preference key
            <input
              value={prefKey}
              onChange={(event) => setPrefKey(event.target.value)}
              placeholder="e.g. activity"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-100"
            />
          </label>
          <label className="space-y-2 text-sm font-medium text-slate-700">
            Preference value
            <input
              value={prefValue}
              onChange={(event) => setPrefValue(event.target.value)}
              placeholder="e.g. COFFEE"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-100"
            />
          </label>
          <button
            onClick={onSavePreference}
            className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
          >
            Save preference
          </button>
          <div className="space-y-2 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-600">
            <p className="font-semibold text-slate-700">Current preferences</p>
            {currentUser.preferences.map((preference) => (
              <p key={preference.id}>
                {preference.key}: <span className="font-medium">{preference.value}</span>
              </p>
            ))}
          </div>
        </section>
      </div>

      {message ? (
        <p className="mt-6 rounded-2xl border border-violet-200 bg-violet-50 px-4 py-3 text-sm font-medium text-violet-700">
          {message}
        </p>
      ) : null}
    </LayoutShell>
  );
}
