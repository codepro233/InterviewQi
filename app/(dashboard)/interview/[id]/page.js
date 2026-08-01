"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import ProgressBar from "@/components/interview/ProgressBar";
import CoachBubble from "@/components/interview/CoachBubble";
import FeedbackCard from "@/components/interview/FeedbackCard";
import AnswerInput from "@/components/interview/AnswerInput";

export default function InterviewPage() {
  const { id }  = useParams();
  const router  = useRouter();
  const bottomRef = useRef(null);

  const [sessionData,    setSessionData]    = useState(null);
  const [loading,        setLoading]        = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [questionNumber,  setQuestionNumber]  = useState(0);
  const [exchanges,      setExchanges]      = useState([]);
  const [submitting,     setSubmitting]     = useState(false);
  const [askingNext,     setAskingNext]     = useState(false);
  const [error,          setError]          = useState("");
  const [done,           setDone]           = useState(false);

  // Scroll to bottom on new content
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [exchanges, currentQuestion, askingNext]);

  // Load session + ask first question
  useEffect(() => {
    if (!id) return;
    loadSession();
  }, [id]);

  const loadSession = async () => {
    try {
      const res  = await fetch(`/api/interview/${id}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Session not found");
        setLoading(false);
        return;
      }

      const s = data.session;
      setSessionData(s);

      // If session already completed, redirect to report
      if (s.status === "completed") {
        router.replace(`/session/${id}`);
        return;
      }

      // If session has existing exchanges, restore them
      if (s.exchanges?.length > 0) {
        setExchanges(s.exchanges);
        setQuestionNumber(s.exchanges.length);
        // Ask next question from where we left off
        await askNextQuestion(s.exchanges.length);
      } else {
        // Fresh session — ask first question
        await askNextQuestion(0);
      }

      setLoading(false);
    } catch (err) {
      setError("Failed to load session. Please try again.");
      setLoading(false);
    }
  };

  const askNextQuestion = async (currentExchangeCount) => {
    setAskingNext(true);
    setCurrentQuestion("");
    setError("");

    try {
      const res  = await fetch(`/api/interview/${id}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ exchangeCount: currentExchangeCount }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Failed to get question");
        return;
      }

      setCurrentQuestion(data.question);
      setQuestionNumber(data.questionNumber);
    } catch {
      setError("Network error. Please refresh and try again.");
    } finally {
      setAskingNext(false);
    }
  };

  const handleAnswer = async (answer) => {
    if (!currentQuestion || submitting) return;
    setSubmitting(true);
    setError("");

    try {
      const res  = await fetch(`/api/interview/${id}/answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answer,
          question: currentQuestion,
          questionNumber,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Failed to submit answer");
        setSubmitting(false);
        return;
      }

      // Add exchange to local state
      setExchanges((prev) => [
        ...prev,
        {
          questionNumber,
          question: currentQuestion,
          answer,
          feedback: data.feedback,
        },
      ]);

      if (data.isComplete) {
        setDone(true);
        setCurrentQuestion("");
        // Short delay then redirect to report
        setTimeout(() => {
          router.push(`/session/${id}`);
        }, 2500);
      } else {
        // Ask next question
        await askNextQuestion(exchanges.length + 1);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Loading state ──
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-8 h-8 border-2 border-blue-accent border-t-transparent rounded-full animate-spin" />
        <p className="text-text-secondary text-sm">Loading your session…</p>
      </div>
    );
  }

  // ── Error state ──
  if (error && !sessionData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-danger text-sm">{error}</p>
        <Link href="/dashboard" className="text-blue-accent text-sm hover:underline">
          ← Back to Dashboard
        </Link>
      </div>
    );
  }

  const totalQuestions = sessionData?.totalQuestions ?? 5;
  const completedCount = exchanges.length;

  return (
    <div className="max-w-2xl mx-auto">

      {/* Session header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-text-muted text-sm mb-4">
          <Link href="/dashboard" className="hover:text-text-secondary transition-colors">
            Dashboard
          </Link>
          <span>/</span>
          <span className="text-text-secondary truncate">
            {sessionData?.role} Interview
          </span>
        </div>

        {/* Meta row */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs bg-navy-700 border border-navy-500 text-text-secondary px-3 py-1 rounded-full">
              {sessionData?.level}
            </span>
            <span className="text-xs bg-navy-700 border border-navy-500 text-text-secondary px-3 py-1 rounded-full capitalize">
              {sessionData?.interviewType}
            </span>
          </div>
          {!done && (
            <span className="text-text-muted text-xs">
              Q{Math.min(questionNumber, totalQuestions)} of {totalQuestions}
            </span>
          )}
        </div>

        {/* Progress bar */}
        {!done && (
          <ProgressBar current={completedCount} total={totalQuestions} />
        )}
      </div>

      {/* Conversation */}
      <div className="space-y-6 mb-6">

        {/* Render all past exchanges */}
        {exchanges.map((ex, i) => (
          <div key={i} className="space-y-4">
            {/* Coach question */}
            <CoachBubble text={ex.question} />

            {/* Candidate answer */}
            <div className="flex justify-end animate-fade-up">
              <div className="max-w-[80%] bg-blue-glow border border-blue-muted rounded-xl rounded-tr-sm px-5 py-4">
                <p className="text-xs font-semibold text-blue-accent mb-2 uppercase tracking-wide">
                  You
                </p>
                <p className="text-text-primary text-sm leading-relaxed whitespace-pre-wrap">
                  {ex.answer}
                </p>
              </div>
            </div>

            {/* Feedback */}
            <FeedbackCard feedback={ex.feedback} />

            {/* Divider between exchanges */}
            {i < exchanges.length - 1 && (
              <div className="flex items-center gap-3 py-2">
                <div className="flex-1 h-px bg-navy-700" />
                <span className="text-text-muted text-xs">Question {i + 2}</span>
                <div className="flex-1 h-px bg-navy-700" />
              </div>
            )}
          </div>
        ))}

        {/* Current question (being asked or loading) */}
        {!done && (
          <>
            {exchanges.length > 0 && currentQuestion && (
              <div className="flex items-center gap-3 py-2">
                <div className="flex-1 h-px bg-navy-700" />
                <span className="text-text-muted text-xs">
                  Question {exchanges.length + 1}
                </span>
                <div className="flex-1 h-px bg-navy-700" />
              </div>
            )}

            {(askingNext || currentQuestion) && (
              <CoachBubble
                text={currentQuestion}
                isLoading={askingNext}
              />
            )}
          </>
        )}

        {/* Completion message */}
        {done && (
          <div className="text-center py-8 animate-fade-up">
            <div className="text-5xl mb-4">🎯</div>
            <h3 className="font-display font-bold text-text-primary text-xl mb-2">
              Interview Complete!
            </h3>
            <p className="text-text-secondary text-sm mb-1">
              Generating your session report…
            </p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <div className="w-4 h-4 border-2 border-blue-accent border-t-transparent rounded-full animate-spin" />
              <span className="text-text-muted text-xs">
                Redirecting to your report
              </span>
            </div>
          </div>
        )}

        {/* Error inline */}
        {error && (
          <div className="bg-danger/10 border border-danger/30 text-danger text-sm rounded-xl px-4 py-3 animate-fade-up">
            {error}
            <button
              onClick={() => setError("")}
              className="ml-3 text-danger/60 hover:text-danger text-xs underline"
            >
              Dismiss
            </button>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Answer input */}
      {!done && currentQuestion && !askingNext && (
        <div className="sticky bottom-6 animate-fade-up">
          <AnswerInput onSubmit={handleAnswer} disabled={submitting} />
        </div>
      )}

    </div>
  );
}