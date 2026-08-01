const PRESET_ROLES = [
  { label: "Software Engineer",  icon: "💻" },
  { label: "Product Manager",    icon: "📋" },
  { label: "UX Designer",        icon: "🎨" },
  { label: "Data Analyst",       icon: "📊" },
  { label: "Marketing Manager",  icon: "📣" },
  { label: "Sales Executive",    icon: "🤝" },
  { label: "DevOps Engineer",    icon: "⚙️" },
  { label: "Business Analyst",   icon: "📈" },
  { label: "Frontend Developer", icon: "🖥️" },
  { label: "Backend Developer",  icon: "🗄️" },
  { label: "Data Scientist",     icon: "🔬" },
  { label: "Project Manager",    icon: "🗂️" },
];

export default function RolePicker({ value, onChange }) {
  const isCustom = value && !PRESET_ROLES.find((r) => r.label === value);

  return (
    <div>
      <label className="block text-xs text-text-secondary uppercase tracking-widest mb-3 font-semibold">
        Target Role
      </label>

      {/* Preset grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
        {PRESET_ROLES.map((r) => (
          <button
            key={r.label}
            type="button"
            onClick={() => onChange(r.label)}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-left transition-all border ${
              value === r.label && !isCustom
                ? "bg-blue-glow border-blue-accent text-blue-accent"
                : "bg-navy-800 border-navy-600 text-text-secondary hover:border-navy-500 hover:text-text-primary"
            }`}
          >
            <span className="text-base flex-shrink-0">{r.icon}</span>
            <span className="truncate">{r.label}</span>
          </button>
        ))}
      </div>

      {/* Custom role input */}
      <div className="relative">
        <input
          type="text"
          placeholder="Or type a custom role…"
          value={isCustom ? value : ""}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full bg-navy-800 border rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-muted transition-colors outline-none ${
            isCustom
              ? "border-blue-accent"
              : "border-navy-600 focus:border-blue-accent"
          }`}
        />
        {isCustom && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-accent text-xs font-medium">
            Custom
          </span>
        )}
      </div>
    </div>
  );
}