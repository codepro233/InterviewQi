import { SkeletonSessionRow } from "@/components/ui/Skeleton";

export default function HistoryLoading() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between">
        <div className="space-y-2">
          <div className="h-7 w-40 bg-navy-700 rounded-xl animate-pulse" />
          <div className="h-4 w-56 bg-navy-700 rounded-xl animate-pulse" />
        </div>
        <div className="h-10 w-32 bg-navy-700 rounded-xl animate-pulse" />
      </div>
      <div className="flex gap-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-9 w-24 bg-navy-700 rounded-xl animate-pulse" />
        ))}
      </div>
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <SkeletonSessionRow key={i} />
        ))}
      </div>
    </div>
  );
}