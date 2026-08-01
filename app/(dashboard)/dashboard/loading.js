import { SkeletonCard, SkeletonSessionRow } from "@/components/ui/Skeleton";

export default function DashboardLoading() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="space-y-2">
        <div className="h-7 w-48 bg-navy-700 rounded-xl animate-pulse" />
        <div className="h-4 w-64 bg-navy-700 rounded-xl animate-pulse" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
      <div className="bg-navy-800 border border-navy-600 rounded-2xl h-24 animate-pulse" />
      <div className="space-y-3">
        <SkeletonSessionRow />
        <SkeletonSessionRow />
        <SkeletonSessionRow />
      </div>
    </div>
  );
}