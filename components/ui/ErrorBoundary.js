"use client";

import { Component } from "react";
import Link from "next/link";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="font-display font-bold text-text-primary text-xl mb-2">
            Something went wrong
          </h2>
          <p className="text-text-secondary text-sm mb-6 max-w-sm">
            An unexpected error occurred. Your session data is safe.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="bg-blue-accent hover:opacity-90 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-opacity"
            >
              Try Again
            </button>
            <Link
              href="/dashboard"
              className="bg-navy-800 border border-navy-600 hover:bg-navy-700 text-text-primary font-medium px-5 py-2.5 rounded-xl text-sm transition-colors"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}