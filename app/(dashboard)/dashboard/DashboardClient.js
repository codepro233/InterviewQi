"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import StatCard from "@/components/dashboard/StatCard";
import RecentSessionCard from "@/components/dashboard/RecentSessionCard";
import UsageBar from "@/components/dashboard/UsageBar";
import { useSearchParams } from "next/navigation";

export default function DashboardPage() {
  const { data: session } = useSession();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/stats")
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);
  // Show upgrade success toast
const searchParams = useSearchParams();
const [showUpgradeToast, setShowUpgradeToast] = useState(false);

useEffect(() => {
  if (searchParams.get("upgraded") === "true") {
    setShowUpgradeToast(true);
    setTimeout(() => setShowUpgradeToast(false), 5000);
  }
}, [searchParams]);

  const stats = data?.stats;
  const recentSessions = data?.recentSessions ?? [];
  const firstName = session?.user?.name?.split(" ")[0] ?? "there";

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-blue-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-up">
      {/* Upgrade success toast */}
{showUpgradeToast && (
  <div className="fixed top-6 right-6 z-50 bg-success/10 border border-success/30 text-success text-sm font-medium px-5 py-3 rounded-2xl shadow-lg animate-fade-up flex items-center gap-3">
    <span>🎉</span>
    <span>Welcome to Pro! Unlimited sessions unlocked.</span>
    <button
      onClick={() => setShowUpgradeToast(false)}
      className="text-success/50 hover:text-success ml-2"
    >
      ✕
    </button>
  </div>
)}

      {/* Greeting */}
      <div>
        <h2 className="font-display text-2xl font-bold text-text-primary">
          Welcome back, {firstName} 👋
        </h2>
        <p className="text-text-secondary text-sm mt-1">
          Ready to practice? Your next interview could be the one.
        </p>
      </div>

      {/* Free usage bar */}
      {stats?.plan === "free" && (
        <UsageBar
          used={stats ? 3 - (stats.sessionsRemaining ?? 3) : 0}
          plan={stats?.plan}
        />
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Total Sessions"
          value={stats?.totalSessions ?? 0}
          sub="All time"
        />
        <StatCard
          label="This Month"
          value={stats?.sessionsThisMonth ?? 0}
          sub="Completed sessions"
        />
        <StatCard
          label="Avg Score"
          value={stats?.avgScore ? `${stats.avgScore}` : "—"}
          sub="Across all sessions"
          accent={
            stats?.avgScore >= 75
              ? "text-success"
              : stats?.avgScore >= 55
              ? "text-warning"
              : "text-blue-accent"
          }
        />
      </div>

      {/* Start interview CTA */}
      <div className="bg-blue-accent/10 border border-blue-muted rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-display font-bold text-text-primary text-lg mb-1">
            Start a new interview
          </h3>
          <p className="text-text-secondary text-sm">
            Pick your role, level, and format — get 5 questions with instant feedback.
          </p>
        </div>
        <Link
          href="/interview/new"
          className="flex-shrink-0 bg-blue-accent hover:opacity-90 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-opacity shadow-lg shadow-blue-accent/20 whitespace-nowrap"
        >
          Start Interview →
        </Link>
      </div>

      {/* Recent sessions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-semibold text-text-primary">
            Recent Sessions
          </h3>
          {recentSessions.length > 0 && (
            <Link
              href="/history"
              className="text-blue-accent text-sm hover:underline"
            >
              View all →
            </Link>
          )}
        </div>

        {recentSessions.length === 0 ? (
          <div className="bg-navy-800 border border-navy-600 rounded-2xl px-6 py-12 text-center">
            <div className="text-4xl mb-3">🎯</div>
            <p className="text-text-secondary text-sm">
              No sessions yet. Start your first interview above.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentSessions.map((s) => (
              <RecentSessionCard key={s._id} session={s} />
            ))}
          </div>
        )}
      </div>

    </div>
  );
}