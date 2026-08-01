"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import ScoreRing from "@/components/session/ScoreRing";
import VerdictBadge from "@/components/session/VerdictBadge";
import ExchangeReview from "@/components/session/ExchangeReview";
import ActionPlan from "@/components/session/ActionPlan";
import ScoreTrend from "@/components/session/ScoreTrend";
import ExportPDFButton from "@/components/session/ExportPDFButton";

export default function SessionReportPage() {
  const { id }  = useParams();
  const router  = useRouter();

  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  useEffect(() => {
    if (!id) return;
    fetch(`/api/session/${id}`)
      .then((r) => r.json())
      .then((d) => {
        if (!d.success) {
          setError(d.error ?? "Failed to load report");
        } else {
          setData(d.session);
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Network error. Please refresh.");
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-8 h-8 border-2 border-blue-accent border-t-transparent rounded-full animate-spin" />
        <p className="text-text-secondary text-sm">Loading your report…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-danger text-sm">{error}</p>
        <Link href="/dashboard" className="text-blue-accent text-sm hover:underline">
          ← Back to Dashboard
        </Link>
      </div>
    );
  }

  const { role, level, interviewType, report, exchanges, createdAt, durationSeconds } = data;

  const duration = durationSeconds
    ? `${Math.floor(durationSeconds / 60)}m ${durationSeconds % 60}s`
    : "—";

  const date = new Date(createdAt).toLocaleDateString("en-NG", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="max-w-3xl mx-auto animate-fade-up">

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-text-muted text-sm mb-6">
        <Link href="/dashboard" className="hover:text-text-secondary transition-colors">
          Dashboard
        </Link>
        <span>/</span>
        <Link href="/history" className="hover:text-text-secondary transition-colors">
          History
        </Link>
        <span>/</span>
        <span className="text-text-secondary truncate">Session Report</span>
      </div>

      {/* Hero card */}
      <div className="bg-navy-800 border border-navy-600 rounded-2xl p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">

          {/* Score ring */}
          <div className="flex-shrink-0">
            <ScoreRing score={report?.overallScore ?? 0} size={130} />
          </div>

          {/* Info */}
          <div className="flex-1 text-center sm:text-left">
            <h2 className="font-display text-2xl font-bold text-text-primary mb-1">
              {role}
            </h2>
            <p className="text-text-secondary text-sm mb-4">
              {level} · {interviewType} · {date}
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mb-4">
              <VerdictBadge verdict={report?.verdict} size="lg" />
              <span className="text-xs bg-navy-700 border border-navy-500 text-text-secondary px-3 py-1.5 rounded-full">
                {report?.readinessLevel}
              </span>
              <span className="text-xs bg-navy-700 border border-navy-500 text-text-secondary px-3 py-1.5 rounded-full">
                ⏱ {duration}
              </span>
            </div>

            {/* Session meta */}
            <div className="flex flex-wrap gap-4 text-sm">
              <div>
                <span className="text-text-muted text-xs block uppercase tracking-wide mb-0.5">
                  Questions
                </span>
                <span className="text-text-primary font-semibold">
                  {exchanges?.length ?? 0} answered
                </span>
              </div>
              <div>
                <span className="text-text-muted text-xs block uppercase tracking-wide mb-0.5">
                  Avg Score
                </span>
                <span className="text-text-primary font-semibold">
                  {report?.overallScore ?? "—"} / 100
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Two column — strength + growth */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-navy-800 border border-navy-600 rounded-2xl p-5">
          <p className="text-xs text-success uppercase tracking-widest font-semibold mb-3">
            ✅ Top Strength
          </p>
          <p className="text-text-secondary text-sm leading-relaxed">
            {report?.topStrength ?? "—"}
          </p>
        </div>
        <div className="bg-navy-800 border border-navy-600 rounded-2xl p-5">
          <p className="text-xs text-warning uppercase tracking-widest font-semibold mb-3">
            📈 Growth Area
          </p>
          <p className="text-text-secondary text-sm leading-relaxed">
            {report?.topGrowthArea ?? "—"}
          </p>
        </div>
      </div>

      {/* Score trend */}
      {exchanges?.length > 0 && (
        <div className="mb-6">
          <ScoreTrend exchanges={exchanges} />
        </div>
      )}

      {/* Action plan */}
      {report?.actionPlan?.length > 0 && (
        <div className="mb-6">
          <ActionPlan items={report.actionPlan} />
        </div>
      )}

      {/* Q&A Review */}
      {exchanges?.length > 0 && (
        <div className="mb-6">
          <h3 className="font-display font-semibold text-text-primary mb-4">
            Answer Review
          </h3>
          <div className="space-y-3">
            {exchanges.map((ex, i) => (
              <ExchangeReview key={i} exchange={ex} index={i} />
            ))}
          </div>
        </div>
      )}

      {/* Action buttons */}
<div className="flex flex-col sm:flex-row gap-3 mb-8">
  <Link
    href="/interview/new"
    className="flex-1 text-center bg-blue-accent hover:opacity-90 text-white font-semibold py-3 rounded-xl text-sm transition-opacity shadow-lg shadow-blue-accent/20"
  >
    Practice Again →
  </Link>
  <Link
    href="/history"
    className="flex-1 text-center bg-navy-800 hover:bg-navy-700 border border-navy-600 text-text-primary font-medium py-3 rounded-xl text-sm transition-colors"
  >
    View All Sessions
  </Link>
</div>

{/* PDF Export */}
<div className="mb-8">
  <ExportPDFButton sessionData={data} />
</div>

    </div>
  );
}