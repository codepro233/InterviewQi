import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-navy-600 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">

          {/* Logo */}
          <div>
            <span className="font-display text-lg font-bold">
              Interview<span className="text-blue-accent">IQ</span>
            </span>
            <p className="text-text-muted text-xs mt-1">
              Where preparation meets confidence.
            </p>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm text-text-secondary">
            <a href="#features" className="hover:text-text-primary transition-colors">
              Features
            </a>
            <a href="#pricing" className="hover:text-text-primary transition-colors">
              Pricing
            </a>
            <Link href="/login" className="hover:text-text-primary transition-colors">
              Sign in
            </Link>
            <Link href="/register" className="hover:text-text-primary transition-colors">
              Register
            </Link>
          </div>

          {/* Copyright */}
          <p className="text-text-muted text-xs">
            © {new Date().getFullYear()} InterviewIQ. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}