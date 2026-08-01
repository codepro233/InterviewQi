import Link from "next/link";

const FREE_LIMIT = 3;

export default function UsageBar({ used, plan }) {
  if (plan !== "free") return null;

  const remaining = Math.max(0, FREE_LIMIT - (used ?? 0));
  const pct = Math.min(100, ((used ?? 0) / FREE_LIMIT) * 100);

  const barColor =
    remaining === 0
      ? "bg-danger"
      : remaining === 1
      ? "bg-warning"
      : "bg-blue-accent";

  return (
    <div className="bg-navy-800 border border-navy-600 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-text-primary text-sm font-semibold">
            Free sessions
          </p>
          <p className="text-text-muted text-xs mt-0.5">
            {remaining === 0
              ? "You've used all your free sessions this month"
              : `${remaining} of ${FREE_LIMIT} remaining this month`}
          </p>
        </div>
        <Link
          href="/upgrade"
          className="text-xs text-blue-accent hover:underline font-medium flex-shrink-0 ml-4"
        >
          Upgrade →
        </Link>
      </div>

      {/* Bar */}
      <div className="h-2 bg-navy-600 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      {remaining === 0 && (
        <div className="mt-3 bg-danger/10 border border-danger/30 rounded-xl px-4 py-3">
          <p className="text-danger text-xs font-medium">
            Limit reached. Upgrade to Pro for unlimited sessions.
          </p>
        </div>
      )}
    </div>
  );
}