type StatusBadgeProps = {
  label: string;
  /** Larger, higher-contrast treatment for presence and key dashboard states */
  size?: "default" | "prominent";
};

const styles: Record<string, string> = {
  ONLINE: "border-emerald-200/90 bg-emerald-50 text-emerald-800",
  OFFLINE: "border-slate-200 bg-slate-100/95 text-slate-500",
  ACTIVE: "border-rose-200 bg-rose-100 text-rose-800",
  UPCOMING: "border-red-200 bg-red-50 text-red-800",
  ACCEPTED: "border-emerald-200 bg-emerald-100 text-emerald-700",
  REQUESTED: "border-amber-200 bg-amber-100 text-amber-700",
  DECLINED: "border-rose-200 bg-rose-100 text-rose-700",
  INVITE_SENT: "border-rose-200 bg-rose-50 text-rose-800",
  APPROVAL_SENT: "border-emerald-200 bg-emerald-100 text-emerald-700",
  JOIN_RESPONSE: "border-amber-200 bg-amber-100 text-amber-700",
  MEETUP_UPDATED: "border-rose-200 bg-rose-100 text-rose-800",
  SYSTEM_UPDATE: "border-slate-200 bg-slate-100 text-slate-700",
  NEARBY_PRESENCE: "border-rose-200 bg-rose-50 text-rose-800",
  PENDING: "border-slate-200 bg-slate-50 text-slate-600",
};

export function StatusBadge({ label, size = "default" }: StatusBadgeProps) {
  const prominent = size === "prominent";
  const dotClass =
    label === "ONLINE"
      ? prominent
        ? "bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.35)] animate-pulse"
        : "bg-emerald-500 shadow-[0_0_0_3px_rgba(16,185,129,0.25)] animate-pulse"
      : label === "OFFLINE"
        ? prominent
          ? "bg-slate-400 opacity-95"
          : "bg-slate-300 opacity-90"
        : "bg-current opacity-80";

  const dotSize = prominent ? "h-2 w-2" : "h-1.5 w-1.5";
  const textSize = prominent ? "text-xs tracking-[0.12em]" : "text-[11px] tracking-wide";
  const pad = prominent ? "px-3 py-1.5" : "px-2.5 py-1";

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border font-semibold uppercase ${textSize} ${pad} ${
        styles[label] ?? "border-slate-200 bg-slate-100 text-slate-700"
      }`}
    >
      <span className={`shrink-0 rounded-full ${dotSize} ${dotClass}`} />
      {label}
    </span>
  );
}
