"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import VerdictBadge from "@/components/session/VerdictBadge";
import ScoreRing from "@/components/session/ScoreRing";

const TYPE_FILTERS = [
  { value: "",            label: "All formats" },
  { value: "behavioral",  label: "Behavioral"  },
  { value: "technical",   label: "Technical"   },
  { value: "situational", label: "Situational" },
];

export default function HistoryPage() {
  const [sessions,    setSessions]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [typeFilter,  setTypeFilter]  = useState("");
  const [page,        setPage]        = useState(1);
  const [pagination,  setPagination]  = useState(null);
  const [error,       setError]       = useState("");

  useEffect(() => {
    loadHistory();
  }, [typeFilter, page]);

  const loadHistory = async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: "10",
        ...(typeFilter && { type: typeFilter }),
      });

      const res  = await fetch(`/api/session/history?${params}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Failed to load history");
        return;
      }

      setSessions(data.sessions);
      setPagination(data.pagination);
    } catch {
      setError("Network error. Please refresh.");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (val) => {
    setTypeFilter(val);
    setPage(1);
  };

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-NG", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const formatDuration = (secs) => {
    if (!secs) return "—";
    return `${Math.floor(secs / 60)}m ${secs % 60}s`;
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-up">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="font-display text-2xl font-bold text-text-primary mb-1">
            Session History
          </h2>
          <p className="text-text-secondary text-sm">
            {pagination?.total
              ? `${pagination.total} session${pagination.total !== 1 ? "s" : ""} completed`
              : "All your completed interview sessions"}
          </p>
        </div>
        <Link
          href="/interview/new"
          className="flex-shrink-0 bg-blue-accent hover:opacity-90 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-opacity shadow-lg shadow-blue-accent/20"
        >
          + New Interview
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {TYPE_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => handleFilterChange(f.value)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
              typeFilter === f.value
                ? "bg-blue-glow border-blue-accent text-blue-accent"
                : "bg-navy-800 border-navy-600 text-text-secondary hover:border-navy-500 hover:text-text-primary"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="bg-danger/10 border border-danger/30 text-danger text-sm rounded-xl px-4 py-3 mb-6">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-navy-800 border border-navy-600 rounded-2xl h-24 animate-pulse"
            />
          ))}
        </div>
      ) : sessions.length === 0 ? (
        /* Empty state */
        <div className="bg-navy-800 border border-navy-600 rounded-2xl px-6 py-16 text-center">
          <div className="text-5xl mb-4">🎯</div>
          <h3 className="font-display font-semibold text-text-primary mb-2">
            No sessions yet
          </h3>
          <p className="text-text-secondary text-sm mb-6">
            {typeFilter
              ? `No ${typeFilter} sessions found. Try a different filter.`
              : "Complete your first interview to see your history here."}
          </p>
          <Link
            href="/interview/new"
            className="inline-block bg-blue-accent hover:opacity-90 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-opacity"
          >
            Start First Interview →
          </Link>
        </div>
      ) : (
        /* Session list */
        <div className="space-y-3">
          {sessions.map((s) => {
            const score = s.report?.overallScore ?? 0;
            return (
              <Link
                key={s._id}
                href={`/session/${s._id}`}
                className="flex items-center gap-4 bg-navy-800 hover:bg-navy-700 border border-navy-600 rounded-2xl px-5 py-4 transition-colors group"
              >
                {/* Score ring — small */}
                <div className="flex-shrink-0">
                  <ScoreRing score={score} size={52} />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-text-primary font-semibold text-sm truncate">
                    {s.role}
                  </p>
                  <p className="text-text-muted text-xs mt-0.5">
                    {s.level} · {s.interviewType} · {formatDate(s.createdAt)}
                  </p>
                  <p className="text-text-muted text-xs mt-0.5">
                    {formatDuration(s.durationSeconds)} · {s.totalQuestions} questions
                  </p>
                </div>

                {/* Right side */}
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <VerdictBadge verdict={s.report?.verdict ?? "—"} />
                  <span className="text-xs text-text-muted capitalize bg-navy-700 border border-navy-500 px-2.5 py-0.5 rounded-full">
                    {s.report?.readinessLevel ?? "—"}
                  </span>
                </div>

                {/* Arrow */}
                <span className="text-text-muted group-hover:text-text-secondary text-sm ml-1 transition-colors">
                  →
                </span>
              </Link>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between mt-8">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-navy-800 border border-navy-600 hover:bg-navy-700 disabled:opacity-30 disabled:cursor-not-allowed text-text-secondary text-sm rounded-xl transition-colors"
          >
            ← Previous
          </button>

          <div className="flex items-center gap-2">
            {[...Array(pagination.totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                  page === i + 1
                    ? "bg-blue-accent text-white"
                    : "bg-navy-800 border border-navy-600 text-text-secondary hover:bg-navy-700"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
            disabled={page === pagination.totalPages}
            className="px-4 py-2 bg-navy-800 border border-navy-600 hover:bg-navy-700 disabled:opacity-30 disabled:cursor-not-allowed text-text-secondary text-sm rounded-xl transition-colors"
          >
            Next →
          </button>
        </div>
      )}

    </div>
  );
}