import Link from "next/link";

const VERDICT_STYLES = {
  "Strong Hire":  { color: "text-success",  bg: "bg-success/10",  border: "border-success/30" },
  "Hire":         { color: "text-blue-accent", bg: "bg-blue-glow", border: "border-blue-muted" },
  "Almost Ready": { color: "text-warning",  bg: "bg-warning/10",  border: "border-warning/30" },
  "Not Yet":      { color: "text-danger",   bg: "bg-danger/10",   border: "border-danger/30"  },
};

export default function RecentSessionCard({ session }) {
  const verdict = session?.report?.verdict ?? "—";
  const score   = session?.report?.overallScore ?? null;
  const style   = VERDICT_STYLES[verdict] ?? {
    color: "text-text-secondary",
    bg: "bg-navy-700",
    border: "border-navy-500",
  };

  const date = new Date(session.createdAt).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <Link
      href={`/session/${session._id}`}
      className="flex items-center justify-between bg-navy-800 hover:bg-navy-700 border border-navy-600 rounded-2xl px-5 py-4 transition-colors group"
    >
      <div className="flex items-center gap-4">
        {/* Score circle */}
        <div className="w-12 h-12 rounded-full bg-navy-900 border border-navy-500 flex items-center justify-center flex-shrink-0">
          <span className={`font-display font-bold text-sm ${
            score >= 75 ? "text-success" : score >= 55 ? "text-warning" : "text-danger"
          }`}>
            {score ?? "—"}
          </span>
        </div>

        <div>
          <p className="text-text-primary font-medium text-sm">{session.role}</p>
          <p className="text-text-muted text-xs mt-0.5">
            {session.level} · {session.interviewType} · {date}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${style.bg} ${style.border} ${style.color}`}>
          {verdict}
        </span>
        <span className="text-text-muted group-hover:text-text-secondary transition-colors text-sm">→</span>
      </div>
    </Link>
  );
}