"use client";

import { usePathname } from "next/navigation";

const PAGE_TITLES = {
  "/dashboard": "Dashboard",
  "/interview/new": "New Interview",
  "/history": "Session History",
  "/upgrade": "Upgrade Plan",
};

export default function DashboardTopbar({ user }) {
  const pathname = usePathname();

  const title = Object.entries(PAGE_TITLES).find(([key]) =>
    pathname.startsWith(key)
  )?.[1] ?? "InterviewIQ";

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  return (
    <header className="hidden lg:flex h-16 border-b border-navy-600 bg-navy-900/50 backdrop-blur items-center justify-between px-8">
      <h1 className="font-display font-semibold text-text-primary text-lg">
        {title}
      </h1>

      <div className="flex items-center gap-3">
        {/* Plan badge */}
        <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${
          user?.plan === "pro"
            ? "bg-blue-glow border-blue-muted text-blue-accent"
            : user?.plan === "agency"
            ? "bg-success/10 border-success/30 text-success"
            : "bg-navy-700 border-navy-500 text-text-secondary"
        }`}>
          {user?.plan?.toUpperCase() ?? "FREE"}
        </span>

        {/* Avatar */}
        <div className="w-9 h-9 rounded-full bg-blue-glow border border-blue-muted flex items-center justify-center">
          <span className="text-blue-accent text-xs font-bold">{initials}</span>
        </div>
      </div>
    </header>
  );
}