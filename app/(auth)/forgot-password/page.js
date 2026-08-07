"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    setLoading(false);

    if (res.ok) {
      setSent(true);
    } else {
      setError("Something went wrong. Please try again.");
    }
  }

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-sm text-center">
          <h1 className="font-display text-3xl font-bold mb-4">
            Interview<span className="text-blue-accent">IQ</span>
          </h1>
          <div className="bg-navy-800 border border-navy-600 rounded-2xl p-6">
            <p className="text-success text-2xl mb-3">✓</p>
            <h2 className="font-display font-bold text-text-primary mb-2">Check your email</h2>
            <p className="text-text-secondary text-sm">
              If an account exists for <strong>{email}</strong>, a reset link has been sent.
            </p>
            <Link href="/login" className="block mt-6 text-blue-accent hover:underline text-sm">
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold">
            Interview<span className="text-blue-accent">IQ</span>
          </h1>
          <p className="text-text-secondary text-sm mt-2">Reset your password</p>
        </div>

        <div className="bg-navy-800 border border-navy-600 rounded-2xl p-6">
          {error && (
            <div className="bg-danger/10 border border-danger/30 text-danger text-sm rounded-xl px-4 py-3 mb-4">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-xs text-text-secondary mb-2 uppercase tracking-wider">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-navy-700 border border-navy-600 focus:border-blue-accent text-text-primary rounded-xl px-4 py-3 text-sm transition-colors outline-none"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading || !email}
              className="w-full bg-blue-accent hover:opacity-90 disabled:opacity-40 text-white font-semibold rounded-xl py-3 text-sm transition-opacity"
            >
              {loading ? "Sending…" : "Send Reset Link"}
            </button>
          </div>
        </div>

        <p className="text-center text-text-secondary text-sm mt-6">
          <Link href="/login" className="text-blue-accent hover:underline">Back to sign in</Link>
        </p>
      </div>
    </div>
  );
}
