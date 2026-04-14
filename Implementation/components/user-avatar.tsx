import type { User } from "@/lib/types";

type UserAvatarProps = {
  user: User;
};

export function UserAvatar({ user }: UserAvatarProps) {
  const initials = user.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((chunk) => chunk[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <div
      className={`relative flex h-12 w-12 items-center justify-center rounded-full border border-white/80 bg-gradient-to-br ${user.avatarGradient} text-sm font-semibold text-white shadow-md shadow-slate-300/40`}
    >
      {initials || "MM"}
      {user.availability === "ONLINE" ? (
        <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-slate-950 bg-emerald-400" />
      ) : null}
    </div>
  );
}
