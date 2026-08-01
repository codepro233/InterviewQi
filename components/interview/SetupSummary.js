export default function SetupSummary({ role, level, interviewType }) {
  if (!role || !level || !interviewType) return null;

  const typeLabels = {
    behavioral: "Behavioral",
    technical: "Technical",
    situational: "Situational",
  };

  const typeIcons = {
    behavioral: "🧠",
    technical: "⚙️",
    situational: "🎯",
  };

  return (
    <div className="bg-navy-900 border border-navy-600 rounded-2xl p-5">
      <p className="text-xs text-text-muted uppercase tracking-widest font-semibold mb-4">
        Session Preview
      </p>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-text-secondary text-sm">Role</span>
          <span className="text-text-primary text-sm font-medium">{role}</span>
        </div>
        <div className="h-px bg-navy-600" />
        <div className="flex items-center justify-between">
          <span className="text-text-secondary text-sm">Level</span>
          <span className="text-text-primary text-sm font-medium">{level}</span>
        </div>
        <div className="h-px bg-navy-600" />
        <div className="flex items-center justify-between">
          <span className="text-text-secondary text-sm">Format</span>
          <span className="text-text-primary text-sm font-medium">
            {typeIcons[interviewType]} {typeLabels[interviewType]}
          </span>
        </div>
        <div className="h-px bg-navy-600" />
        <div className="flex items-center justify-between">
          <span className="text-text-secondary text-sm">Questions</span>
          <span className="text-text-primary text-sm font-medium">5 questions</span>
        </div>
        <div className="h-px bg-navy-600" />
        <div className="flex items-center justify-between">
          <span className="text-text-secondary text-sm">Est. duration</span>
          <span className="text-text-primary text-sm font-medium">10 – 15 min</span>
        </div>
      </div>
    </div>
  );
}