"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const PLANS = [
  {
    id:     "pro",
    name:   "Pro",
    price:  "₦3,000",
    period: "/ month",
    desc:   "For serious job seekers",
    color:  "blue",
    features: [
      "Unlimited sessions",
      "All 3 interview formats",
      "Per-answer feedback",
      "Full session history",
      "PDF export",
      "Priority AI responses",
    ],
  },
  {
    id:     "agency",
    name:   "Agency",
    price:  "₦8,000",
    period: "/ month",
    desc:   "For coaches & recruiters",
    color:  "success",
    features: [
      "Everything in Pro",
      "Up to 5 team seats",
      "Candidate management",
      "Bulk session export",
      "Priority support",
    ],
  },
];

export default function UpgradePage() {
  const { data: authSession, update } = useSession();
  const searchParams = useSearchParams();

  const [subStatus,   setSubStatus]   = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [paying,      setPaying]      = useState("");
  const [cancelling,  setCancelling]  = useState(false);
  const [cancelDone,  setCancelDone]  = useState(false);
  const [error,       setError]       = useState("");

  const reason   = searchParams.get("reason");
  const upgraded = searchParams.get("upgraded");
  const errParam = searchParams.get("error");

  useEffect(() => {
    fetchStatus();
  }, []);

  // Handle upgraded redirect
  useEffect(() => {
    if (upgraded === "true") {
      update(); // Refresh NextAuth session to pick up new plan
    }
  }, [upgraded]);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const res  = await fetch("/api/subscription/status");
      const data = await res.json();
      if (data.success) setSubStatus(data);
    } catch {}
    setLoading(false);
  };

  const handleUpgrade = async (planId) => {
    setError("");
    setPaying(planId);

    try {
      const res  = await fetch("/api/subscription/initiate", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ plan: planId }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Failed to initiate payment");
        return;
      }

      // Redirect to Paystack checkout
      window.location.href = data.authorizationUrl;
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setPaying("");
    }
  };

  const handleCancel = async () => {
    if (!confirm("Cancel your subscription? You'll keep access until the end of your billing period.")) return;
    setCancelling(true);
    setError("");

    try {
      const res  = await fetch("/api/subscription/cancel", { method: "POST" });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Failed to cancel subscription");
        return;
      }

      setCancelDone(true);
      await fetchStatus();
      await update();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setCancelling(false);
    }
  };

  const currentPlan = subStatus?.plan ?? authSession?.user?.plan ?? "free";

  const periodEnd = subStatus?.subscription?.currentPeriodEnd
    ? new Date(subStatus.subscription.currentPeriodEnd).toLocaleDateString(
        "en-NG",
        { day: "numeric", month: "long", year: "numeric" }
      )
    : null;

  return (
    <div className="max-w-3xl mx-auto animate-fade-up">

      {/* Header */}
      <div className="mb-8">
        <h2 className="font-display text-2xl font-bold text-text-primary mb-1">
          Upgrade your plan
        </h2>
        <p className="text-text-secondary text-sm">
          Unlock unlimited sessions, PDF exports, and full history.
        </p>
      </div>

      {/* Banners */}
      {reason === "limit" && (
        <div className="bg-warning/10 border border-warning/30 rounded-2xl px-5 py-4 mb-6">
          <p className="text-warning text-sm font-medium">
            🚫 You've used all 3 free sessions this month.
          </p>
          <p className="text-warning/70 text-xs mt-1">
            Upgrade to Pro for unlimited practice sessions.
          </p>
        </div>
      )}

      {upgraded === "true" && (
        <div className="bg-success/10 border border-success/30 rounded-2xl px-5 py-4 mb-6">
          <p className="text-success text-sm font-medium">
            🎉 Payment successful! You're now on the {currentPlan} plan.
          </p>
          <Link href="/dashboard" className="text-success/70 text-xs hover:underline mt-1 inline-block">
            Go to Dashboard →
          </Link>
        </div>
      )}

      {errParam && (
        <div className="bg-danger/10 border border-danger/30 rounded-2xl px-5 py-4 mb-6">
          <p className="text-danger text-sm font-medium">
            {errParam === "payment_failed"
              ? "Payment was not completed. Please try again."
              : errParam === "verify_failed"
              ? "Could not verify payment. Contact support if charged."
              : "Something went wrong. Please try again."}
          </p>
        </div>
      )}

      {cancelDone && (
        <div className="bg-success/10 border border-success/30 rounded-2xl px-5 py-4 mb-6">
          <p className="text-success text-sm font-medium">
            ✓ Subscription cancelled.{" "}
            {periodEnd ? `You keep access until ${periodEnd}.` : ""}
          </p>
        </div>
      )}

      {error && (
        <div className="bg-danger/10 border border-danger/30 text-danger text-sm rounded-2xl px-5 py-4 mb-6">
          {error}
        </div>
      )}

      {/* Current plan status */}
      {!loading && (
        <div className="bg-navy-800 border border-navy-600 rounded-2xl p-5 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-xs uppercase tracking-widest font-semibold mb-1">
                Current Plan
              </p>
              <p className="text-text-primary font-display font-bold text-xl capitalize">
                {currentPlan}
              </p>
              {currentPlan === "free" && (
                <p className="text-text-muted text-xs mt-1">
                  {subStatus?.freeSessionsUsed ?? 0} / 3 sessions used this month
                </p>
              )}
              {currentPlan !== "free" && periodEnd && (
                <p className="text-text-muted text-xs mt-1">
                  {subStatus?.subscription?.status === "cancelled"
                    ? `Access until ${periodEnd}`
                    : `Renews ${periodEnd}`}
                </p>
              )}
            </div>

            {/* Cancel button for active paid plans */}
            {currentPlan !== "free" &&
              subStatus?.subscription?.status === "active" && (
              <button
                onClick={handleCancel}
                disabled={cancelling}
                className="text-xs text-danger/60 hover:text-danger border border-danger/20 hover:border-danger/40 px-4 py-2 rounded-xl transition-colors disabled:opacity-40"
              >
                {cancelling ? "Cancelling…" : "Cancel subscription"}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Plan cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
        {PLANS.map((plan) => {
          const isCurrentPlan = currentPlan === plan.id;
          const isPaying      = paying === plan.id;
          const isBlue        = plan.color === "blue";

          return (
            <div
              key={plan.id}
              className={`rounded-2xl p-6 border flex flex-col ${
                isBlue
                  ? "bg-blue-accent/10 border-blue-accent"
                  : "bg-success/5 border-success/40"
              }`}
            >
              {/* Plan header */}
              <div className="mb-5">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-display font-bold text-text-primary text-xl">
                    {plan.name}
                  </h3>
                  {isCurrentPlan && (
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-success/10 border border-success/30 text-success">
                      Current
                    </span>
                  )}
                </div>
                <p className="text-text-secondary text-xs mb-4">{plan.desc}</p>
                <div className="flex items-end gap-1">
                  <span className="font-display font-bold text-3xl text-text-primary">
                    {plan.price}
                  </span>
                  <span className="text-text-muted text-sm pb-1">
                    {plan.period}
                  </span>
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-2.5 mb-6 flex-1">
                {plan.features.map((f, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 text-sm text-text-primary"
                  >
                    <span className="text-success mt-0.5 flex-shrink-0">✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              {isCurrentPlan ? (
                <div className="w-full text-center py-3 rounded-xl text-sm font-medium text-text-muted bg-navy-700 border border-navy-500">
                  You're on this plan
                </div>
              ) : (
                <button
                  onClick={() => handleUpgrade(plan.id)}
                  disabled={!!paying}
                  className={`w-full py-3 rounded-xl text-sm font-semibold transition-opacity disabled:opacity-50 disabled:cursor-not-allowed ${
                    isBlue
                      ? "bg-blue-accent hover:opacity-90 text-white shadow-lg shadow-blue-accent/20"
                      : "bg-success/80 hover:opacity-90 text-white shadow-lg shadow-success/20"
                  }`}
                >
                  {isPaying ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Redirecting…
                    </span>
                  ) : (
                    `Upgrade to ${plan.name} →`
                  )}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Free plan comparison */}
      <div className="bg-navy-800 border border-navy-600 rounded-2xl p-5 mb-8">
        <p className="text-text-secondary text-xs uppercase tracking-widest font-semibold mb-4">
          Free Plan Includes
        </p>
        <div className="grid grid-cols-2 gap-2">
          {[
            "3 sessions / month",
            "All interview formats",
            "Per-answer feedback",
            "Session report",
          ].map((f, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-text-secondary">
              <span className="text-success text-xs">✓</span>
              {f}
            </div>
          ))}
          {[
            "Session history",
            "PDF export",
            "Unlimited sessions",
            "Priority AI",
          ].map((f, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-text-muted line-through">
              <span className="text-text-muted text-xs">✗</span>
              {f}
            </div>
          ))}
        </div>
      </div>

      {/* Trust badges */}
      <div className="flex flex-wrap items-center justify-center gap-6 text-text-muted text-xs">
        <div className="flex items-center gap-2">
          <span className="text-success">🔒</span>
          Secured by Paystack
        </div>
        <div className="flex items-center gap-2">
          <span className="text-success">✓</span>
          7-day money-back guarantee
        </div>
        <div className="flex items-center gap-2">
          <span className="text-success">↩</span>
          Cancel anytime
        </div>
        <div className="flex items-center gap-2">
          <span className="text-success">💳</span>
          Cards, bank transfer, USSD
        </div>
      </div>

    </div>
  );
}