"use client";

import { DashboardOverview } from "@/components/dashboard-overview";
import { LayoutShell } from "@/components/layout-shell";

export default function DashboardPage() {
  return (
    <LayoutShell
      title="Dashboard"
      subtitle="Command center for all 9 MicroMeet use cases in one social-style experience."
    >
      <DashboardOverview />
    </LayoutShell>
  );
}
