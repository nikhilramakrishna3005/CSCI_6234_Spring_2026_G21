type StatusBadgeProps = {
  label: string;
};

const styles: Record<string, string> = {
  ONLINE: "border-emerald-200 bg-emerald-100 text-emerald-700",
  OFFLINE: "border-slate-200 bg-slate-100 text-slate-600",
  ACTIVE: "border-violet-200 bg-violet-100 text-violet-700",
  UPCOMING: "border-sky-200 bg-sky-100 text-sky-700",
  ACCEPTED: "border-emerald-200 bg-emerald-100 text-emerald-700",
  REQUESTED: "border-amber-200 bg-amber-100 text-amber-700",
  DECLINED: "border-rose-200 bg-rose-100 text-rose-700",
  INVITE_SENT: "border-indigo-200 bg-indigo-100 text-indigo-700",
  APPROVAL_SENT: "border-emerald-200 bg-emerald-100 text-emerald-700",
  JOIN_RESPONSE: "border-amber-200 bg-amber-100 text-amber-700",
  MEETUP_UPDATED: "border-violet-200 bg-violet-100 text-violet-700",
  SYSTEM_UPDATE: "border-slate-200 bg-slate-100 text-slate-700",
};

export function StatusBadge({ label }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold uppercase tracking-wide ${
        styles[label] ?? "border-slate-200 bg-slate-100 text-slate-700"
      }`}
    >
      {label}
    </span>
  );
}
