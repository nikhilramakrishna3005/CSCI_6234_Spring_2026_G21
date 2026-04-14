"use client";

import type { User } from "@/lib/types";
import { UserAvatar } from "@/components/user-avatar";
import { StatusBadge } from "@/components/status-badge";

type NearbyUsersProps = {
  users: User[];
};

export function NearbyUsers({ users }: NearbyUsersProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {users.map((user) => (
        <article
          key={user.id}
          className="group relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white/95 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
        >
          <div className="pointer-events-none absolute -right-8 -top-8 h-20 w-20 rounded-full bg-indigo-100/70 blur-2xl transition group-hover:bg-indigo-200/80" />
          <div className="mb-3 flex items-center gap-3">
            <UserAvatar user={user} />
            <div>
              <p className="text-sm font-semibold text-slate-800">{user.name}</p>
              <p className="text-xs text-slate-500">{user.email}</p>
            </div>
          </div>
          <div className="mb-3 flex items-center justify-between">
            <StatusBadge label={user.availability} />
            <span className="text-xs text-slate-500">@{user.username}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {user.preferences.map((pref) => (
              <span
                key={pref.id}
                className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-600"
              >
                {pref.key}: {pref.value}
              </span>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}
