export default function ScoreRing({ score, size = 120 }) {
  const radius      = 45;
  const stroke      = 6;
  const normalised  = radius - stroke / 2;
  const circumference = 2 * Math.PI * normalised;
  const offset      = circumference - (score / 100) * circumference;

  const color =
    score >= 75 ? "#34D399" : score >= 55 ? "#FBBF24" : "#F87171";

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 100 100" className="-rotate-90">
        {/* Track */}
        <circle
          cx="50" cy="50" r={normalised}
          fill="none"
          stroke="#1E2A3A"
          strokeWidth={stroke}
        />
        {/* Progress */}
        <circle
          cx="50" cy="50" r={normalised}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s ease" }}
        />
      </svg>
      {/* Score text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="font-display font-bold leading-none"
          style={{ color, fontSize: size * 0.22 }}
        >
          {score}
        </span>
        <span className="text-text-muted" style={{ fontSize: size * 0.1 }}>
          /100
        </span>
      </div>
    </div>
  );
}