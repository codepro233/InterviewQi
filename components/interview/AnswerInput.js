import { useState } from "react";

export default function AnswerInput({ onSubmit, disabled }) {
  const [value, setValue] = useState("");

  const handleSubmit = () => {
    if (!value.trim() || disabled) return;
    onSubmit(value.trim());
    setValue("");
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const charCount = value.length;
  const isReady   = value.trim().length >= 10;

  return (
    <div className="bg-navy-800 border border-navy-600 rounded-2xl p-4">
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKey}
        disabled={disabled}
        placeholder="Type your answer here… (Shift+Enter for new line, Enter to submit)"
        rows={4}
        className="w-full bg-transparent text-text-primary placeholder:text-text-muted text-sm leading-relaxed resize-none outline-none disabled:opacity-50"
      />

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-navy-600">
        <div className="flex items-center gap-3">
          <span className={`text-xs ${charCount > 0 ? "text-text-muted" : "text-navy-500"}`}>
            {charCount} characters
          </span>
          {!isReady && charCount > 0 && (
            <span className="text-xs text-text-muted">
              Keep going…
            </span>
          )}
        </div>

        <button
          onClick={handleSubmit}
          disabled={!isReady || disabled}
          className="flex items-center gap-2 bg-blue-accent hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-opacity"
        >
          {disabled ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Processing…
            </>
          ) : (
            <>
              Submit Answer
              <span className="text-white/60 text-xs">↵</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}