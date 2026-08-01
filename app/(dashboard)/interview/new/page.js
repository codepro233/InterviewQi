"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import RolePicker from "@/components/interview/RolePicker";
import LevelPicker from "@/components/interview/LevelPicker";
import TypePicker from "@/components/interview/TypePicker";
import SetupSummary from "@/components/interview/SetupSummary";

export default function NewInterviewPage() {
  const router = useRouter();
  const { data: session } = useSession();

  const [role, setRole]                = useState("");
  const [level, setLevel]              = useState("Mid-level");
  const [interviewType, setType]       = useState("behavioral");
  const [loading, setLoading]          = useState(false);
  const [error, setError]              = useState("");

  const isReady = role.trim().length > 0;

  const handleStart = async () => {
    if (!isReady || loading) return;
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/interview/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, level, interviewType }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.code === "LIMIT_REACHED") {
          router.push("/upgrade?reason=limit");
          return;
        }
        setError(data.error ?? "Something went wrong. Try again.");
        setLoading(false);
        return;
      }

      // Redirect to the live interview engine
      router.push(`/interview/${data.sessionId}`);
    } catch (err) {
      setError("Network error. Check your connection and try again.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-up">

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-text-muted text-sm mb-3">
          <Link href="/dashboard" className="hover:text-text-secondary transition-colors">
            Dashboard
          </Link>
          <span>/</span>
          <span className="text-text-secondary">New Interview</span>
        </div>
        <h2 className="font-display text-2xl font-bold text-text-primary mb-1">
          Configure your session
        </h2>
        <p className="text-text-secondary text-sm">
          Set up your interview. You'll get 5 questions with instant feedback after each answer.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left — pickers */}
        <div className="lg:col-span-2 space-y-8">

          {/* Role */}
          <RolePicker value={role} onChange={setRole} />

          {/* Divider */}
          <div className="h-px bg-navy-600" />

          {/* Level */}
          <LevelPicker value={level} onChange={setLevel} />

          {/* Divider */}
          <div className="h-px bg-navy-600" />

          {/* Type */}
          <TypePicker value={interviewType} onChange={setType} />

        </div>

        {/* Right — summary + CTA */}
        <div className="flex flex-col gap-4">

          {/* Summary */}
          <SetupSummary
            role={role}
            level={level}
            interviewType={interviewType}
          />

          {/* Plan notice for free users */}
          {session?.user?.plan === "free" && (
            <div className="bg-navy-800 border border-navy-600 rounded-2xl p-4">
              <p className="text-text-secondary text-xs leading-relaxed">
                <span className="text-warning font-semibold">Free plan:</span>{" "}
                3 sessions/month. Responses may take a moment.{" "}
                <Link href="/upgrade" className="text-blue-accent hover:underline">
                  Upgrade for unlimited →
                </Link>
              </p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-danger/10 border border-danger/30 text-danger text-sm rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          {/* CTA */}
          <button
            onClick={handleStart}
            disabled={!isReady || loading}
            className="w-full bg-blue-accent hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl text-sm transition-opacity shadow-lg shadow-blue-accent/20"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Setting up session…
              </span>
            ) : (
              "Start Interview →"
            )}
          </button>

          {!isReady && (
            <p className="text-text-muted text-xs text-center">
              Select or type a role to continue
            </p>
          )}

          {/* Tips */}
          <div className="bg-navy-800 border border-navy-600 rounded-2xl p-4 space-y-2">
            <p className="text-xs text-text-muted uppercase tracking-widest font-semibold mb-3">
              Tips
            </p>
            {[
              "Answer in full sentences like a real interview",
              "Use the STAR method for behavioral questions",
              "It's okay to take a moment before answering",
            ].map((tip, i) => (
              <p key={i} className="text-text-secondary text-xs flex items-start gap-2">
                <span className="text-blue-accent mt-0.5 flex-shrink-0">•</span>
                {tip}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}