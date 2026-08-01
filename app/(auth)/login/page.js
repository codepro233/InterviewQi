"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";




export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const urlError = searchParams.get("error");
    if (urlError === "Configuration") {
      setError("Google sign-in failed. Please try again or use email/password.");
    } else if (urlError) {
      setError("Something went wrong. Please try again.");
    }
  }, [searchParams]);

  
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });
    

    if (res?.error) {
      const messages = {
        "No account found with this email": "No account found with this email.",
        "Incorrect password": "Incorrect password.",
        "This account uses Google login": "This email is linked to Google. Use 'Continue with Google' instead.",
        "Email and password are required": "Please enter your email and password.",
      };
      setError(messages[res.error] || "Something went wrong. Please try again.");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  };

  const handleGoogle = () => {
    signIn("google", { callbackUrl: "/dashboard" });
  };


  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold">
            Interview<span className="text-blue-accent">IQ</span>
          </h1>
          <p className="text-text-secondary text-sm mt-2">Sign in to your account</p>
        </div>

        <div className="bg-navy-800 border border-navy-600 rounded-2xl p-6">
          <button
            onClick={handleGoogle}
            className="w-full flex items-center justify-center gap-3 bg-navy-700 hover:bg-navy-600 border border-navy-500 text-text-primary rounded-xl py-3 text-sm font-medium transition-colors mb-6"
          >
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
              <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
              <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z"/>
              <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z"/>
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-navy-600" />
            <span className="text-text-muted text-xs">or</span>
            <div className="flex-1 h-px bg-navy-600" />
          </div>

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
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                className="w-full bg-navy-700 border border-navy-600 focus:border-blue-accent text-text-primary rounded-xl px-4 py-3 text-sm transition-colors outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-text-secondary mb-2 uppercase tracking-wider">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                className="w-full bg-navy-700 border border-navy-600 focus:border-blue-accent text-text-primary rounded-xl px-4 py-3 text-sm transition-colors outline-none"
                onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
              />
            </div>

            <div className="flex justify-end">
              <Link href="/forgot-password" className="text-xs text-text-secondary hover:text-blue-accent transition-colors">
                Forgot password?
              </Link>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading || !form.email || !form.password}
              className="w-full bg-blue-accent hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-xl py-3 text-sm transition-opacity"
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </div>
        </div>

        <p className="text-center text-text-secondary text-sm mt-6">
          Don't have an account?{" "}
          <Link href="/register" className="text-blue-accent hover:underline">Create one free</Link>
        </p>
      </div>
    </div>
  );
}