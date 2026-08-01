"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-navy-600 bg-navy-950/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="font-display text-xl font-bold">
          Interview<span className="text-blue-accent">IQ</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-text-secondary hover:text-text-primary text-sm transition-colors">
            Features
          </a>
          <a href="#how-it-works" className="text-text-secondary hover:text-text-primary text-sm transition-colors">
            How it works
          </a>
          <a href="#pricing" className="text-text-secondary hover:text-text-primary text-sm transition-colors">
            Pricing
          </a>
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          {session ? (
            <Link
              href="/dashboard"
              className="bg-blue-accent hover:opacity-90 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-opacity"
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="text-text-secondary hover:text-text-primary text-sm transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="bg-blue-accent hover:opacity-90 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-opacity"
              >
                Start Free
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-text-secondary"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
            {menuOpen ? (
              <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-navy-900 border-t border-navy-600 px-6 py-4 flex flex-col gap-4">
          <a href="#features" onClick={() => setMenuOpen(false)} className="text-text-secondary text-sm">Features</a>
          <a href="#how-it-works" onClick={() => setMenuOpen(false)} className="text-text-secondary text-sm">How it works</a>
          <a href="#pricing" onClick={() => setMenuOpen(false)} className="text-text-secondary text-sm">Pricing</a>
          <hr className="border-navy-600" />
          {session ? (
            <Link href="/dashboard" className="text-blue-accent text-sm font-semibold">
              Go to Dashboard →
            </Link>
          ) : (
            <>
              <Link href="/login" className="text-text-secondary text-sm">Sign in</Link>
              <Link href="/register" className="text-blue-accent text-sm font-semibold">
                Start Free →
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}