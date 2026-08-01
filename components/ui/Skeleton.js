export function Skeleton({ className = "" }) {
  return (
    <div
      className={`bg-navy-700 rounded-xl animate-pulse ${className}`}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-navy-800 border border-navy-600 rounded-2xl p-6 space-y-4">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-8 w-16" />
      <Skeleton className="h-3 w-32" />
    </div>
  );
}

export function SkeletonSessionRow() {
  return (
    <div className="flex items-center gap-4 bg-navy-800 border border-navy-600 rounded-2xl px-5 py-4">
      <Skeleton className="w-12 h-12 rounded-full flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-3 w-56" />
      </div>
      <Skeleton className="h-6 w-20 rounded-full" />
    </div>
  );
}

export function SkeletonReport() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-navy-800 border border-navy-600 rounded-2xl p-6">
        <div className="flex gap-6">
          <Skeleton className="w-32 h-32 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-64" />
            <Skeleton className="h-8 w-32 rounded-full" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Skeleton className="h-28 rounded-2xl" />
        <Skeleton className="h-28 rounded-2xl" />
      </div>
      <Skeleton className="h-40 rounded-2xl" />
    </div>
  );
}