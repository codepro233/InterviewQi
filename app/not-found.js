import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-navy-950 flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="font-display text-8xl font-bold text-navy-700 mb-4">
          404
        </div>
        <h1 className="font-display text-3xl font-bold text-text-primary mb-3">
          Page not found
        </h1>
        <p className="text-text-secondary text-sm mb-8">
          This page doesn't exist or was moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/dashboard"
            className="bg-blue-accent hover:opacity-90 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-opacity"
          >
            Go to Dashboard
          </Link>
          <Link
            href="/"
            className="bg-navy-800 border border-navy-600 hover:bg-navy-700 text-text-primary font-medium px-6 py-3 rounded-xl text-sm transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}