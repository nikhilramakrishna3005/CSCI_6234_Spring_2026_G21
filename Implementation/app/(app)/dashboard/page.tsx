"use client";

import { DashboardOverview } from "@/components/dashboard-overview";
import { LayoutShell } from "@/components/layout-shell";

export default function DashboardPage() {
  return (
    <LayoutShell
      title="Dashboard"
      subtitle="Command center for discovery, meetup creation, participation workflows, and notifications."
    >
      <DashboardOverview />
    </LayoutShell>
  );
}
