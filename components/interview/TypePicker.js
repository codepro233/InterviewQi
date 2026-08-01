const TYPES = [
  {
    value: "behavioral",
    label: "Behavioral",
    icon: "🧠",
    desc: "STAR-method questions about past experiences and how you handled real situations.",
    tag: "Tell me about a time…",
  },
  {
    value: "technical",
    label: "Technical",
    icon: "⚙️",
    desc: "Role-specific knowledge, problem-solving, and domain expertise questions.",
    tag: "How would you…",
  },
  {
    value: "situational",
    label: "Situational",
    icon: "🎯",
    desc: "Hypothetical scenarios that test your judgment and decision-making.",
    tag: "What would you do if…",
  },
];

export default function TypePicker({ value, onChange }) {
  return (
    <div>
      <label className="block text-xs text-text-secondary uppercase tracking-widest mb-3 font-semibold">
        Interview Format
      </label>
      <div className="flex flex-col gap-2">
        {TYPES.map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() => onChange(t.value)}
            className={`flex items-start gap-4 px-5 py-4 rounded-xl text-left transition-all border ${
              value === t.value
                ? "bg-blue-glow border-blue-accent"
                : "bg-navy-800 border-navy-600 hover:border-navy-500"
            }`}
          >
            <span className="text-2xl flex-shrink-0 mt-0.5">{t.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className={`text-sm font-semibold ${
                  value === t.value ? "text-blue-accent" : "text-text-primary"
                }`}>
                  {t.label}
                </p>
                <span className="text-xs text-text-muted bg-navy-700 border border-navy-500 px-2 py-0.5 rounded-full">
                  {t.tag}
                </span>
              </div>
              <p className="text-text-secondary text-xs leading-relaxed">
                {t.desc}
              </p>
            </div>
            {/* Selected indicator */}
            {value === t.value && (
              <div className="w-5 h-5 rounded-full bg-blue-accent flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}