import Link from "next/link";
import { ReactNode } from "react";

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
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[1320px] gap-6 px-4 py-6 lg:px-8">
      <aside className="glass-card hidden w-72 shrink-0 p-4 lg:block">
        <div>
          <p className="text-xs uppercase tracking-widest text-slate-400">
            MicroMeet
          </p>
          <h2 className="mt-1 text-lg font-semibold text-white">Navigation</h2>
        </div>
        <nav className="mt-5 space-y-2">
          {navItems.map((item) => {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center justify-between rounded-2xl px-3 py-2 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
              >
                <span>{item.label}</span>
                <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-slate-300">
                  {item.useCase}
                </span>
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {title || subtitle || actions ? (
          <header className="glass-card mb-6 p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                {title ? (
                  <h1 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
                    {title}
                  </h1>
                ) : null}
                {subtitle ? (
                  <p className="mt-2 text-sm text-slate-300 md:text-base">{subtitle}</p>
                ) : null}
              </div>
              {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
            </div>
          </header>
        ) : null}

        <main className="space-y-6">{children}</main>
      </div>
    </div>
  );
}

export function LayoutShellPage({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[1320px] gap-6 px-4 py-6 lg:px-8">
      <aside className="glass-card hidden w-72 shrink-0 p-4 lg:block">
        <div>
          <p className="text-xs uppercase tracking-widest text-slate-400">
            MicroMeet
          </p>
          <h2 className="mt-1 text-lg font-semibold text-white">Navigation</h2>
        </div>
        <nav className="mt-5 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center justify-between rounded-2xl px-3 py-2 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
            >
              <span>{item.label}</span>
              <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-slate-300">
                {item.useCase}
              </span>
            </Link>
          ))}
        </nav>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <main className="space-y-6">{children}</main>
      </div>
    </div>
  );
}
