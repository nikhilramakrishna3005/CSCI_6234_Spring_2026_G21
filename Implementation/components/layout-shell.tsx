"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useAppState } from "@/lib/app-state";
import { StatusBadge } from "@/components/status-badge";
import { UserAvatar } from "@/components/user-avatar";

type NavItem = {
  href: string;
  label: string;
  useCase: string;
};

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", useCase: "1" },
  { href: "/profile", label: "Profile", useCase: "2" },
  { href: "/meetups", label: "Meetup Feed", useCase: "3" },
  { href: "/meetups/create", label: "Create Meetup", useCase: "5" },
  { href: "/meetups/edit", label: "Edit Meetup", useCase: "6" },
  { href: "/participants", label: "Participants", useCase: "7" },
  { href: "/responses", label: "Join Response", useCase: "8" },
  { href: "/notifications", label: "Notifications", useCase: "9" },
];

export function LayoutShell({
  title,
  subtitle,
  actions,
  children,
}: {
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, notifications, logout } = useAppState();
  const unreadCount = notifications.filter((notification) => !notification.read).length;

  const onLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[1360px] gap-6 px-4 py-6 lg:px-8">
      <aside className="glass-card sticky top-4 hidden h-[calc(100vh-2rem)] w-72 shrink-0 p-4 lg:flex lg:flex-col">
        <div className="rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-sky-500 p-4 text-white shadow-lg shadow-indigo-500/25">
          <p className="text-xs uppercase tracking-[0.22em] text-indigo-100">MicroMeet</p>
          <h2 className="mt-1 text-lg font-semibold">Social Discovery Suite</h2>
          <p className="mt-1 text-xs text-indigo-100/90">
            Real-time product demo for micro meetup coordination.
          </p>
        </div>

        {currentUser ? (
          <div className="mt-4 rounded-2xl border border-indigo-100 bg-white/90 p-3">
            <div className="flex items-center gap-3">
              <UserAvatar user={currentUser} />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900">{currentUser.name}</p>
                <p className="truncate text-xs text-slate-500">{currentUser.email}</p>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <StatusBadge label={currentUser.availability} />
              <p className="text-xs text-slate-500">{unreadCount} unread</p>
            </div>
          </div>
        ) : null}

        <nav className="mt-4 space-y-2 overflow-y-auto pr-1">
          {navItems.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between rounded-2xl border px-3 py-2.5 text-sm transition ${
                  active
                    ? "border-indigo-200 bg-indigo-50 text-indigo-700 shadow-sm"
                    : "border-transparent text-slate-600 hover:border-indigo-100 hover:bg-white/80 hover:text-slate-900"
                }`}
              >
                <span className="font-medium">{item.label}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${
                    active ? "bg-indigo-100 text-indigo-700" : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {item.useCase}
                </span>
              </Link>
            );
          })}
        </nav>

        <button onClick={onLogout} className="btn-secondary mt-auto w-full justify-center">
          Logout
        </button>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="glass-card mb-4 flex items-center gap-2 overflow-x-auto p-2 lg:hidden">
          {navItems.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`whitespace-nowrap rounded-xl px-3 py-2 text-xs font-semibold ${
                  active ? "bg-indigo-600 text-white" : "bg-white/85 text-slate-600"
                }`}
              >
                {item.useCase}. {item.label}
              </Link>
            );
          })}
        </div>

        {title || subtitle || actions ? (
          <header className="glass-card mb-6 p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="space-y-2">
                {title ? (
                  <h1 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
                    {title}
                  </h1>
                ) : null}
                {subtitle ? (
                  <p className="max-w-3xl text-sm text-slate-600 md:text-base">{subtitle}</p>
                ) : null}
              </div>
              <div className="flex items-center gap-3">
                {currentUser ? (
                  <div className="hidden rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 sm:block">
                    Signed in as <span className="font-semibold">{currentUser.username}</span>
                  </div>
                ) : null}
                {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
              </div>
            </div>
          </header>
        ) : null}

        <main className="space-y-6">{children}</main>
      </div>
    </div>
  );
}

export function LayoutShellPage({ children }: { children: ReactNode }) {
  return <LayoutShell>{children}</LayoutShell>;
}
