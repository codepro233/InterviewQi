const LEVELS = [
  {
    value: "Entry-level",
    label: "Entry-level",
    desc: "0 – 2 years experience",
    icon: "🌱",
  },
  {
    value: "Mid-level",
    label: "Mid-level",
    desc: "2 – 5 years experience",
    icon: "🚀",
  },
  {
    value: "Senior",
    label: "Senior",
    desc: "5 – 9 years experience",
    icon: "⭐",
  },
  {
    value: "Lead / Manager",
    label: "Lead / Manager",
    desc: "10+ years or people management",
    icon: "👑",
  },
];

export default function LevelPicker({ value, onChange }) {
  return (
    <div>
      <label className="block text-xs text-text-secondary uppercase tracking-widest mb-3 font-semibold">
        Seniority Level
      </label>
      <div className="grid grid-cols-2 gap-2">
        {LEVELS.map((l) => (
          <button
            key={l.value}
            type="button"
            onClick={() => onChange(l.value)}
            className={`flex items-start gap-3 px-4 py-3 rounded-xl text-left transition-all border ${
              value === l.value
                ? "bg-blue-glow border-blue-accent"
                : "bg-navy-800 border-navy-600 hover:border-navy-500"
            }`}
          >
            <span className="text-xl flex-shrink-0 mt-0.5">{l.icon}</span>
            <div>
              <p className={`text-sm font-semibold ${
                value === l.value ? "text-blue-accent" : "text-text-primary"
              }`}>
                {l.label}
              </p>
              <p className="text-text-muted text-xs mt-0.5">{l.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}