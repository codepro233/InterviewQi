"use client";

import { useEffect, useState } from "react";

export default function ScoreTrend({ exchanges }) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 300);
    return () => clearTimeout(t);
  }, []);

  if (!exchanges?.length) return null;

  const scores = exchanges.map((e) => e.feedback?.score ?? 0);
  const max    = 100;
  const min    = 0;
  const width  = 100 / scores.length;

  return (
    <div className="bg-navy-800 border border-navy-600 rounded-2xl p-6">
      <p className="text-xs text-text-muted uppercase tracking-widest font-semibold mb-5">
        Score per Question
      </p>

      {/* Bar chart */}
      <div className="flex items-end gap-2 h-24">
        {scores.map((score, i) => {
          const pct   = ((score - min) / (max - min)) * 100;
          const color =
            score >= 75
              ? "bg-success"
              : score >= 55
              ? "bg-warning"
              : "bg-danger";

          return (
            <div
              key={i}
              className="flex-1 flex flex-col items-center gap-1"
            >
              <span className="text-text-muted text-xs font-medium">
                {score}
              </span>
              <div className="w-full bg-navy-600 rounded-t-lg overflow-hidden" style={{ height: 64 }}>
                <div
                  className={`w-full rounded-t-lg transition-all duration-700 ${color}`}
                  style={{
                    height: animated ? `${pct}%` : "0%",
                    transitionDelay: `${i * 100}ms`,
                  }}
                />
              </div>
              <span className="text-text-muted text-xs">Q{i + 1}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}