export default function ProgressBar({ current, total }) {
  const pct = Math.min(100, (current / total) * 100);

  return (
    <div className="flex items-center gap-4">
      <div className="flex-1 h-2 bg-navy-600 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-accent rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-text-muted text-xs flex-shrink-0 font-medium">
        {current} / {total}
      </span>
    </div>
  );
}