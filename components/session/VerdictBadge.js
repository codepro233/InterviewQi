const VERDICT_MAP = {
  "Strong Hire": {
    color: "text-success",
    bg: "bg-success/10",
    border: "border-success/30",
    icon: "🏆",
  },
  "Hire": {
    color: "text-blue-accent",
    bg: "bg-blue-glow",
    border: "border-blue-muted",
    icon: "✅",
  },
  "Almost Ready": {
    color: "text-warning",
    bg: "bg-warning/10",
    border: "border-warning/30",
    icon: "📈",
  },
  "Not Yet": {
    color: "text-danger",
    bg: "bg-danger/10",
    border: "border-danger/30",
    icon: "🔁",
  },
};

export default function VerdictBadge({ verdict, size = "md" }) {
  const style = VERDICT_MAP[verdict] ?? {
    color: "text-text-secondary",
    bg: "bg-navy-700",
    border: "border-navy-500",
    icon: "—",
  };

  const sizeClass =
    size === "lg"
      ? "text-base px-5 py-2 gap-2"
      : "text-xs px-3 py-1.5 gap-1.5";

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full border ${style.bg} ${style.border} ${style.color} ${sizeClass}`}
    >
      <span>{style.icon}</span>
      <span>{verdict}</span>
    </span>
  );
}