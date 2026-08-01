const FEATURES = [
  {
    icon: "🎯",
    title: "Role-specific questions",
    desc: "Questions tailored to your exact role, seniority level, and interview format — not generic fluff.",
  },
  {
    icon: "⚡",
    title: "Instant feedback",
    desc: "Every answer is scored out of 100. Get your strengths, improvement areas, and a pro tip in seconds.",
  },
  {
    icon: "🧠",
    title: "3 interview formats",
    desc: "Behavioral (STAR method), Technical (role-specific knowledge), and Situational (judgment calls).",
  },
  {
    icon: "📊",
    title: "Session reports",
    desc: "End-of-session score, hire verdict, readiness level, and a 3-step action plan to improve.",
  },
  {
    icon: "📄",
    title: "PDF export",
    desc: "Download your full session report as a PDF. Review it offline, share with a mentor, track progress.",
  },
  {
    icon: "📈",
    title: "Full history",
    desc: "Every session saved. Track your scores over time and see exactly how far you've come.",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-blue-accent text-sm font-semibold tracking-widest uppercase mb-3">
            Features
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-text-primary tracking-tight mb-4">
            Everything you need to
            <br />
            <span className="text-blue-accent">ace your next interview</span>
          </h2>
          <p className="text-text-secondary text-lg max-w-xl mx-auto">
            Built for job seekers who take preparation seriously.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => (
            <div
              key={i}
              className="bg-navy-800 border border-navy-600 hover:border-navy-500 rounded-2xl p-6 transition-colors group"
            >
              <div className="w-12 h-12 bg-blue-glow border border-blue-muted rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                {f.icon}
              </div>
              <h3 className="font-display font-semibold text-text-primary text-lg mb-2">
                {f.title}
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}