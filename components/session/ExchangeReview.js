export default function ExchangeReview({ exchange, index }) {
  const score = exchange?.feedback?.score ?? null;

  return (
    <div className="bg-navy-800 border border-navy-600 rounded-xl p-5">
      {/* Question */}
      <div className="flex gap-3 mb-4">
        <div className="w-7 h-7 rounded-full bg-blue-glow border border-blue-muted flex items-center justify-center text-xs font-bold text-blue-accent flex-shrink-0">
          Q
        </div>
        <p className="text-text-secondary text-sm leading-relaxed pt-0.5">
          {exchange.question}
        </p>
      </div>

      {/* Answer */}
      <div className="flex gap-3 mb-4">
        <div className="w-7 h-7 rounded-full bg-navy-700 border border-navy-500 flex items-center justify-center text-xs font-bold text-text-secondary flex-shrink-0">
          A
        </div>
        <p className="text-text-primary text-sm leading-relaxed pt-0.5">
          {exchange.answer}
        </p>
      </div>

      {/* Feedback */}
      {exchange.feedback && (
        <div className="bg-navy-900 border border-navy-600 rounded-xl p-4 mt-2">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-text-muted font-semibold uppercase tracking-wider">
              Feedback
            </span>
            {score !== null && (
              <div className="flex items-center gap-1.5 bg-success/10 border border-success/30 rounded-lg px-2.5 py-1">
                <span className="text-success font-bold text-sm">{score}</span>
                <span className="text-text-muted text-xs">/100</span>
              </div>
            )}
          </div>

          {exchange.feedback.strength && (
            <p className="text-xs text-text-secondary mb-2">
              <span className="text-success font-medium">✅ Strength: </span>
              {exchange.feedback.strength}
            </p>
          )}

          {exchange.feedback.improvement && (
            <p className="text-xs text-text-secondary">
              <span className="text-warning font-medium">📈 Improve: </span>
              {exchange.feedback.improvement}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
