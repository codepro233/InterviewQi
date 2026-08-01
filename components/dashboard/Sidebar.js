"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: "⊞" },
  { href: "/interview/new", label: "New Interview", icon: "＋" },
  { href: "/history", label: "History", icon: "◷" },
  { href: "/upgrade", label: "Upgrade", icon: "⬆" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const NavContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-navy-600">
        <Link href="/dashboard" className="font-display text-xl font-bold">
          Interview<span className="text-blue-accent">IQ</span>
        </Link>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-blue-glow border border-blue-muted text-blue-accent"
                  : "text-text-secondary hover:text-text-primary hover:bg-navy-700"
              }`}
            >
              <span className="text-base w-5 text-center">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Sign out */}
      <div className="px-4 py-6 border-t border-navy-600">
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-text-secondary hover:text-danger hover:bg-danger/10 transition-all"
        >
          <span className="text-base w-5 text-center">→</span>
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 bg-navy-900 border-r border-navy-600 flex-col z-40">
        <NavContent />
      </aside>

      {/* Mobile topbar toggle */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 h-16 bg-navy-900 border-b border-navy-600 flex items-center justify-between px-6">
        <Link href="/dashboard" className="font-display text-lg font-bold">
          Interview<span className="text-blue-accent">IQ</span>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-text-secondary"
        >
          <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
            {mobileOpen ? (
              <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-navy-900 border-r border-navy-600">
            <NavContent />
          </aside>
        </div>
      )}

      {/* Mobile top spacer */}
      <div className="lg:hidden h-16" />
    </>
  );
}