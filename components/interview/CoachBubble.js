export default function CoachBubble({ text, isLoading }) {
  // Strip JSON feedback block from display
  const displayText = text
    ? text.replace(/```json[\s\S]*?```/g, "").trim()
    : "";

  return (
    <div className="flex gap-3 animate-fade-up">
      {/* Avatar */}
      <div className="w-9 h-9 rounded-full bg-blue-glow border border-blue-muted flex items-center justify-center flex-shrink-0 mt-1">
        <span className="text-sm">🎯</span>
      </div>

      <div className="flex-1">
        <p className="text-xs font-semibold text-blue-accent mb-2 uppercase tracking-wide">
          Coach
        </p>

        {isLoading ? (
          <div className="bg-navy-800 border border-navy-600 rounded-xl rounded-tl-sm px-5 py-4 inline-flex items-center gap-2">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-blue-accent inline-block"
                style={{
                  animation: `pulse ${0.8 + i * 0.15}s ease-in-out infinite`,
                  opacity: 0.4 + i * 0.2,
                }}
              />
            ))}
          </div>
        ) : (
          <div className="bg-navy-800 border border-navy-600 rounded-xl rounded-tl-sm px-5 py-4">
            <p className="text-text-secondary text-sm leading-relaxed whitespace-pre-wrap">
              {displayText}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}