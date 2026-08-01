export default function StatCard({ label, value, sub, accent }) {
  return (
    <div className="bg-navy-800 border border-navy-600 rounded-2xl p-6">
      <p className="text-text-secondary text-xs font-semibold tracking-widest uppercase mb-3">
        {label}
      </p>
      <p className={`font-display text-4xl font-bold mb-1 ${accent ?? "text-text-primary"}`}>
        {value ?? "—"}
      </p>
      {sub && (
        <p className="text-text-muted text-xs">{sub}</p>
      )}
    </div>
  );
}