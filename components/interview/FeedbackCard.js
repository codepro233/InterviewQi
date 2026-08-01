export default function FeedbackCard({ feedback }) {
  if (!feedback) return null;

  const { score, strength, improvement, tip } = feedback;

  const scoreColor =
    score >= 75 ? "text-success" : score >= 55 ? "text-warning" : "text-danger";
  const scoreBg =
    score >= 75 ? "bg-success/10 border-success/30" : score >= 55 ? "bg-warning/10 border-warning/30" : "bg-danger/10 border-danger/30";

  return (
    <div className="bg-navy-900 border border-navy-500 rounded-2xl p-5 animate-fade-up">
      {/* Score header */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-text-muted uppercase tracking-widest font-semibold">
          Answer Feedback
        </p>
        <div className={`flex items-center gap-1.5 border rounded-lg px-3 py-1 ${scoreBg}`}>
          <span className={`font-display font-bold text-base ${scoreColor}`}>
            {score}
          </span>
          <span className="text-text-muted text-xs">/100</span>
        </div>
      </div>

      {/* Score bar */}
      <div className="h-1.5 bg-navy-600 rounded-full mb-5 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${
            score >= 75 ? "bg-success" : score >= 55 ? "bg-warning" : "bg-danger"
          }`}
          style={{ width: `${score}%` }}
        />
      </div>

      {/* Feedback items */}
      <div className="space-y-4">
        <div className="flex gap-3">
          <div className="w-6 h-6 rounded-full bg-success/10 border border-success/30 flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-success text-xs">✓</span>
          </div>
          <div>
            <p className="text-xs font-semibold text-success mb-1 uppercase tracking-wide">
              Strength
            </p>
            <p className="text-text-secondary text-sm leading-relaxed">{strength}</p>
          </div>
        </div>

        <div className="h-px bg-navy-600" />

        <div className="flex gap-3">
          <div className="w-6 h-6 rounded-full bg-warning/10 border border-warning/30 flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-warning text-xs">↑</span>
          </div>
          <div>
            <p className="text-xs font-semibold text-warning mb-1 uppercase tracking-wide">
              Improve
            </p>
            <p className="text-text-secondary text-sm leading-relaxed">{improvement}</p>
          </div>
        </div>

        <div className="h-px bg-navy-600" />

        <div className="flex gap-3">
          <div className="w-6 h-6 rounded-full bg-blue-glow border border-blue-muted flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-blue-accent text-xs">💡</span>
          </div>
          <div>
            <p className="text-xs font-semibold text-blue-accent mb-1 uppercase tracking-wide">
              Pro Tip
            </p>
            <p className="text-text-secondary text-sm leading-relaxed">{tip}</p>
          </div>
        </div>
      </div>
    </div>
  );
}