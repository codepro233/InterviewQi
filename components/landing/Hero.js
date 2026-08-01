import Link from "next/link";

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 pt-24 pb-16">
      <div className="max-w-4xl mx-auto text-center">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-blue-glow border border-blue-muted rounded-full px-4 py-1.5 mb-8">
          <span className="w-2 h-2 rounded-full bg-blue-accent animate-pulse" />
          <span className="text-blue-accent text-xs font-medium tracking-wide">
            AI-Powered Interview Coaching
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-display text-5xl md:text-7xl font-bold text-text-primary leading-[1.1] tracking-tight mb-6">
          Practice interviews.
          <br />
          <span className="text-blue-accent">Land the job.</span>
        </h1>

        {/* Subheadline */}
        <p className="text-text-secondary text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
          InterviewIQ simulates real job interviews with AI, gives you
          instant feedback on every answer, and builds the confidence
          you need to walk in and perform.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link
            href="/register"
            className="w-full sm:w-auto bg-blue-accent hover:opacity-90 text-white font-semibold px-8 py-4 rounded-xl text-base transition-opacity shadow-lg shadow-blue-accent/20"
          >
            Start Practicing Free →
          </Link>
          <a
            href="#how-it-works"
            className="w-full sm:w-auto bg-navy-700 hover:bg-navy-600 border border-navy-500 text-text-primary font-medium px-8 py-4 rounded-xl text-base transition-colors"
          >
            See how it works
          </a>
        </div>

        {/* Social proof */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-text-secondary text-sm">
          <div className="flex items-center gap-2">
            <span className="text-success text-base">✓</span>
            <span>No credit card required</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-navy-500" />
          <div className="flex items-center gap-2">
            <span className="text-success text-base">✓</span>
            <span>3 free sessions per month</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-navy-500" />
          <div className="flex items-center gap-2">
            <span className="text-success text-base">✓</span>
            <span>Instant AI feedback</span>
          </div>
        </div>

        {/* Mock interview UI preview */}
        <div className="mt-16 bg-navy-800 border border-navy-600 rounded-2xl p-6 text-left max-w-2xl mx-auto shadow-2xl">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-danger/60" />
            <div className="w-3 h-3 rounded-full bg-warning/60" />
            <div className="w-3 h-3 rounded-full bg-success/60" />
            <span className="ml-2 text-text-muted text-xs">InterviewIQ — Live Session</span>
          </div>

          {/* Coach message */}
          <div className="flex gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-blue-glow border border-blue-muted flex items-center justify-center text-sm flex-shrink-0">
              🎯
            </div>
            <div className="bg-navy-700 rounded-xl rounded-tl-sm px-4 py-3 text-sm text-text-secondary leading-relaxed">
              Tell me about a time you had to handle a difficult stakeholder.
              How did you manage the situation?
            </div>
          </div>

          {/* User message */}
          <div className="flex justify-end mb-4">
            <div className="bg-blue-glow border border-blue-muted rounded-xl rounded-tr-sm px-4 py-3 text-sm text-text-primary leading-relaxed max-w-xs">
              In my last role, I had a client who kept changing requirements
              mid-sprint. I scheduled a weekly sync to align expectations early…
            </div>
          </div>

          {/* Feedback card */}
          <div className="bg-navy-900 border border-navy-600 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-text-muted font-semibold tracking-wider">
                ANSWER FEEDBACK
              </span>
              <div className="flex items-center gap-1.5 bg-success/10 border border-success/30 rounded-lg px-2.5 py-1">
                <span className="text-success font-bold text-sm">82</span>
                <span className="text-text-muted text-xs">/100</span>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-xs text-text-secondary">
                <span className="text-success font-medium">✅ Strength: </span>
                Great use of a concrete example with measurable actions.
              </p>
              <p className="text-xs text-text-secondary">
                <span className="text-warning font-medium">📈 Improve: </span>
                Add the outcome — what changed after the weekly syncs?
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}