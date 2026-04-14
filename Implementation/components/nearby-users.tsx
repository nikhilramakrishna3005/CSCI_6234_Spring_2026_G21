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
          className="rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-sm"
        >
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
                className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600"
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
