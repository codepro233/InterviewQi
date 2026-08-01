const STEPS = [
  {
    number: "01",
    title: "Choose your role",
    desc: "Pick your target role and seniority level. Select Behavioral, Technical, or Situational interview format.",
    icon: "🎯",
  },
  {
    number: "02",
    title: "Answer 5 real questions",
    desc: "The AI coach asks one question at a time — just like a real interviewer. Type your answer naturally.",
    icon: "💬",
  },
  {
    number: "03",
    title: "Get instant feedback",
    desc: "After each answer, receive a score, a specific strength, one improvement, and a pro tip.",
    icon: "⚡",
  },
  {
    number: "04",
    title: "Review your report",
    desc: "See your overall score, hire verdict, readiness level, and a concrete 3-step action plan.",
    icon: "📊",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-6 bg-navy-900/50">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-blue-accent text-sm font-semibold tracking-widest uppercase mb-3">
            How it works
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-text-primary tracking-tight">
            From setup to feedback
            <br />
            <span className="text-blue-accent">in under 15 minutes</span>
          </h2>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connector line — desktop only */}
          <div className="hidden lg:block absolute top-8 left-[10%] right-[10%] h-px bg-navy-600 z-0" />

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 relative z-10">
            {STEPS.map((step, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                {/* Number circle */}
                <div className="w-16 h-16 rounded-full bg-navy-800 border-2 border-blue-accent flex items-center justify-center mb-4 shadow-lg shadow-blue-accent/10">
                  <span className="font-display font-bold text-blue-accent text-sm">
                    {step.number}
                  </span>
                </div>
                <div className="text-2xl mb-3">{step.icon}</div>
                <h3 className="font-display font-semibold text-text-primary text-lg mb-2">
                  {step.title}
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}