"use client";

import { useEffect, useState } from "react";
import { LayoutShell } from "@/components/layout-shell";
import { PresenceToggle } from "@/components/presence-toggle";
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

  useEffect(() => {
    if (!currentUser) return;
    setName(currentUser.name);
    setEmail(currentUser.email);
    setAvailability(currentUser.availability);
  }, [currentUser]);

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
      title="Profile & Preferences"
      subtitle="Update your identity, availability, and activity preferences."
    >

      <PresenceToggle className="mb-2" />

      <div className="grid gap-6 lg:grid-cols-[1.2fr,1fr]">
        <section className="card-base space-y-4 p-6">
          <h2 className="text-lg font-semibold text-slate-900">Profile details</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="form-label">
              Name
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="input-field"
              />
            </label>
            <label className="form-label">
              Email
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="input-field"
              />
            </label>
            <label className="form-label">
              Availability
              <select
                value={availability}
                onChange={(event) =>
                  setAvailability(event.target.value as AvailabilityStatus)
                }
                className="input-field"
              >
                {availabilityOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <button onClick={onSaveProfile} className="btn-primary">
            Save profile
          </button>
        </section>

        <section className="card-base space-y-4 p-6">
          <h2 className="text-lg font-semibold text-slate-900">Add preference</h2>
          <label className="form-label">
            Preference key
            <input
              value={prefKey}
              onChange={(event) => setPrefKey(event.target.value)}
              placeholder="e.g. activity"
              className="input-field"
            />
          </label>
          <label className="form-label">
            Preference value
            <input
              value={prefValue}
              onChange={(event) => setPrefValue(event.target.value)}
              placeholder="e.g. COFFEE"
              className="input-field"
            />
          </label>
          <button onClick={onSavePreference} className="btn-secondary">
            Save preference
          </button>
          <div className="space-y-2 rounded-2xl border border-slate-200/70 bg-white/70 p-4 text-sm text-slate-600">
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
        <p className="mt-6 rounded-2xl border border-rose-200 bg-rose-50/90 px-4 py-3 text-sm font-medium text-rose-800">
          {message}
        </p>
      ) : null}
    </LayoutShell>
  );
}
