"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-navy-950 flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-6">⚠️</div>
        <h1 className="font-display text-3xl font-bold text-text-primary mb-3">
          Something went wrong
        </h1>
        <p className="text-text-secondary text-sm mb-8 leading-relaxed">
          An unexpected error occurred. Your data is safe — this is likely
          a temporary issue.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="bg-blue-accent hover:opacity-90 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-opacity"
          >
            Try Again
          </button>
          <Link
            href="/dashboard"
            className="bg-navy-800 border border-navy-600 hover:bg-navy-700 text-text-primary font-medium px-6 py-3 rounded-xl text-sm transition-colors"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}