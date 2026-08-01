export default function ActionPlan({ items }) {
  if (!items?.length) return null;

  return (
    <div className="bg-navy-800 border border-navy-600 rounded-2xl p-6">
      <p className="text-xs text-text-muted uppercase tracking-widest font-semibold mb-5">
        🗺 Your Action Plan
      </p>
      <div className="space-y-4">
        {items.map((action, i) => (
          <div key={i} className="flex gap-4">
            <div className="w-7 h-7 rounded-full bg-blue-glow border border-blue-muted flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-blue-accent text-xs font-bold">{i + 1}</span>
            </div>
            <div className="flex-1 pt-0.5">
              <p className="text-text-secondary text-sm leading-relaxed">
                {action}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}