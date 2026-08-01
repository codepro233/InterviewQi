"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function ExportPDFButton({ sessionData }) {
  const { data: authSession } = useSession();
  const [loading, setLoading]   = useState(false);
  const [done,    setDone]      = useState(false);

  const isPro =
    authSession?.user?.plan === "pro" ||
    authSession?.user?.plan === "agency";

  // Free users see upgrade prompt
  if (!isPro) {
    return (
      <Link
        href="/upgrade"
        className="flex items-center justify-center gap-2 w-full bg-navy-800 hover:bg-navy-700 border border-navy-600 hover:border-blue-accent text-text-secondary hover:text-blue-accent font-medium py-3 rounded-xl text-sm transition-all group"
      >
        <span>🔒</span>
        <span>Export PDF</span>
        <span className="text-xs bg-blue-glow border border-blue-muted text-blue-accent px-2 py-0.5 rounded-full ml-1 group-hover:bg-blue-accent group-hover:text-white transition-colors">
          Pro
        </span>
      </Link>
    );
  }

  const handleExport = async () => {
  if (loading || done) return;
  setLoading(true);

  try {
    const { generateSessionPDF } = await import("@/lib/generatePDF");
    generateSessionPDF(sessionData);

    // Track in DB (fire and forget)
    fetch(`/api/session/${sessionData._id}/export`, {
      method: "POST",
    }).catch(() => {});

    setDone(true);
    setTimeout(() => setDone(false), 3000);
  } catch (err) {
    console.error("PDF export error:", err);
    alert("Failed to generate PDF. Please try again.");
  } finally {
    setLoading(false);
  }
};

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      className="flex items-center justify-center gap-2 w-full bg-navy-800 hover:bg-navy-700 border border-navy-600 hover:border-blue-accent text-text-primary font-medium py-3 rounded-xl text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? (
        <>
          <span className="w-4 h-4 border-2 border-blue-accent/30 border-t-blue-accent rounded-full animate-spin" />
          Generating PDF…
        </>
      ) : done ? (
        <>
          <span className="text-success">✓</span>
          Downloaded!
        </>
      ) : (
        <>
          <span>📄</span>
          Export PDF Report
        </>
      )}
    </button>
  );
}